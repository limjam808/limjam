exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const data = JSON.parse(event.body);
        const { title, content, labels } = data;

        const PLANE_API_KEY = process.env.PLANE_API_KEY;
        const WORKSPACE_SLUG = 'danawa';
        const PROJECT_ID = 'ce5cce0a-b306-4e83-84df-b86f384f21ec';
        const ADMIN_USER_ID = '2a628ffe-eb35-411f-a26f-0d6c2cca2c58';
        const LABEL_ACCOUNT = 'e18f8084-7cde-45fe-81af-35ee51c807b4';
        const LABEL_PERMISSION = '40b81558-d372-41ae-9c2e-57d755676e82';
        const LABEL_IDS = labels || [LABEL_ACCOUNT, LABEL_PERMISSION];

        const headers = {
            'X-API-Key': PLANE_API_KEY,
            'Content-Type': 'application/json',
        };

        const today = new Date().toISOString().split('T')[0];

        // 1. 워크스페이스 멤버 목록 조회 - 대상자 이메일 확인
        const targetEmail = data.targetEmail;
        if (targetEmail) {
            const wsMembers = await fetch(
                `https://project.cowave.kr/api/v1/workspaces/${WORKSPACE_SLUG}/members/`,
                { headers }
            );
            const wsMembersData = await wsMembers.json();
            const members = wsMembersData.results || [];

            const isWsMember = members.some(m => m.member__email === targetEmail || m.email === targetEmail);

            if (!isWsMember) {
                // 워크스페이스에 초대
                await fetch(
                    `https://project.cowave.kr/api/v1/workspaces/${WORKSPACE_SLUG}/invitations/`,
                    {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ email: targetEmail, role: 5 }),
                    }
                );
            } else {
                // 2. 프로젝트 멤버 확인
                const projMembers = await fetch(
                    `https://project.cowave.kr/api/v1/workspaces/${WORKSPACE_SLUG}/projects/${PROJECT_ID}/members/`,
                    { headers }
                );
                const projMembersData = await projMembers.json();
                const projMemberList = projMembersData.results || [];

                const isProjMember = projMemberList.some(
                    m => m.member__email === targetEmail || m.email === targetEmail
                );

                if (!isProjMember) {
                    // 프로젝트에 멤버 추가
                    const wsMemberObj = members.find(
                        m => m.member__email === targetEmail || m.email === targetEmail
                    );
                    if (wsMemberObj) {
                        await fetch(
                            `https://project.cowave.kr/api/v1/workspaces/${WORKSPACE_SLUG}/projects/${PROJECT_ID}/members/`,
                            {
                                method: 'POST',
                                headers,
                                body: JSON.stringify({
                                    member_id: wsMemberObj.member || wsMemberObj.id,
                                    role: 5,
                                }),
                            }
                        );
                    }
                }
            }
        }

        // 3. Plane 이슈 생성
        const issueBody = {
            name: title,
            description_html: `<p>${content.replace(/\n/g, '<br/>')}</p>`,
            label_ids: LABEL_IDS,
            assignees: [ADMIN_USER_ID],
            start_date: today,
            state: null,
            priority: 'medium',
        };

        const issueRes = await fetch(
            `https://project.cowave.kr/api/v1/workspaces/${WORKSPACE_SLUG}/projects/${PROJECT_ID}/issues/`,
            {
                method: 'POST',
                headers,
                body: JSON.stringify(issueBody),
            }
        );

        if (!issueRes.ok) {
            const errText = await issueRes.text();
            console.error('Plane issue creation failed:', errText);
            return {
                statusCode: issueRes.status,
                body: JSON.stringify({ success: false, error: errText, planeLoginRequired: issueRes.status === 401 || issueRes.status === 403 }),
            };
        }

        const issue = await issueRes.json();
        const issueUrl = `https://project.cowave.kr/${WORKSPACE_SLUG}/projects/${PROJECT_ID}/issues/${issue.id}`;

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, issueUrl, issueId: issue.id }),
        };
    } catch (error) {
        console.error('Function error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};

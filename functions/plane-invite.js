exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const data = JSON.parse(event.body);
        const { targetEmail } = data;

        const PLANE_API_KEY = process.env.PLANE_API_KEY;
        const WORKSPACE_SLUG = 'danawa';
        const PROJECT_ID = 'ce5cce0a-b306-4e83-84df-b86f384f21ec';

        const headers = {
            'X-API-Key': PLANE_API_KEY,
            'Content-Type': 'application/json',
        };

        if (targetEmail) {
            const wsRes = await fetch(
                `https://project.cowave.kr/api/v1/workspaces/${WORKSPACE_SLUG}/members/`,
                { headers }
            );
            const wsMembersData = await wsRes.json();
            const members = wsMembersData.results || [];

            const isWsMember = members.some(m => m.member__email === targetEmail || m.email === targetEmail);

            if (!isWsMember) {
                await fetch(
                    `https://project.cowave.kr/api/v1/workspaces/${WORKSPACE_SLUG}/invitations/`,
                    {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ email: targetEmail, role: 5 }),
                    }
                );
            } else {
                const projRes = await fetch(
                    `https://project.cowave.kr/api/v1/workspaces/${WORKSPACE_SLUG}/projects/${PROJECT_ID}/members/`,
                    { headers }
                );
                const projMembersData = await projRes.json();
                const projMemberList = projMembersData.results || [];

                const isProjMember = projMemberList.some(
                    m => m.member__email === targetEmail || m.email === targetEmail
                );

                if (!isProjMember) {
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

        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
    }
};

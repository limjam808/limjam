const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        console.log('🔍 Request received:', event.body);
        const data = JSON.parse(event.body);
        const { admin, server, teamName, userName, requestLink } = data;
        console.log('✅ Data parsed:', { admin, server, teamName, userName, requestLink });

        // Get current date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        console.log('📅 Today:', today);

        // Create page in Notion database
        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify({
                parent: { database_id: 'b2b3328e-ffb1-4932-a5c2-2b090ad922fc' },
                properties: {
                    '이름': { title: [{ text: { content: userName } }] },
                    '팀명': { rich_text: [{ text: { content: teamName } }] },
                    '통합관리자': { select: { name: admin } },
                    '서버': { select: { name: server } },
                    '관련 요청서 링크': { url: requestLink || null },
                    '접수 일시': { date: { start: today } },
                },
            }),
        });

        console.log('🚀 Notion API Response:', response.status, response.statusText);

        if (response.ok) {
            console.log('✅ Page created successfully');
            const page = await response.json();
            const pageId = page.id;
            console.log('📄 Page ID:', pageId);

            const commentText = `📥 새 로그인 완료 요청이 접수되었습니다.
통합 관리자: ${admin} / 서버: ${server}
팀명: ${teamName} / 이름: ${userName}`;

            // Add comment to the page
            await fetch(`https://api.notion.com/v1/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28',
                },
                body: JSON.stringify({
                    parent: { page_id: pageId },
                    rich_text: [{ text: { content: commentText } }],
                }),
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Notion API Error:', errorText);
            return { statusCode: 502, body: JSON.stringify({ success: false, error: errorText }) };
        }

        return { statusCode: 200, body: JSON.stringify({ success: response.ok }) };
    } catch (error) {
        console.error('💥 Function Error:', error.message);
        console.error('Stack:', error.stack);
        return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
    }
};
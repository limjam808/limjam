const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
          const data = JSON.parse(event.body);
          const { admin, server, teamName, userName, requestLink } = data;

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
                                    'Name': { title: [{ text: { content: `${teamName} ${userName}` } }] },
                                    '통합관리자': { select: { name: admin } },
                                    '서버': { select: { name: server } },
                                    '팀명': { rich_text: [{ text: { content: teamName } }] },
                                    '이름': { rich_text: [{ text: { content: userName } }] },
                        },
              }),
      });

      if (response.ok) {
              const page = await response.json();
              const pageId = page.id;

            const commentText = `📥 새 로그인 완료 요청이 접수되었습니다.
            통합 관리자: ${admin} / 서버: ${server}
            팀명: ${teamName} / 이름: ${userName}`;

            await fetch(`https://api.notion.com/v1/comments`, {
                      method: 'POST',
                      headers: {
                                  'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                                  'Content-Type': 'application/json',
                                  'Notion-Version': '2022-06-28',
                      },
                      body: JSON.stringify({
                          c o n s t   f e tpcahr e=n tr:e q{u ipraeg(e'_niodd:e -pfaegtecIhd' )};,


                                            e x p o r t s . h arnidclhe_rt e=x ta:s y[n{c  t(eexvte:n t{)  c=o>n t{e
                                                                                                                   n t :t rcyo m{m
                                                                                                                   e n t T ecxotn s}t  }d]a,t
                                           a   =   J S O N .}p)a,r
              s e ( e v e n}t).;b
      o d y ) ;}


        c ornesttu r{n  a{d msitna,t usseCrovdeer:,  2t0e0a,m Nbaomdey,:  uJsSeOrNN.asmter,i nrgeiqfuye(s{t Lsiunckc e}s s=:  draetsap;o
                          n
                          s e . o kc o}n)s t} ;r
  e s p}o ncsaet c=h  a(wearirto rf)e t{c
                                        h ( ' h trteptsu:r/n/ a{p is.tnaottuisoCno.dceo:m /5v010/,p abgoedsy':,  J{S
                                                                                                                   O N . s t r imnegtihfoyd(:{  'sPuOcScTe's,s
                                                                                                                                              :   f a l s eh,e aedrerrosr::  {e
                                                                                                                                                                              r r o r . m e s s'aAguet h}o)r i}z;a
                                                                                                                                                                                t i o}n
                                                                                                                   '}:; `Bearer ${process.env.NOTION_API_KEY}`,
                                                                                                                             'Content-Type': 'application/json',
                                                                                                                             'Notion-Version': '2022-06-28',
                                                                                                                     },
                                                                                                                           body: JSON.stringify({
                                                                                                                                     parent: { database_id: 'b2b3328e-ffb1-4932-a5c2-2b090ad922fc' },
                                                                                                                      ver}
                                                                                                                                                팀명: ${teamName} / 이름: ${userName}`;
                                                                                                                             
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

    return { statusCode: 200, body: JSON.stringify({ success: response.ok }) };
} catch (error) {
      return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
}
};properties: {
                                                                                                                                                 'Name': { title: [{ text: { content: `${teamName} ${userName}` } }] },
                                                                                                                                                 '통합관리자': { select: { name: admin } },
                                                                                                                                                 '서버': { select: { name: server } },
                                                                                                                                                 '팀명': { rich_text: [{ text: { content: teamName } }] },
                                                                                                                                                 '이름': { rich_text: [{ text: { content: userName } }] },
                                                                                                                                       },
                                                                                                                             }),
                                                                                                                             });

    if (response.ok) {
            const page = await response.json();
            const pageId = page.id;

      const commentText = `📥 새 로그인 완료 요청이 접수되었습니다.
      통합 관리자: ${admin} / 서버: ${ser

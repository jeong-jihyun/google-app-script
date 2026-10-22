/**
 * 039. 명단의 사람마다 맞춤 인사 메일 초안을 임시보관함에 만들기 (Gemini 사용)
 */
function makeGreetingDrafts() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = sheet.getDataRange().getValues().slice(1); // 1행(제목) 제외
  let count = 0;
  rows.forEach(function (row) {
    const name = row[0], email = row[1], note = row[2];
    if (!name || !email) return;
    const body = askGemini_(
      name + '님께 보낼 따뜻하고 짧은 인사 메일 본문을 한국어로 써 줘. 꼭 넣을 내용: ' + note +
      '\n인사말과 맺음말만 쓰고 제목은 쓰지 마.'
    );
    GmailApp.createDraft(email, name + '님께 드리는 인사', body);
    count++;
  });
  SpreadsheetApp.getActive().toast(count + '개의 초안을 만들었어요.');
}

// ---- 공통 도우미 (002번과 같은 방식) ----
const GEMINI_MODEL = 'gemini-2.5-flash';

function askGemini_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('스크립트 속성에 GEMINI_API_KEY 가 없습니다.');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Gemini 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
}

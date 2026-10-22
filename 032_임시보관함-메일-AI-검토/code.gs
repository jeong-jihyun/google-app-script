/**
 * 032. 임시보관함 메일을 AI가 검토해서 시트에 적기 (Gemini 사용)
 * 메일을 보내거나 고치지 않고, 읽기만 합니다.
 */
function reviewDrafts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('검토');
  if (!sheet) {
    sheet = ss.insertSheet('검토');
    sheet.appendRow(['제목', '받는 사람', '검토 의견']);
  }
  const drafts = GmailApp.getDrafts().slice(0, 5); // 한 번에 5개까지
  drafts.forEach(function (draft) {
    const msg = draft.getMessage();
    const body = msg.getPlainBody().slice(0, 3000);
    const opinion = askGemini_(
      '아래 메일 초안을 보내기 전에 검토해 줘. 오타, 말투, 빠진 정보를 3줄 이내로 한국어로 알려 줘.\n\n' + body
    );
    sheet.appendRow([msg.getSubject(), msg.getTo(), opinion]);
  });
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

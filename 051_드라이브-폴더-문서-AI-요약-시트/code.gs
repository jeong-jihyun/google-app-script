/** 051. 드라이브 폴더 문서 요약표 */
const FOLDER_ID = '여기에_폴더_ID';

function summarizeFolder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('문서요약') || ss.insertSheet('문서요약');
  if (sheet.getLastRow() === 0) sheet.appendRow(['문서 제목', '요약', '주소']);
  const done = sheet.getLastRow() > 1 ? sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().flat() : [];
  const files = DriveApp.getFolderById(FOLDER_ID).getFilesByType(MimeType.GOOGLE_DOCS);
  let count = 0;
  while (files.hasNext() && count < 10) {            // 한 번에 10개까지만
    const f = files.next();
    if (done.indexOf(f.getUrl()) >= 0) continue;     // 이미 한 문서는 건너뜀
    const text = DocumentApp.openById(f.getId()).getBody().getText().substring(0, 4000);
    if (!text.trim()) continue;
    const summary = askClaude_('아래 글을 한국어로 두 문장 이내로 쉽게 요약해 줘.\n\n' + text);
    sheet.appendRow([f.getName(), summary.trim(), f.getUrl()]);
    count++;
  }
  Logger.log(count + '개 문서를 요약했습니다.');
}

// ---- 공통 도우미 (001번과 같은 방식) ----
const CLAUDE_MODEL = 'claude-sonnet-5-5';

function askClaude_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  if (!apiKey) throw new Error('스크립트 속성에 CLAUDE_API_KEY 가 없습니다.');
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Claude 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).content[0].text;
}

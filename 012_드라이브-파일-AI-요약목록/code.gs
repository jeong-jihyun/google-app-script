/**
 * 012. 드라이브 폴더의 구글 문서를 AI로 요약해 시트에 목록 만들기
 * 준비: 스크립트 속성 CLAUDE_API_KEY, FOLDER_ID
 */

const MAX_FILES = 10;

function summarizeFolderDocs() {
  const props = PropertiesService.getScriptProperties();
  const folder = DriveApp.getFolderById(props.getProperty('FOLDER_ID'));
  const sheet = getOrCreateSheet_('문서요약', ['파일 이름', '링크', '한 줄 요약']);

  const files = folder.getFilesByType(MimeType.GOOGLE_DOCS);
  let count = 0;
  while (files.hasNext() && count < MAX_FILES) {
    const file = files.next();
    const text = DocumentApp.openById(file.getId()).getBody().getText().substring(0, 4000);
    const summary = askClaude_('다음 문서를 한국어 한 문장으로 요약해 줘.\n\n' + text, 200);
    sheet.appendRow([file.getName(), file.getUrl(), summary]);
    count++;
  }
}

// ---- 공통 도우미 (001번과 같은 방식) ----
const CLAUDE_MODEL = 'claude-sonnet-5-5';

function askClaude_(prompt, maxTokens) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  if (!apiKey) throw new Error('스크립트 속성에 CLAUDE_API_KEY 가 없습니다.');
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens || 600,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Claude 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).content[0].text;
}

function getOrCreateSheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); sheet.appendRow(header); }
  return sheet;
}

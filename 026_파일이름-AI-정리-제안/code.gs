/**
 * 026. 드라이브 파일 이름 제안 (이름은 바꾸지 않고 제안만 합니다)
 */
const FOLDER_ID = '여기에_폴더ID를_붙여넣으세요';

function suggestFileNames() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const sheet = getOrCreateSheet_('이름제안', ['현재 이름', '제안 이름', '파일 링크']);
  const files = folder.getFiles();
  let count = 0;

  while (files.hasNext() && count < 20) {
    const file = files.next();
    const suggestion = askClaude_(
      '파일 이름을 알아보기 쉽게 한 줄로 고쳐 줘. 형식: 주제_내용 (확장자는 빼고, 이름만 출력). ' +
      '현재 이름: ' + file.getName(), 100
    ).trim();
    sheet.appendRow([file.getName(), suggestion, file.getUrl()]);
    count++;
  }
}

function getOrCreateSheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); sheet.appendRow(header); }
  return sheet;
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

// AI 답에서 JSON 부분만 꺼내 읽습니다.
function parseJson_(text) {
  const m = text.match(/[\[{][\s\S]*[\]}]/);
  if (!m) throw new Error('JSON 형태의 답이 아닙니다: ' + text);
  return JSON.parse(m[0]);
}

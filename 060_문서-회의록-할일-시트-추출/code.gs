/** 060. 회의록에서 할 일 뽑기 */
const DOC_ID = '여기에_회의록_문서_ID';
const SHEET_ID = '여기에_시트_ID';

function extractTasks() {
  const text = DocumentApp.openById(DOC_ID).getBody().getText().substring(0, 8000);
  const answer = askClaude_('아래 회의록에서 할 일을 찾아 JSON 배열로만 답해 줘. 각 항목은 {"task":"할 일","owner":"담당자","due":"기한"} 형식이고, 글에 없으면 "미정"으로 써. 다른 설명은 붙이지 마.\n\n' + text);
  const json = answer.substring(answer.indexOf('['), answer.lastIndexOf(']') + 1);
  const tasks = JSON.parse(json);
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('할일') || ss.insertSheet('할일');
  if (sheet.getLastRow() === 0) sheet.appendRow(['할 일', '담당자', '기한']);
  tasks.forEach(function (t) { sheet.appendRow([t.task, t.owner, t.due]); });
  Logger.log(tasks.length + '개의 할 일을 적었습니다.');
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

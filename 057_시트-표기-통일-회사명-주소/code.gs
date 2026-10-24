/** 057. 회사명 표기 통일 */
function normalizeNames() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const names = sheet.getRange(2, 1, last - 1, 1).getValues().flat().filter(String);
  const answer = askClaude_('아래는 회사 이름 목록입니다(한 줄에 하나). 같은 회사는 하나의 표기("주식회사 이름" 형식)로 통일해서, 입력과 같은 순서·같은 줄 수로 이름만 한 줄에 하나씩 돌려줘. 번호나 설명은 붙이지 마.\n\n' + names.join('\n'));
  const out = answer.trim().split('\n').map(function (s) { return [s.trim()]; });
  if (out.length !== names.length) throw new Error('결과 줄 수가 달라요. 다시 실행해 주세요.');
  sheet.getRange(2, 2, out.length, 1).setValues(out);
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

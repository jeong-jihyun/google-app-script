/** 052. 후기 긍정/부정 분류 */
function classifyReviews() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  for (let r = 2; r <= last; r++) {
    const review = sheet.getRange(r, 1).getValue();
    if (!review || sheet.getRange(r, 2).getValue()) continue;
    const answer = askClaude_('아래 후기를 읽고 "긍정", "부정", "보통" 중 하나만 먼저 쓰고, 한 칸 띄운 뒤 이유를 한 문장으로 써 줘.\n\n' + review);
    const label = answer.trim().split(/\s+/)[0].replace(/[.,:]/g, '');
    sheet.getRange(r, 2).setValue(label);
    sheet.getRange(r, 3).setValue(answer.trim().substring(label.length).trim());
  }
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

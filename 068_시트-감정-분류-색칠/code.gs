/** 068. A열 후기 → B열 긍정/부정 → 색칠 */
function paintByMood() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  for (let r = 2; r <= last; r++) {
    const text = sheet.getRange(r, 1).getValue();
    if (!text) continue;
    const mood = askClaude_('다음 후기가 긍정이면 "긍정", 부정이면 "부정", 아니면 "보통" 중 한 단어만 답해.\n\n' + text).trim();
    const cell = sheet.getRange(r, 2);
    cell.setValue(mood);
    cell.setBackground(mood.indexOf('긍정') >= 0 ? '#c8e6c9' : mood.indexOf('부정') >= 0 ? '#ffcdd2' : '#eeeeee');
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

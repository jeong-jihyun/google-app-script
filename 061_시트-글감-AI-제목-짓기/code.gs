/** 061. 글 주제 → 제목 후보 3개 (A열 주제, B열에 결과) */
function makeTitles() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  for (let r = 2; r <= last; r++) {
    const topic = sheet.getRange(r, 1).getValue();
    if (!topic || sheet.getRange(r, 2).getValue()) continue; // 비었거나 이미 있으면 건너뜀
    const answer = askClaude_('블로그 글 주제: ' + topic + '\n눈길을 끄는 한국어 제목 후보 3개를 한 줄씩 써 줘. 번호와 설명은 붙이지 마.');
    sheet.getRange(r, 2).setValue(answer.trim());
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

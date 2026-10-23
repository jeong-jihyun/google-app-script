/**
 * 046. 폼 응답이 들어오면 AI가 긴급도를 판단 → 급하면 알림 메일 (Claude 사용)
 * 폼과 연결된 응답 시트의 스크립트로 쓰세요. 트리거: 양식 제출 시
 */
function onFormSubmit(e) {
  const answers = e.namedValues;                 // {질문: [답]}
  const text = Object.keys(answers).map(function (q) { return q + ': ' + answers[q][0]; }).join('\n');
  const verdict = askClaude_('아래 문의가 지금 바로 처리해야 할 만큼 급한지 판단해. "급함" 또는 "보통" 한 단어만 답해.\n\n' + text).trim();

  const sheet = e.range.getSheet();
  sheet.getRange(e.range.getRow(), sheet.getLastColumn() + 1).setValue(verdict);

  if (verdict.indexOf('급함') !== -1) {
    GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), '[급한 문의] 확인해 주세요', text);
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
    payload: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Claude 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).content[0].text;
}

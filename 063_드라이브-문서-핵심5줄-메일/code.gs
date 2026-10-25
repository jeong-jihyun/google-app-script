/** 063. 구글 문서 → 핵심 5줄 → 내 메일 */
const DOC_ID = '여기에_문서_ID';

function mailSummary() {
  const doc = DocumentApp.openById(DOC_ID);
  const text = doc.getBody().getText().substring(0, 10000);
  const answer = askClaude_('아래 글의 핵심을 한국어 5줄로 요약해 줘. 각 줄은 짧게.\n\n' + text);
  MailApp.sendEmail(Session.getActiveUser().getEmail(), '[요약] ' + doc.getName(), answer);
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

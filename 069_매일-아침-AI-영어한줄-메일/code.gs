/** 069. 매일 아침 영어 한 문장 메일 */
function sendDailyEnglish() {
  const answer = askClaude_('일상에서 쓰는 쉬운 영어 문장 1개와 한국어 뜻, 쓰는 상황 한 줄을 알려 줘. 어제와 다른 문장으로. 오늘 날짜: ' + new Date().toDateString());
  MailApp.sendEmail(Session.getActiveUser().getEmail(), '[오늘의 영어 한 줄]', answer);
}

/** 한 번만 실행: 매일 아침 8시에 자동 실행 설정 */
function setDailyTrigger() {
  ScriptApp.newTrigger('sendDailyEnglish').timeBased().everyDays(1).atHour(8).create();
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

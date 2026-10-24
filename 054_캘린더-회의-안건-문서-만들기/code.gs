/** 054. 회의 안건 초안 만들기 */
function makeAgendas() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const events = CalendarApp.getDefaultCalendar().getEventsForDay(tomorrow);
  events.forEach(function (ev) {
    const title = ev.getTitle();
    if (title.indexOf('회의') < 0) return;
    const agenda = askClaude_('회의 제목: ' + title + '\n이 회의의 안건 초안을 "목적 / 논의할 것 3가지 / 준비할 것" 형식으로 짧게 한국어로 써 줘.');
    const doc = DocumentApp.create('안건_' + title);
    doc.getBody().setText(agenda);
    Logger.log(title + ' → ' + doc.getUrl());
  });
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

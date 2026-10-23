/**
 * 043. 오늘 일정별 준비물 체크리스트를 나에게 메일로 보내기 (Claude 사용)
 */
function sendTodayChecklist() {
  const events = CalendarApp.getDefaultCalendar().getEventsForDay(new Date());
  if (events.length === 0) {
    Logger.log('오늘 일정이 없습니다.');
    return;
  }
  const titles = events.map(function (e) {
    return Utilities.formatDate(e.getStartTime(), Session.getScriptTimeZone(), 'HH:mm') + ' ' + e.getTitle();
  });
  const answer = askClaude_('오늘 내 일정이야. 일정마다 챙기면 좋은 준비물이나 할 일을 2~3개씩 체크리스트(□)로 써 줘. 한국어로 짧게.\n\n' + titles.join('\n'));
  GmailApp.sendEmail(Session.getActiveUser().getEmail(), '[오늘 준비물] 일정 ' + events.length + '개', answer);
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

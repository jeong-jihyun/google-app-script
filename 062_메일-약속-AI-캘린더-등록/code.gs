/** 062. '약속' 라벨 메일에서 날짜·시간을 뽑아 캘린더에 일정 만들기 */
function mailToEvent() {
  const label = GmailApp.getUserLabelByName('약속');
  if (!label) throw new Error("Gmail에서 '약속' 라벨을 먼저 만들어 주세요.");
  label.getThreads(0, 5).forEach(function (thread) {
    const msg = thread.getMessages().pop();
    const answer = askClaude_('아래 메일에서 약속 하나를 찾아 JSON 한 개로만 답해 줘. 형식: {"title":"제목","start":"YYYY-MM-DD HH:mm"}. 약속이 없으면 {"title":"","start":""}. 오늘은 ' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd') + ' 이야.\n\n' + msg.getPlainBody().substring(0, 3000));
    const info = JSON.parse(answer.substring(answer.indexOf('{'), answer.lastIndexOf('}') + 1));
    if (!info.title || !info.start) return;
    const start = new Date(info.start.replace(' ', 'T') + ':00+09:00');
    CalendarApp.getDefaultCalendar().createEvent(info.title, start, new Date(start.getTime() + 60 * 60 * 1000));
    Logger.log('일정 만듦: ' + info.title + ' ' + info.start);
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

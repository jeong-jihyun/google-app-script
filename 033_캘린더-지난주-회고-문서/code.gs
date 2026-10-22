/**
 * 033. 지난주 일정으로 회고 문서 만들기 (Claude 사용)
 */
function weeklyReview() {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const events = CalendarApp.getDefaultCalendar().getEvents(start, end);
  if (events.length === 0) {
    Logger.log('지난주에는 일정이 없습니다.');
    return;
  }
  const lines = events.map(function (e) {
    return Utilities.formatDate(e.getStartTime(), 'Asia/Seoul', 'M/d HH:mm') + ' ' + e.getTitle();
  }).join('\n');

  const review = askClaude_(
    '아래는 지난주 내 일정이야. "한 일", "잘한 점", "다음 주에 신경 쓸 점" 세 부분으로 한국어 회고를 써 줘.\n\n' + lines
  );
  const doc = DocumentApp.create('주간 회고 ' + Utilities.formatDate(end, 'Asia/Seoul', 'yyyy-MM-dd'));
  doc.getBody().appendParagraph(review);
  Logger.log('회고 문서: ' + doc.getUrl());
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

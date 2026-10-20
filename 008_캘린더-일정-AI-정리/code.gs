/**
 * 008. 캘린더 일정 AI 정리
 * 오늘부터 7일간의 일정을 가져와 AI가 "이번 주 브리핑"을 써 주고,
 * 나에게 메일로 보내 줍니다.
 *
 * 준비: 스크립트 속성에 GEMINI_API_KEY 저장
 */

const GEMINI_MODEL = 'gemini-2.5-flash';

function sendWeeklyBriefing() {
  const now = new Date();
  const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const events = CalendarApp.getDefaultCalendar().getEvents(now, end);

  if (events.length === 0) {
    Logger.log('앞으로 7일간 일정이 없습니다.');
    return;
  }

  const tz = Session.getScriptTimeZone();
  const lines = events.map(function (e) {
    return Utilities.formatDate(e.getStartTime(), tz, 'M/d(E) HH:mm') + ' ' + e.getTitle();
  }).join('\n');

  const briefing = askGemini_(
    '아래는 내 이번 주 일정이야. 한국어로 (1) 한 줄 총평, (2) 요일별 핵심, ' +
    '(3) 겹치거나 빡빡해 보이는 부분과 준비할 것을 짧게 정리해 줘.\n\n' + lines
  );

  const me = Session.getActiveUser().getEmail();
  MailApp.sendEmail(me, '[이번 주 일정 브리핑]', briefing + '\n\n--- 원본 일정 ---\n' + lines);
}

function askGemini_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Gemini 호출 실패: ' + res.getContentText());
  }
  return JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
}

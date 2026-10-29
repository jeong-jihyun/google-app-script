/** 116. 내일 일정 메일로 받기 */
function mailTomorrow() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const events = CalendarApp.getDefaultCalendar().getEvents(start, end);
  if (events.length === 0) return;
  const lines = events.map(e => {
    const t = e.isAllDayEvent() ? '종일' : Utilities.formatDate(e.getStartTime(), 'Asia/Seoul', 'HH:mm');
    return t + '  ' + e.getTitle();
  });
  MailApp.sendEmail(Session.getActiveUser().getEmail(), '[내일 일정] ' + events.length + '건', lines.join('\n'));
}

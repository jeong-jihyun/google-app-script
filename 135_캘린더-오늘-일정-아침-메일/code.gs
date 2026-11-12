/** 135. 오늘 일정 메일로 보내기 */
function sendTodayAgenda() {
  const events = CalendarApp.getDefaultCalendar().getEventsForDay(new Date());
  const lines = events.map(e => {
    const t = e.isAllDayEvent() ? '종일' : Utilities.formatDate(e.getStartTime(), 'Asia/Seoul', 'HH:mm');
    return t + '  ' + e.getTitle();
  });
  const body = lines.length ? lines.join('\n') : '오늘은 일정이 없어요.';
  MailApp.sendEmail(Session.getActiveUser().getEmail(), '[오늘 일정] ' + lines.length + '건', body);
}

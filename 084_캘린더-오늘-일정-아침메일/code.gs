/** 084. 오늘 일정 아침 메일 */
function morningAgenda() {
  const events = CalendarApp.getDefaultCalendar().getEventsForDay(new Date());
  if (events.length === 0) return;
  const lines = events.map(function (e) {
    const time = e.isAllDayEvent() ? '종일'
      : Utilities.formatDate(e.getStartTime(), 'Asia/Seoul', 'HH:mm');
    return time + '  ' + e.getTitle();
  });
  MailApp.sendEmail(Session.getActiveUser().getEmail(), '[오늘 일정 ' + events.length + '개]', lines.join('\n'));
}

function setMorningTrigger() {
  ScriptApp.newTrigger('morningAgenda').timeBased().everyDays(1).atHour(7).create();
}

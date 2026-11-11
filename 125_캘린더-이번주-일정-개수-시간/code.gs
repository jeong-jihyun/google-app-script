/** 125. 이번 주 일정 요약 */
function weekSummary() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  const events = CalendarApp.getDefaultCalendar().getEvents(monday, nextMonday);
  let hours = 0;
  events.forEach(e => {
    if (!e.isAllDayEvent()) hours += (e.getEndTime() - e.getStartTime()) / 3600000;
  });
  Logger.log('이번 주 일정 ' + events.length + '개, 시간 있는 일정 합계 ' + hours.toFixed(1) + '시간');
}

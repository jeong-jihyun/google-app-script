/** 090. 이번 달 일정 목록을 시트에 쓰기 */
function monthEventsToSheet() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const events = CalendarApp.getDefaultCalendar().getEvents(start, end);
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  sheet.appendRow(['날짜', '시작 시간', '제목', '장소']);
  events.forEach(function (e) {
    sheet.appendRow([
      Utilities.formatDate(e.getStartTime(), 'Asia/Seoul', 'yyyy-MM-dd'),
      e.isAllDayEvent() ? '종일' : Utilities.formatDate(e.getStartTime(), 'Asia/Seoul', 'HH:mm'),
      e.getTitle(), e.getLocation()]);
  });
}

/** 145. 종일 일정 만들기 */
function createAllDayEvent() {
  const title = '제출 마감';       // 일정 제목 (바꾸세요)
  const date = new Date('2026-12-01'); // 날짜 (바꾸세요)
  CalendarApp.getDefaultCalendar().createAllDayEvent(title, date);
  Logger.log('일정을 만들었습니다: ' + title);
}

/** 077. 시트의 생일을 캘린더에 매년 반복 종일 일정으로 등록 */
function addBirthdays() {
  const rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  const cal = CalendarApp.getDefaultCalendar();
  for (let i = 1; i < rows.length; i++) {
    const name = rows[i][0];
    const birthday = new Date(rows[i][1]);
    if (!name || isNaN(birthday)) continue;
    const recurrence = CalendarApp.newRecurrence().addYearlyRule();
    cal.createAllDayEventSeries(name + ' 생일', birthday, recurrence);
  }
}

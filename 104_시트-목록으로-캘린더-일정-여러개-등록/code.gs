/** 104. 시트 목록을 캘린더 종일 일정으로 등록 (A=날짜, B=제목, C=상태) */
function addEventsToCalendar() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = sheet.getLastRow() - 1;
  if (rows < 1) return;
  const range = sheet.getRange(2, 1, rows, 3);
  const values = range.getValues();
  const cal = CalendarApp.getDefaultCalendar();
  values.forEach(row => {
    if (row[0] && row[1] && row[2] !== '등록완료') {
      cal.createAllDayEvent(String(row[1]), new Date(row[0]));
      row[2] = '등록완료';
    }
  });
  range.setValues(values);
}

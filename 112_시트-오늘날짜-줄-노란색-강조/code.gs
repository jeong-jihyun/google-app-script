/** 112. 오늘 날짜 줄 노란색으로 칠하기 (A열이 날짜인 표) */
function highlightToday() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const lastCol = sheet.getLastColumn();
  sheet.getRange(2, 1, last - 1, lastCol).setBackground(null);
  const dates = sheet.getRange(2, 1, last - 1, 1).getValues();
  dates.forEach((row, i) => {
    const d = row[0];
    if (d instanceof Date && Utilities.formatDate(d, tz, 'yyyy-MM-dd') === today) {
      sheet.getRange(i + 2, 1, 1, lastCol).setBackground('#fff2a8');
    }
  });
}

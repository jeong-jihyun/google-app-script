/** 100. 표 서식 한 번에 맞추기 */
function prettyTable() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastCol = sheet.getLastColumn();
  const header = sheet.getRange(1, 1, 1, lastCol);
  header.setFontWeight('bold').setBackground('#d9ead3');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, lastCol);
  const all = sheet.getDataRange();
  if (all.getBandings().length === 0) {
    all.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  }
}

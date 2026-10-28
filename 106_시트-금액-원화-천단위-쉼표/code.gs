/** 106. 선택한 칸을 '1,234원' 모양으로 */
function formatWon() {
  const range = SpreadsheetApp.getActiveRange();
  range.setNumberFormat('#,##0"원"');
  range.setHorizontalAlignment('right');
}

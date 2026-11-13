/** 143. 열 숨기기 / 보이기 */
const COLUMN = 2; // 숨길 열 번호 (A=1, B=2, C=3 ...)

function hideColumn() {
  SpreadsheetApp.getActiveSheet().hideColumns(COLUMN);
}
function showColumn() {
  SpreadsheetApp.getActiveSheet().showColumns(COLUMN);
}

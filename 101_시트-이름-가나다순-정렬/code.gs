/** 101. 표를 가나다순으로 정렬 */
const COLUMN = 1; // 기준 열 번호 (1 = A열)

function sortByName() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = sheet.getLastRow() - 1; // 제목줄 제외
  if (rows < 1) return;
  const range = sheet.getRange(2, 1, rows, sheet.getLastColumn());
  range.sort({ column: COLUMN, ascending: true });
}

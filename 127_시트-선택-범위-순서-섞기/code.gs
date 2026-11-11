/** 127. 선택한 줄 섞기 */
function shuffleRows() {
  const range = SpreadsheetApp.getActiveRange();
  const rows = range.getValues();
  for (let i = rows.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rows[i], rows[j]] = [rows[j], rows[i]];
  }
  range.setValues(rows);
}

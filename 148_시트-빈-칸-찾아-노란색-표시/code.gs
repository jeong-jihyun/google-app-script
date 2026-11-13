/** 148. 빈 칸 노란색 표시 */
function highlightBlanks() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getDataRange();
  const values = range.getValues();
  let count = 0;
  for (let r = 0; r < values.length; r++) {
    for (let c = 0; c < values[r].length; c++) {
      if (values[r][c] === '') {
        range.getCell(r + 1, c + 1).setBackground('#fff59d');
        count++;
      }
    }
  }
  SpreadsheetApp.getUi().alert('빈 칸 ' + count + '개를 표시했습니다.');
}

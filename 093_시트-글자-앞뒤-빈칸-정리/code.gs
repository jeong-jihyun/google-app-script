/** 093. 선택한 범위의 앞뒤 공백 지우기 */
function trimSelection() {
  const range = SpreadsheetApp.getActiveRange();
  const cleaned = range.getValues().map(function (row) {
    return row.map(function (cell) {
      return typeof cell === 'string' ? cell.trim() : cell;
    });
  });
  range.setValues(cleaned);
}

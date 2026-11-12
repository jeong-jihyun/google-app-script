/** 132. 빈 줄 모두 지우기 */
function deleteEmptyRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  let deleted = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    const empty = values[i].every(v => v === '');
    if (empty) { sheet.deleteRow(i + 1); deleted++; }
  }
  SpreadsheetApp.getActive().toast(deleted + '개의 빈 줄을 지웠어요.');
}

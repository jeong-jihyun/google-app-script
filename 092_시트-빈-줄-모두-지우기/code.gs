/** 092. 빈 줄 지우기 */
function deleteBlankRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  // 아래에서 위로 지워야 줄 번호가 밀리지 않습니다.
  for (let i = values.length - 1; i >= 0; i--) {
    const isBlank = values[i].every(function (cell) { return cell === ''; });
    if (isBlank) sheet.deleteRow(i + 1);
  }
}

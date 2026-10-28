/** 109. 선택한 줄을 확인 후 삭제 */
function deleteWithConfirm() {
  const ui = SpreadsheetApp.getUi();
  const range = SpreadsheetApp.getActiveRange();
  const first = range.getRow();
  const count = range.getNumRows();
  const answer = ui.alert('줄 삭제', first + '번 줄부터 ' + count + '줄을 지울까요?', ui.ButtonSet.YES_NO);
  if (answer === ui.Button.YES) {
    SpreadsheetApp.getActiveSheet().deleteRows(first, count);
  }
}

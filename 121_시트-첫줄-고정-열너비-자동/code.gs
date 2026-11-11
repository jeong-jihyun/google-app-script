/** 121. 첫 줄 고정 + 열 너비 자동 맞춤 */
function tidySheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.setFrozenRows(1); // 맨 윗줄 고정
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) { SpreadsheetApp.getUi().alert('내용이 없어요.'); return; }
  sheet.autoResizeColumns(1, lastCol); // 열 너비 자동
  SpreadsheetApp.getActive().toast('정리 완료!');
}

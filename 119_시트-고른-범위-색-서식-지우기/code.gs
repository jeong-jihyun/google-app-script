/** 119. 고른 범위의 서식만 지우기 (내용은 유지) */
function clearFormatOnly() {
  const range = SpreadsheetApp.getActiveRange();
  range.clearFormat();
  SpreadsheetApp.getActive().toast('서식을 지웠습니다.', '완료', 3);
}

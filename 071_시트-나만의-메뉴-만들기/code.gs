/** 071. 시트를 열 때 나만의 메뉴 만들기 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('내 도구')
    .addItem('선택한 칸에 오늘 날짜 넣기', 'insertToday')
    .addItem('선택한 칸 지우기', 'clearSelected')
    .addToUi();
}

function insertToday() {
  const range = SpreadsheetApp.getActiveRange();
  range.setValue(new Date());
  range.setNumberFormat('yyyy-MM-dd');
}

function clearSelected() {
  SpreadsheetApp.getActiveRange().clearContent();
}

/** 091. 선택한 칸에 오늘 날짜 넣기 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('내 도구')
    .addItem('선택한 칸에 오늘 날짜', 'putToday')
    .addToUi();
}

function putToday() {
  const range = SpreadsheetApp.getActiveRange();
  const today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
  range.setValue(today);
}

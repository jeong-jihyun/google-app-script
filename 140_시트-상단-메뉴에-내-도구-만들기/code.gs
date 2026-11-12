/** 140. 사용자 메뉴 만들기 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('내 도구')
    .addItem('인사하기', 'sayHello')
    .addItem('오늘 날짜 넣기', 'putToday')
    .addToUi();
}
function sayHello() { SpreadsheetApp.getUi().alert('안녕하세요!'); }
function putToday() {
  SpreadsheetApp.getActiveRange().setValue(new Date());
}

/** 142. 맨 아래에 날짜+메모 추가 */
function addLogRow() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const memo = '메모를 여기에 쓰세요'; // 원하는 문구로 바꾸세요
  sheet.appendRow([new Date(), memo]);
}

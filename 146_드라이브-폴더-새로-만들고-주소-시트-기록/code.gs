/** 146. 폴더 만들고 주소 기록 */
function createFolderAndLog() {
  const name = '새 프로젝트 ' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd');
  const folder = DriveApp.createFolder(name);
  SpreadsheetApp.getActiveSheet().appendRow([name, folder.getUrl()]);
}

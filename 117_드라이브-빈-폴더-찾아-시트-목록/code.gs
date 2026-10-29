/** 117. 빈 폴더 찾아 시트에 적기 */
function listEmptyFolders() {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  sheet.appendRow(['폴더 이름', '주소']);
  const folders = DriveApp.getFolders();
  let n = 0;
  while (folders.hasNext() && n < 200) {
    const f = folders.next();
    n++;
    if (!f.getFiles().hasNext() && !f.getFolders().hasNext()) {
      sheet.appendRow([f.getName(), f.getUrl()]);
    }
  }
}

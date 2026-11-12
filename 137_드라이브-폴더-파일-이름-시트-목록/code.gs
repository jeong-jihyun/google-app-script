/** 137. 폴더 파일 목록 */
function listFolderFiles() {
  const FOLDER_NAME = '내폴더'; // 바꾸세요: 폴더 이름
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (!folders.hasNext()) { SpreadsheetApp.getUi().alert('폴더를 못 찾았어요.'); return; }
  const files = folders.next().getFiles();
  const rows = [['이름', '수정일', '링크']];
  while (files.hasNext()) {
    const f = files.next();
    rows.push([f.getName(), f.getLastUpdated(), f.getUrl()]);
  }
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  sheet.getRange(1, 1, rows.length, 3).setValues(rows);
}

/** 078. 드라이브 폴더의 파일 목록을 시트에 쓰기 */
const FOLDER_ID = '여기에_폴더_ID'; // 폴더 주소의 folders/ 뒤 글자

function listFiles() {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  sheet.appendRow(['이름', '종류', '수정일', '주소']);
  const files = DriveApp.getFolderById(FOLDER_ID).getFiles();
  const out = [];
  while (files.hasNext()) {
    const f = files.next();
    out.push([f.getName(), f.getMimeType(), f.getLastUpdated(), f.getUrl()]);
  }
  if (out.length) sheet.getRange(2, 1, out.length, 4).setValues(out);
}

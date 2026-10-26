/** 085. 오래된 파일 목록 만들기 (지우지 않아요) */
const FOLDER_ID = '여기에_폴더_ID';   // 폴더 주소의 folders/ 뒤쪽 글자
const DAYS = 90;

function listOldFiles() {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  sheet.appendRow(['파일 이름', '마지막 수정일', '주소']);
  const limit = new Date(Date.now() - DAYS * 86400000);
  const files = DriveApp.getFolderById(FOLDER_ID).getFiles();
  while (files.hasNext()) {
    const f = files.next();
    if (f.getLastUpdated() < limit) {
      sheet.appendRow([f.getName(), f.getLastUpdated(), f.getUrl()]);
    }
  }
}

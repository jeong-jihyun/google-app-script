/** 096. 시트 A열의 이름으로 폴더 만들기 */
function makeFolders() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const names = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues().flat();
  names.forEach(function (name) {
    if (!name) return;
    const exists = DriveApp.getFoldersByName(name).hasNext();
    if (!exists) DriveApp.createFolder(name);
  });
}

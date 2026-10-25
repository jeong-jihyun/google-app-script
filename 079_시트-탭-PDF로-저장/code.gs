/** 079. 현재 시트 탭을 PDF 로 저장 */
function saveSheetAsPdf() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const url = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?format=pdf&gid=' + sheet.getSheetId();
  const res = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } });
  const name = ss.getName() + '_' + sheet.getName() + '.pdf';
  const file = DriveApp.createFile(res.getBlob().setName(name));
  Logger.log('PDF 저장 완료: ' + file.getUrl());
}

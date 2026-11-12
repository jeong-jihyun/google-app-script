/** 133. 시트를 PDF로 저장 */
function saveAsPdf() {
  const ss = SpreadsheetApp.getActive();
  const blob = ss.getAs('application/pdf');
  const name = ss.getName() + '_' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd') + '.pdf';
  blob.setName(name);
  const file = DriveApp.createFile(blob);
  SpreadsheetApp.getActive().toast('저장 완료: ' + file.getUrl());
  Logger.log(file.getUrl());
}

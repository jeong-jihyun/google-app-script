/** 129. 시트 표 → 문서 표 */
function sheetToDocTable() {
  const values = SpreadsheetApp.getActiveSheet().getDataRange().getDisplayValues();
  if (values.length === 0) { SpreadsheetApp.getUi().alert('시트가 비어 있어요.'); return; }
  const doc = DocumentApp.create('시트에서 가져온 표 ' + new Date().toLocaleDateString('ko-KR'));
  doc.getBody().appendTable(values);
  SpreadsheetApp.getUi().alert('문서를 만들었어요:\n' + doc.getUrl());
}

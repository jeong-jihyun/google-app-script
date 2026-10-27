/** 097. 완료 줄 숨기기 (C열이 '완료') */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('내 도구')
    .addItem('완료 줄 숨기기', 'hideDone')
    .addItem('모두 보이기', 'showAll')
    .addToUi();
}

function hideDone() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][2] === '완료') sheet.hideRows(i + 1);
  }
}

function showAll() {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.showRows(1, sheet.getMaxRows());
}

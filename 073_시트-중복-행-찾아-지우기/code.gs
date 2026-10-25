/** 073. 1열 기준으로 중복 줄 지우기 (1행은 제목이라 건드리지 않음) */
function removeDuplicates() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  let removed = 0;
  // 아래에서부터 지워야 줄 번호가 밀리지 않습니다.
  const first = {};
  const toDelete = [];
  for (let i = 1; i < values.length; i++) {
    const key = values[i][0];
    if (first[key]) { toDelete.push(i + 1); } else { first[key] = true; }
  }
  toDelete.reverse().forEach(function (row) { sheet.deleteRow(row); removed++; });
  SpreadsheetApp.getUi().alert('중복 ' + removed + '줄을 지웠습니다.');
}

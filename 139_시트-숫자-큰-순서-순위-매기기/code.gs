/** 139. 점수 순위 매기기 */
function rankScores() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 1) return;
  const scores = sheet.getRange(1, 1, last, 1).getValues().map(r => r[0]);
  const ranks = scores.map(s => [typeof s === 'number' ? scores.filter(x => typeof x === 'number' && x > s).length + 1 : '']);
  sheet.getRange(1, 2, last, 1).setValues(ranks);
}

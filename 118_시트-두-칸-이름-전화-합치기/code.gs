/** 118. A열 + B열을 C열에 합치기 */
function mergeColumns() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const data = sheet.getRange(2, 1, last - 1, 2).getValues();
  const merged = data.map(r => [(String(r[0]) + ' ' + String(r[1])).trim()]);
  sheet.getRange(2, 3, merged.length, 1).setValues(merged);
}

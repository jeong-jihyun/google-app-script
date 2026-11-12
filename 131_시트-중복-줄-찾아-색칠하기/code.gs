/** 131. A열 중복 값 색칠하기 */
function highlightDuplicates() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 1) return;
  const range = sheet.getRange(1, 1, last, 1);
  const values = range.getValues();
  const count = {};
  values.forEach(r => { count[r[0]] = (count[r[0]] || 0) + 1; });
  const colors = values.map(r => [r[0] !== '' && count[r[0]] > 1 ? '#f4cccc' : null]);
  range.setBackgrounds(colors);
  SpreadsheetApp.getActive().toast('중복 표시를 마쳤어요.');
}

/** 123. 선택 칸 앞뒤 공백 지우기 */
function trimSelection() {
  const range = SpreadsheetApp.getActiveRange();
  const values = range.getValues().map(row =>
    row.map(v => (typeof v === 'string' ? v.trim().replace(/\s{2,}/g, ' ') : v)));
  range.setValues(values);
  SpreadsheetApp.getActive().toast('공백 정리 완료!');
}

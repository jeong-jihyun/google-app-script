/** 098. 항목별 개수 세기 */
function countByItem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = ss.getActiveSheet().getRange('A2:A').getValues().flat();
  const counts = {};
  data.forEach(function (v) {
    if (v === '') return;
    counts[v] = (counts[v] || 0) + 1;
  });
  const summary = ss.getSheetByName('요약') || ss.insertSheet('요약');
  summary.clear();
  summary.appendRow(['항목', '개수']);
  Object.keys(counts).forEach(function (k) {
    summary.appendRow([k, counts[k]]);
  });
}

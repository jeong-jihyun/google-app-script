/** 111. 고른 칸의 합계·평균 알려주기 */
function showSum() {
  const values = SpreadsheetApp.getActiveRange().getValues().flat();
  const nums = values.filter(v => typeof v === 'number');
  if (nums.length === 0) {
    SpreadsheetApp.getUi().alert('숫자가 들어 있는 칸을 먼저 골라 주세요.');
    return;
  }
  const sum = nums.reduce((a, b) => a + b, 0);
  const avg = sum / nums.length;
  SpreadsheetApp.getUi().alert('개수: ' + nums.length + '\n합계: ' + sum + '\n평균: ' + avg.toFixed(2));
}

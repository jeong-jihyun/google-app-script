/** 089. 매일 합계를 기록 탭에 쌓기 */
function logDailyTotal() {
  const ss = SpreadsheetApp.getActive();
  const data = ss.getSheetByName('데이터').getRange('B:B').getValues().flat();
  const total = data.reduce(function (a, v) { return a + (typeof v === 'number' ? v : 0); }, 0);
  let log = ss.getSheetByName('기록');
  if (!log) { log = ss.insertSheet('기록'); log.appendRow(['날짜', '합계']); }
  log.appendRow([new Date(), total]);
}

function setLogTrigger() {
  ScriptApp.newTrigger('logDailyTotal').timeBased().everyDays(1).atHour(23).create();
}

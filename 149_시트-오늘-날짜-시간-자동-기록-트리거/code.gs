/** 149. 매일 자동 기록 */
function writeDailyLog() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.appendRow([new Date(), '자동 기록']);
}

// 한 번만 실행하면 매일 오전 9시 즈음 writeDailyLog 가 돕니다.
function setDailyTrigger() {
  ScriptApp.newTrigger('writeDailyLog')
    .timeBased().everyDays(1).atHour(9).create();
}

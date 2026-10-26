/** 082. 시트를 날짜 이름으로 백업 복사 */
function backupSheet() {
  const file = DriveApp.getFileById(SpreadsheetApp.getActive().getId());
  const today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
  file.makeCopy('백업_' + file.getName() + '_' + today);
}

/** 매주 월요일 오전 8시에 자동 실행되도록 한 번만 실행해 두세요 */
function setWeeklyTrigger() {
  ScriptApp.newTrigger('backupSheet').timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
}

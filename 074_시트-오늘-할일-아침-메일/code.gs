/** 074. 오늘 날짜의 할 일을 모아 내 메일로 보내기 */
function sendTodayTasks() {
  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  const tasks = [];
  for (let i = 1; i < rows.length; i++) {
    const d = rows[i][0] instanceof Date ? Utilities.formatDate(rows[i][0], tz, 'yyyy-MM-dd') : String(rows[i][0]);
    if (d === today && rows[i][1]) tasks.push('- ' + rows[i][1]);
  }
  if (tasks.length === 0) return; // 할 일이 없으면 메일을 보내지 않음
  const me = Session.getActiveUser().getEmail();
  MailApp.sendEmail(me, '[오늘 할 일] ' + today, tasks.join('\n'));
}

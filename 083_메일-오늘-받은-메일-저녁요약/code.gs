/** 083. 오늘 받은 메일 제목 모아 메일로 보내기 */
function eveningMailSummary() {
  const threads = GmailApp.search('in:inbox newer_than:1d', 0, 30);
  if (threads.length === 0) return;
  const lines = threads.map(function (t, i) {
    const m = t.getMessages()[t.getMessageCount() - 1];
    return (i + 1) + '. ' + m.getFrom() + ' - ' + m.getSubject();
  });
  MailApp.sendEmail(Session.getActiveUser().getEmail(),
    '[오늘 받은 메일 ' + threads.length + '통]', lines.join('\n'));
}

function setDailyTrigger() {
  ScriptApp.newTrigger('eveningMailSummary').timeBased().everyDays(1).atHour(18).create();
}

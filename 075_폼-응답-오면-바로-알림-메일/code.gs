/** 075. 폼 응답이 들어오면 내용을 메일로 알려 주기 */
function onFormSubmit(e) {
  const answers = e.namedValues; // { 질문: [답] }
  let body = '새 응답이 도착했습니다.\n\n';
  Object.keys(answers).forEach(function (q) {
    body += q + ': ' + answers[q].join(', ') + '\n';
  });
  const me = Session.getActiveUser().getEmail();
  MailApp.sendEmail(me, '[새 폼 응답] ' + SpreadsheetApp.getActive().getName(), body);
}

/** 099. 자동 답장 켜기/끄기 */
function turnOnAutoReply() {
  const start = new Date();
  const end = new Date(start.getTime() + 3 * 24 * 60 * 60 * 1000); // 3일 뒤까지
  Gmail.Users.Settings.updateVacation({
    enableAutoReply: true,
    responseSubject: '자리를 비웠습니다',
    responseBodyPlainText: '지금 자리를 비워 답이 늦습니다. 돌아오면 바로 답변드리겠습니다.',
    startTime: start.getTime(),
    endTime: end.getTime()
  }, 'me');
}

function turnOffAutoReply() {
  Gmail.Users.Settings.updateVacation({ enableAutoReply: false }, 'me');
}

/** 108. 오래된 읽은 메일 보관 처리 */
const DAYS = 30;

function archiveOldMail() {
  const threads = GmailApp.search('in:inbox is:read older_than:' + DAYS + 'd -is:starred', 0, 100);
  GmailApp.moveThreadsToArchive(threads);
  Logger.log(threads.length + '개 대화를 보관했습니다.');
}

/** 113. 안 읽은 메일 개수 알려주기 */
function countUnread() {
  const count = GmailApp.getInboxUnreadCount();
  const threads = GmailApp.search('is:unread in:inbox', 0, 3);
  const titles = threads.map(t => '- ' + t.getFirstMessageSubject());
  Logger.log('안 읽은 메일: ' + count + '통');
  Logger.log('최근 3개:\n' + titles.join('\n'));
}

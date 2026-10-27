/** 094. 별표 메일 목록 */
function starredToSheet() {
  const threads = GmailApp.search('is:starred', 0, 50);
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  sheet.appendRow(['날짜', '보낸 사람', '제목']);
  threads.forEach(function (t) {
    const m = t.getMessages()[0];
    sheet.appendRow([
      Utilities.formatDate(m.getDate(), 'Asia/Seoul', 'yyyy-MM-dd'),
      m.getFrom(), m.getSubject()]);
  });
}

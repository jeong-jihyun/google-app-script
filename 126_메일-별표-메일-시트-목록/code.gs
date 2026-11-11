/** 126. 별표 메일 목록 */
function starredToSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  sheet.appendRow(['날짜', '보낸 사람', '제목']);
  GmailApp.getStarredThreads(0, 50).forEach(t => {
    const m = t.getMessages()[0];
    sheet.appendRow([m.getDate(), m.getFrom(), m.getSubject()]);
  });
}

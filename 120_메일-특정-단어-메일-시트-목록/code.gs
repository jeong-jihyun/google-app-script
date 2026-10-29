/** 120. 검색어로 찾은 메일을 시트에 적기 */
function mailsToSheet() {
  const keyword = '청구서'; // 찾고 싶은 단어로 바꾸세요
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  sheet.appendRow(['날짜', '보낸 사람', '제목']);
  const threads = GmailApp.search(keyword + ' newer_than:30d', 0, 50);
  threads.forEach(t => {
    const m = t.getMessages()[0];
    sheet.appendRow([m.getDate(), m.getFrom(), m.getSubject()]);
  });
}

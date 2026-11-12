/** 134. 오늘 받은 메일 목록 */
function todayMailToSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  sheet.appendRow(['받은 시간', '보낸 사람', '제목']);
  const threads = GmailApp.search('in:inbox newer_than:1d', 0, 100);
  const rows = [];
  threads.forEach(t => t.getMessages().forEach(m => {
    rows.push([m.getDate(), m.getFrom(), m.getSubject()]);
  }));
  if (rows.length) sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  SpreadsheetApp.getActive().toast(rows.length + '통을 적었어요.');
}

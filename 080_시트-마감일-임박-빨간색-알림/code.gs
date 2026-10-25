/** 080. 마감 3일 이내 줄을 빨갛게 칠하고 메일로 알림 */
function highlightDeadlines() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let count = 0;
  for (let i = 1; i < rows.length; i++) {
    const due = new Date(rows[i][1]);
    if (isNaN(due)) continue;
    const diff = Math.round((due - today) / 86400000); // 남은 날수
    const range = sheet.getRange(i + 1, 1, 1, 2);
    if (diff >= 0 && diff <= 3) { range.setBackground('#f4c7c3'); count++; }
    else { range.setBackground(null); }
  }
  if (count > 0) {
    MailApp.sendEmail(Session.getActiveUser().getEmail(), '[마감 임박] ' + count + '건', '마감이 3일 이내인 할 일이 ' + count + '건 있습니다. 시트를 확인하세요.');
  }
}

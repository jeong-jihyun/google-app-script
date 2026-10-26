/** 086. 명단(A:이름 B:날짜 C:장소)으로 안내문 문서 만들기 */
function makeNotices() {
  const rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const name = rows[i][0], date = rows[i][1], place = rows[i][2];
    if (!name) continue;
    const doc = DocumentApp.create('안내문_' + name);
    const body = doc.getBody();
    body.appendParagraph(name + '님께').setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph('아래 일정에 참석해 주시기 바랍니다.');
    body.appendParagraph('날짜: ' + date);
    body.appendParagraph('장소: ' + place);
    doc.saveAndClose();
  }
}

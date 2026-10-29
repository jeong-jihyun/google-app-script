/** 114. 문서 맨 아래에 작성일 넣기 */
function addDateLine() {
  const body = DocumentApp.getActiveDocument().getBody();
  const now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm');
  const p = body.appendParagraph('작성일: ' + now);
  p.setItalic(true).setFontSize(10);
}

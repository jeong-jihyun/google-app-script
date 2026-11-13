/** 147. 문서 글자 수 세기 */
function countText() {
  const text = DocumentApp.getActiveDocument().getBody().getText();
  const withSpace = text.length;
  const noSpace = text.replace(/\s/g, '').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  DocumentApp.getUi().alert(
    '공백 포함: ' + withSpace + '자\n공백 제외: ' + noSpace + '자\n단어: ' + words + '개');
}

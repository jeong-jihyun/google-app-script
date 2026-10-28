/** 107. 문서 글자 수 세기 */
function countText() {
  const text = DocumentApp.getActiveDocument().getBody().getText();
  const withSpace = text.length;
  const noSpace = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  DocumentApp.getUi().alert(
    '글자 수(공백 포함): ' + withSpace + '\n글자 수(공백 제외): ' + noSpace + '\n단어 수: ' + words);
}

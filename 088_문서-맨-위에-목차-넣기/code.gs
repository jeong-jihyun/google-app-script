/** 088. 문서 맨 위에 목차 넣기 */
function addToc() {
  const body = DocumentApp.getActiveDocument().getBody();
  body.insertTableOfContents(0);   // 0 = 맨 위
}

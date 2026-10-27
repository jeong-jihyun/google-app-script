/** 095. 문서 안 여러 단어 한 번에 바꾸기 */
function replaceMany() {
  // [찾을 말, 바꿀 말] 목록을 원하는 대로 고치세요.
  const pairs = [
    ['2025', '2026'],
    ['회사A', '회사B']
  ];
  const body = DocumentApp.getActiveDocument().getBody();
  pairs.forEach(function (p) {
    body.replaceText(p[0], p[1]);
  });
}

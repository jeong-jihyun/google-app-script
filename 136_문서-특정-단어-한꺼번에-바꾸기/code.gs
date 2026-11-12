/** 136. 문서 단어 일괄 바꾸기 */
function replaceWords() {
  const FIND = '회사명';      // 바꾸세요: 찾을 단어
  const REPLACE = '우리회사'; // 바꾸세요: 새 단어
  const body = DocumentApp.getActiveDocument().getBody();
  body.replaceText(FIND, REPLACE);
  DocumentApp.getUi().alert('바꾸기를 마쳤어요.');
}

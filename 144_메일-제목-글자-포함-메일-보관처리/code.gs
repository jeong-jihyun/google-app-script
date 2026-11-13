/** 144. 특정 제목 메일 보관 */
function archiveBySubject() {
  const word = '광고'; // 찾을 제목 글자 (바꾸세요)
  const threads = GmailApp.search('in:inbox subject:' + word, 0, 100);
  threads.forEach(t => t.moveToArchive());
  Logger.log(threads.length + '개 대화를 보관했습니다.');
}

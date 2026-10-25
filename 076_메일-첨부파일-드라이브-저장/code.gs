/** 076. "영수증" 라벨 메일의 첨부파일을 드라이브에 저장 */
function saveAttachments() {
  const label = GmailApp.getUserLabelByName('영수증');
  if (!label) throw new Error('Gmail 에 "영수증" 라벨이 없습니다.');
  const folderName = '영수증 모음';
  const folders = DriveApp.getFoldersByName(folderName);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
  const doneLabel = GmailApp.getUserLabelByName('영수증-저장완료') || GmailApp.createLabel('영수증-저장완료');

  label.getThreads(0, 50).forEach(function (thread) {
    thread.getMessages().forEach(function (msg) {
      msg.getAttachments().forEach(function (file) {
        folder.createFile(file);
      });
    });
    thread.removeLabel(label);
    thread.addLabel(doneLabel); // 다음에 또 저장하지 않도록 표시
  });
}

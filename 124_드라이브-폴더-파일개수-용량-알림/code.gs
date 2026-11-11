/** 124. 폴더 파일 개수·용량 계산 */
function folderSize() {
  const folderName = '내 폴더'; // 확인할 드라이브 폴더 이름으로 바꾸세요
  const folders = DriveApp.getFoldersByName(folderName);
  if (!folders.hasNext()) { Logger.log('폴더를 못 찾았어요: ' + folderName); return; }
  const files = folders.next().getFiles();
  let count = 0, bytes = 0;
  while (files.hasNext()) { const f = files.next(); count++; bytes += f.getSize(); }
  Logger.log(folderName + ': 파일 ' + count + '개, 합계 ' + (bytes / 1048576).toFixed(2) + ' MB');
}

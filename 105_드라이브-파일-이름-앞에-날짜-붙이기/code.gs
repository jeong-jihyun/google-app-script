/** 105. 폴더 안 파일 이름 앞에 오늘 날짜 붙이기 */
const FOLDER_ID = '여기에_폴더_ID'; // 폴더 주소의 folders/ 뒤 글자

function addDatePrefix() {
  const today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
  const files = DriveApp.getFolderById(FOLDER_ID).getFiles();
  let count = 0;
  while (files.hasNext()) {
    const file = files.next();
    if (/^\d{4}-\d{2}-\d{2}_/.test(file.getName())) continue; // 이미 날짜 있음
    file.setName(today + '_' + file.getName());
    count++;
  }
  Logger.log(count + '개 파일 이름을 바꿨습니다.');
}

/** 103. 특정 보낸 사람 메일에 라벨 붙이기 */
const SENDER = 'friend@example.com'; // 여기에 보낸 사람 주소
const LABEL_NAME = '중요사람';

function labelFromSender() {
  const label = GmailApp.getUserLabelByName(LABEL_NAME) || GmailApp.createLabel(LABEL_NAME);
  const threads = GmailApp.search('from:' + SENDER + ' -label:' + LABEL_NAME, 0, 100);
  threads.forEach(t => t.addLabel(label));
  Logger.log(threads.length + '개 대화에 라벨을 붙였습니다.');
}

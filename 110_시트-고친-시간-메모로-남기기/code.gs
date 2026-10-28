/** 110. 고친 시간을 칸 메모로 남기기 (고칠 때마다 자동 실행) */
function onEdit(e) {
  const time = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm');
  e.range.setNote('마지막 수정: ' + time);
}

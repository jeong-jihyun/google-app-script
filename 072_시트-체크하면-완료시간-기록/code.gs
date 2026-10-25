/** 072. B열 체크박스를 누르면 C열에 완료 시간 기록 (onEdit 은 이름 그대로 두면 자동 실행) */
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  // 2번 줄 아래, B열(2번째 칸)만 처리
  if (range.getColumn() !== 2 || range.getRow() < 2) return;
  const timeCell = sheet.getRange(range.getRow(), 3);
  if (range.getValue() === true) {
    timeCell.setValue(new Date());
    timeCell.setNumberFormat('yyyy-MM-dd HH:mm');
  } else {
    timeCell.clearContent();
  }
}

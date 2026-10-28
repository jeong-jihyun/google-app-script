/** 102. B열에 적으면 A열에 자동 번호 (시트를 고칠 때마다 자동 실행) */
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  if (range.getColumn() !== 2 || range.getRow() < 2) return; // B열, 2행부터
  const numberCell = sheet.getRange(range.getRow(), 1);
  if (range.getValue() !== '' && numberCell.getValue() === '') {
    numberCell.setValue(sheet.getLastRow() - 1);
  }
}

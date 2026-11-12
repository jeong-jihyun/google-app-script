/** 138. 체크하면 취소선 (A열 체크박스, B열 할 일) */
function onEdit(e) {
  const r = e.range;
  if (r.getColumn() !== 1) return;
  const task = r.getSheet().getRange(r.getRow(), 2);
  if (r.getValue() === true) {
    task.setFontLine('line-through').setFontColor('#999999');
  } else {
    task.setFontLine('none').setFontColor('#000000');
  }
}

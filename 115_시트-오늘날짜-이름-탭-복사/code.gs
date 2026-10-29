/** 115. '양식' 탭을 오늘 날짜 탭으로 복사 */
function copyTemplateToToday() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const template = ss.getSheetByName('양식');
  if (!template) {
    SpreadsheetApp.getUi().alert("'양식' 이라는 이름의 탭을 먼저 만들어 주세요.");
    return;
  }
  const name = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
  if (ss.getSheetByName(name)) {
    SpreadsheetApp.getUi().alert('이미 오늘 탭이 있습니다: ' + name);
    return;
  }
  const copy = template.copyTo(ss).setName(name);
  ss.setActiveSheet(copy);
}

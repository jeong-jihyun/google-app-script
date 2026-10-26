/** 081. 선택한 칸에 드롭다운 목록 만들기 */
function makeDropdown() {
  const range = SpreadsheetApp.getActiveRange(); // 지금 선택한 칸
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['진행 전', '진행 중', '완료'], true) // 고를 수 있는 값
    .setAllowInvalid(false)
    .build();
  range.setDataValidation(rule);
  SpreadsheetApp.getActive().toast('드롭다운을 만들었어요!');
}

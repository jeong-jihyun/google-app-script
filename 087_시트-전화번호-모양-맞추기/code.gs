/** 087. 전화번호 모양 통일 */
function fixPhones() {
  const range = SpreadsheetApp.getActiveRange();
  const values = range.getValues().map(function (row) {
    return row.map(function (v) {
      const d = String(v).replace(/[^0-9]/g, '');       // 숫자만 남기기
      if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      if (d.length === 10) return d.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      return v; // 모양이 다르면 그대로 둠
    });
  });
  range.setNumberFormat('@'); // 글자로 저장해야 앞의 0이 안 사라져요
  range.setValues(values);
}

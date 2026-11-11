/** 130. 영문 대소문자 바꾸기 */
function convertCase(mode) {
  const range = SpreadsheetApp.getActiveRange();
  const values = range.getValues().map(row => row.map(v => {
    if (typeof v !== 'string') return v;
    if (mode === 'upper') return v.toUpperCase();
    if (mode === 'lower') return v.toLowerCase();
    return v.toLowerCase().replace(/(^|\s)([a-z])/g, (m, a, b) => a + b.toUpperCase());
  }));
  range.setValues(values);
}
function toUpper() { convertCase('upper'); }   // ABC
function toLower() { convertCase('lower'); }   // abc
function toTitle() { convertCase('title'); }   // Abc Def

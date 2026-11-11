/** 128. D-day 계산 */
function fillDday() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dates = sheet.getRange(2, 1, last - 1, 1).getValues();
  const out = dates.map(([d]) => {
    if (!(d instanceof Date)) return [''];
    const day = new Date(d); day.setHours(0, 0, 0, 0);
    const diff = Math.round((day - today) / 86400000);
    return [diff === 0 ? 'D-day' : diff > 0 ? 'D-' + diff : 'D+' + (-diff)];
  });
  sheet.getRange(2, 2, out.length, 1).setValues(out);
}

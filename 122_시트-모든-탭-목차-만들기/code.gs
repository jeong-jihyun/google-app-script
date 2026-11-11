/** 122. 탭 목차 만들기 */
function makeIndex() {
  const ss = SpreadsheetApp.getActive();
  let idx = ss.getSheetByName('목차') || ss.insertSheet('목차', 0);
  idx.clear();
  idx.appendRow(['탭 이름 (누르면 이동)']);
  ss.getSheets().forEach(s => {
    if (s.getName() === '목차') return;
    const url = '#gid=' + s.getSheetId();
    idx.appendRow(['=HYPERLINK("' + url + '", "' + s.getName().replace(/"/g, '""') + '")']);
  });
}

/**
 * 018. 드라이브 사진을 Gemini로 설명하기
 * 준비: 스크립트 속성 GEMINI_API_KEY, IMAGE_FOLDER_ID
 */

// ---- Gemini 도우미 (002번과 같은 방식) ----
const GEMINI_MODEL = 'gemini-2.5-flash';

function askGeminiParts_(parts) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('스크립트 속성에 GEMINI_API_KEY 가 없습니다.');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify({ contents: [{ parts: parts }] }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Gemini 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
}

const MAX_IMAGES = 5;

function describeImages() {
  const props = PropertiesService.getScriptProperties();
  const folder = DriveApp.getFolderById(props.getProperty('IMAGE_FOLDER_ID'));
  const sheet = getOrCreateSheet_('사진설명', ['파일 이름', '링크', '설명']);

  const files = folder.getFiles();
  let count = 0;
  while (files.hasNext() && count < MAX_IMAGES) {
    const file = files.next();
    const type = file.getMimeType();
    if (type.indexOf('image/') !== 0) continue;

    const base64 = Utilities.base64Encode(file.getBlob().getBytes());
    const text = askGeminiParts_([
      { text: '이 사진을 한국어로 한 문장(40자 안팎)으로 설명해 줘.' },
      { inline_data: { mime_type: type, data: base64 } }
    ]);
    sheet.appendRow([file.getName(), file.getUrl(), text.trim()]);
    count++;
  }
}

function getOrCreateSheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); sheet.appendRow(header); }
  return sheet;
}

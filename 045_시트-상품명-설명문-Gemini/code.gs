/**
 * 045. 상품명(A열) → 소개 문구(B열) (Gemini 사용)
 */
function writeDescriptions() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const rows = sheet.getRange(2, 1, last - 1, 2).getValues();
  rows.forEach(function (row, i) {
    if (row[0] && !row[1]) {
      const text = askGemini_('상품 이름: ' + row[0] + '\n쇼핑몰에 쓸 소개 문구를 친근한 한국어 두 문장으로 써 줘. 과장 광고 표현은 쓰지 마.');
      sheet.getRange(i + 2, 2).setValue(text.trim());
    }
  });
}

// ---- 공통 도우미 (002번과 같은 방식) ----
const GEMINI_MODEL = 'gemini-2.5-flash';

function askGemini_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('스크립트 속성에 GEMINI_API_KEY 가 없습니다.');
  const res = UrlFetchApp.fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Gemini 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
}

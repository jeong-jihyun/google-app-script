/**
 * 028. 글에서 키워드·태그 뽑기 (Gemini 사용)
 */
function extractKeywords() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 2) return;

  const rows = sheet.getRange(2, 1, last - 1, 3).getValues();
  rows.forEach(function (row, i) {
    if (!row[0] || row[1]) return;
    const answer = askGemini_(
      '다음 글의 핵심 키워드 3개와, 검색용 태그 2개를 JSON 한 줄로만 답해: ' +
      '{"keywords":["a","b","c"],"tags":["x","y"]}\n\n' + row[0]
    );
    const r = parseJson_(answer);
    sheet.getRange(i + 2, 2, 1, 2).setValues([[r.keywords.join(', '), r.tags.map(function (t) { return '#' + t; }).join(' ')]]);
  });
}

function parseJson_(text) {
  const m = text.match(/[\[{][\s\S]*[\]}]/);
  if (!m) throw new Error('JSON 형태의 답이 아닙니다: ' + text);
  return JSON.parse(m[0]);
}

// ---- 공통 도우미 (002번과 같은 방식) ----
const GEMINI_MODEL = 'gemini-2.5-flash';

function askGemini_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('스크립트 속성에 GEMINI_API_KEY 가 없습니다.');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Gemini 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
}

/** 059. 지출 항목 자동 분류 */
const CATEGORIES = ['식비', '교통', '쇼핑', '문화', '건강', '주거', '기타'];

function classifyExpenses() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  for (let r = 2; r <= last; r++) {
    const memo = sheet.getRange(r, 1).getValue();
    if (!memo || sheet.getRange(r, 3).getValue()) continue;
    const answer = askGemini_('지출 내용: "' + memo + '"\n다음 중 가장 알맞은 항목 하나만 단어로 답해 줘: ' + CATEGORIES.join(', ')).trim();
    sheet.getRange(r, 3).setValue(CATEGORIES.indexOf(answer) >= 0 ? answer : '기타');
  }
}

// ---- 공통 도우미 (Gemini) ----
function askGemini_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('스크립트 속성에 GEMINI_API_KEY 가 없습니다.');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
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

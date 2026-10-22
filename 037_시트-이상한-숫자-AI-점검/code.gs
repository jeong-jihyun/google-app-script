/**
 * 037. A열 숫자 중 이상한 값을 AI가 찾아 메모 달기 (Gemini 사용)
 */
function checkNumbers() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 3) throw new Error('A열에 숫자를 3개 이상 넣어 주세요.');
  const values = sheet.getRange(1, 1, last, 1).getValues().map(function (r) { return r[0]; });

  const list = values.map(function (v, i) { return (i + 1) + '행: ' + v; }).join('\n');
  const answer = askGemini_(
    '아래는 A열 숫자야. 다른 값과 너무 다르거나 입력 실수 같은 행만 골라 ' +
    'JSON 배열로만 답해: [{"row":행번호,"why":"이유"}] 없으면 []\n\n' + list
  );
  const m = answer.match(/\[[\s\S]*\]/);
  const found = m ? JSON.parse(m[0]) : [];
  found.forEach(function (f) {
    const cell = sheet.getRange(f.row, 1);
    cell.setBackground('#fff2cc').setNote(f.why);
  });
  SpreadsheetApp.getActive().toast(found.length + '개를 표시했어요.');
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

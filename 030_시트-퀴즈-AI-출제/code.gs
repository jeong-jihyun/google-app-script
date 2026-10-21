/**
 * 030. 공부한 내용으로 객관식 퀴즈 만들기 (Gemini 사용)
 */
function makeQuiz() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const material = String(ss.getSheets()[0].getRange('A1').getValue()).trim();
  if (!material) throw new Error('A1 칸에 공부한 내용을 적어 주세요.');

  const answer = askGemini_(
    '아래 내용으로 객관식 퀴즈 3문제를 만들어 줘. JSON 배열로만 답해: ' +
    '[{"q":"문제","options":["보기1","보기2","보기3","보기4"],"answer":정답번호(1~4)}]\n\n' + material
  );
  const quiz = parseJson_(answer);

  let sheet = ss.getSheetByName('퀴즈');
  if (!sheet) sheet = ss.insertSheet('퀴즈');
  sheet.clear();
  sheet.appendRow(['문제', '보기1', '보기2', '보기3', '보기4', '정답 번호']);
  quiz.forEach(function (item) {
    sheet.appendRow([item.q].concat(item.options, [item.answer]));
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

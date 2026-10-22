/**
 * 034. 문서의 어려운 낱말을 골라 쉬운 용어 사전 만들기 (Gemini 사용)
 */
function makeGlossary() {
  const text = DocumentApp.getActiveDocument().getBody().getText().slice(0, 8000);
  if (!text.trim()) throw new Error('문서에 글이 없습니다.');

  const answer = askGemini_(
    '아래 글에서 어려운 낱말 최대 8개를 골라 초등학생도 알 수 있게 설명해 줘. ' +
    'JSON 배열로만 답해: [{"word":"낱말","easy":"쉬운 설명"}]\n\n' + text
  );
  const m = answer.match(/\[[\s\S]*\]/);
  if (!m) throw new Error('JSON 형태의 답이 아닙니다: ' + answer);
  const items = JSON.parse(m[0]);

  const ss = SpreadsheetApp.create('용어 사전');
  const sheet = ss.getSheets()[0];
  sheet.appendRow(['낱말', '쉬운 설명']);
  items.forEach(function (it) { sheet.appendRow([it.word, it.easy]); });
  Logger.log('용어 사전: ' + ss.getUrl());
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

/**
 * 035. 선택한 칸의 수식을 쉬운 말로 설명하기 (Gemini 사용)
 */
function explainFormula() {
  const cell = SpreadsheetApp.getActiveRange().getCell(1, 1);
  const formula = cell.getFormula();
  if (!formula) {
    SpreadsheetApp.getActive().toast('이 칸에는 수식이 없습니다.');
    return;
  }
  const explanation = askGemini_(
    '아래 구글 시트 수식이 무슨 일을 하는지 초등학생도 알 수 있게 한국어 두 문장으로 설명해 줘.\n' + formula
  );
  cell.offset(0, 1).setValue(explanation);
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

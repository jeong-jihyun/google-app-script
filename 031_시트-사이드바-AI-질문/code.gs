/**
 * 031. 시트 오른쪽 창(사이드바)에서 AI에게 질문하기 (Gemini 사용)
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('AI 도우미')
    .addItem('질문 창 열기', 'openSidebar')
    .addToUi();
}

function openSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar').setTitle('AI 도우미');
  SpreadsheetApp.getUi().showSidebar(html);
}

// 화면(Sidebar.html)에서 부르는 함수: 질문과 선택한 칸의 글을 AI에게 보냅니다.
function ask(question) {
  const cell = SpreadsheetApp.getActiveRange().getValue();
  const prompt = '다음 칸의 내용을 참고해서 한국어로 짧게 답해 줘.\n[칸 내용] ' + cell + '\n[질문] ' + question;
  return askGemini_(prompt);
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

/** 065. 시트 오른쪽 사이드바에 AI 질문창 띄우기 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('AI').addItem('질문창 열기', 'openSidebar').addToUi();
}

function openSidebar() {
  const html = HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;padding:8px">' +
    '<textarea id="q" rows="4" style="width:100%" placeholder="무엇이든 물어보세요"></textarea>' +
    '<button onclick="go()">물어보기</button>' +
    '<p id="a" style="white-space:pre-wrap"></p></div>' +
    '<script>function go(){document.getElementById("a").innerText="생각 중...";' +
    'google.script.run.withSuccessHandler(function(t){document.getElementById("a").innerText=t;})' +
    '.withFailureHandler(function(e){document.getElementById("a").innerText=e.message;})' +
    '.ask(document.getElementById("q").value);}</script>'
  ).setTitle('AI 질문창');
  SpreadsheetApp.getUi().showSidebar(html);
}

function ask(question) {
  return askClaude_(question);
}

// ---- 공통 도우미 (001번과 같은 방식) ----
const CLAUDE_MODEL = 'claude-sonnet-5-5';

function askClaude_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  if (!apiKey) throw new Error('스크립트 속성에 CLAUDE_API_KEY 가 없습니다.');
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Claude 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).content[0].text;
}

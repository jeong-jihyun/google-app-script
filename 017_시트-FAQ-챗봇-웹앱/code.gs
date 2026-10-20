/**
 * 017. 시트 FAQ 기반 AI 질문 웹앱
 * 시트에 'FAQ' 탭 (A열 질문, B열 답) 이 있어야 합니다.
 */

function doGet() {
  return HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;max-width:480px;margin:24px auto">' +
    '<h3>무엇이 궁금하세요?</h3>' +
    '<input id="q" style="width:100%;padding:8px" placeholder="질문을 입력하세요">' +
    '<button onclick="ask()" style="margin-top:8px;padding:8px 16px">물어보기</button>' +
    '<p id="a" style="white-space:pre-wrap"></p></div>' +
    '<script>function ask(){document.getElementById("a").innerText="생각 중...";' +
    'google.script.run.withSuccessHandler(function(r){document.getElementById("a").innerText=r;})' +
    '.answerFromFaq(document.getElementById("q").value);}</script>'
  ).setTitle('FAQ 도우미');
}

function answerFromFaq(question) {
  const sheet = SpreadsheetApp.getActive().getSheetByName('FAQ');
  const rows = sheet.getDataRange().getValues().slice(1);
  const faq = rows.map(function (r) { return 'Q: ' + r[0] + '\nA: ' + r[1]; }).join('\n\n');

  return askClaude_(
    '아래 FAQ 내용만 근거로 질문에 한국어로 짧게 답해 줘. FAQ에 없으면 "해당 내용은 FAQ에 없어 모르겠습니다"라고만 답해.\n\n' +
    faq + '\n\n질문: ' + question
  );
}

// ---- 공통 도우미 (001번과 같은 방식) ----
const CLAUDE_MODEL = 'claude-sonnet-5-5';

function askClaude_(prompt, maxTokens) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  if (!apiKey) throw new Error('스크립트 속성에 CLAUDE_API_KEY 가 없습니다.');
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens || 600,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Claude 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).content[0].text;
}

function getOrCreateSheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); sheet.appendRow(header); }
  return sheet;
}

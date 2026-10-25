/** 064. 'FAQ' 탭(A열 질문, B열 답)을 참고해 새 질문에 답하기 */
function answerFromFaq() {
  const ss = SpreadsheetApp.getActive();
  const faq = ss.getSheetByName('FAQ').getDataRange().getValues()
    .map(function (row) { return 'Q: ' + row[0] + '\nA: ' + row[1]; }).join('\n\n');
  const ask = ss.getSheetByName('질문');
  const last = ask.getLastRow();
  for (let r = 2; r <= last; r++) {
    const q = ask.getRange(r, 1).getValue();
    if (!q || ask.getRange(r, 2).getValue()) continue;
    const a = askClaude_('아래 FAQ 내용만 근거로 질문에 짧고 친절하게 답해 줘. FAQ에 없으면 "담당자 확인 후 안내드리겠습니다"라고만 써.\n\n[FAQ]\n' + faq + '\n\n[질문]\n' + q);
    ask.getRange(r, 2).setValue(a.trim());
  }
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

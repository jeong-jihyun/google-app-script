/** 067. 문서에서 드래그로 고른 글을 쉬운 말로 바꾸기 */
function onOpen() {
  DocumentApp.getUi().createMenu('AI').addItem('선택한 글 쉽게 바꾸기', 'simplifySelection').addToUi();
}

function simplifySelection() {
  const sel = DocumentApp.getActiveDocument().getSelection();
  if (!sel) { DocumentApp.getUi().alert('먼저 바꿀 글을 드래그해서 고르세요.'); return; }
  sel.getRangeElements().forEach(function (el) {
    if (el.getElement().editAsText === undefined) return;
    const text = el.getElement().asText();
    const from = el.isPartial() ? el.getStartOffset() : 0;
    const to = el.isPartial() ? el.getEndOffsetInclusive() : text.getText().length - 1;
    const original = text.getText().substring(from, to + 1);
    const easy = askClaude_('초등학생도 이해하도록 뜻은 그대로 두고 쉬운 한국어로 바꿔 줘. 바꾼 글만 답해.\n\n' + original);
    text.deleteText(from, to);
    text.insertText(from, easy.trim());
  });
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

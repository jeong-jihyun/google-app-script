/**
 * 040. 문서에서 고른 글을 쉬운 말로 풀어 바로 아래에 넣기 (Claude 사용)
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('AI 도우미')
    .addItem('선택한 글 쉬운 말로 풀기', 'simplifySelection')
    .addToUi();
}

function simplifySelection() {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if (!selection) {
    DocumentApp.getUi().alert('먼저 풀고 싶은 글을 드래그해서 고르세요.');
    return;
  }
  const parts = [];
  let lastParagraph = null;
  selection.getRangeElements().forEach(function (re) {
    const el = re.getElement();
    if (el.editAsText) {
      const t = el.editAsText().getText();
      parts.push(re.isPartial() ? t.substring(re.getStartOffset(), re.getEndOffsetInclusive() + 1) : t);
      lastParagraph = el.getParent();
    }
  });
  if (parts.length === 0 || !lastParagraph) return;

  const easy = askClaude_('아래 글을 초등학생도 이해할 수 있게 쉬운 한국어로 풀어 써 줘.\n\n' + parts.join('\n'));
  const body = DocumentApp.getActiveDocument().getBody();
  const index = body.getChildIndex(lastParagraph);
  body.insertParagraph(index + 1, '[쉬운 풀이] ' + easy).setItalic(true);
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
    payload: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Claude 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).content[0].text;
}

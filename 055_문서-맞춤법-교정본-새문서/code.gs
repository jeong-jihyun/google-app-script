/** 055. 맞춤법 교정본 만들기 */
function makeProofread() {
  const src = DocumentApp.getActiveDocument();
  const text = src.getBody().getText();
  if (!text.trim()) throw new Error('문서에 글이 없습니다.');
  const fixed = askClaude_('아래 글의 맞춤법과 띄어쓰기만 고쳐서 글 전체를 그대로 돌려줘. 내용과 말투는 바꾸지 말고 설명도 붙이지 마.\n\n' + text.substring(0, 8000));
  const out = DocumentApp.create(src.getName() + '_교정본');
  out.getBody().setText(fixed.trim());
  Logger.log('교정본: ' + out.getUrl());
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

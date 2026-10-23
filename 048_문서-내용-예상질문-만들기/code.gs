/**
 * 048. 문서 내용으로 예상 질문·답 5쌍을 문서 맨 아래에 추가 (Claude 사용)
 */
function addQnA() {
  const body = DocumentApp.getActiveDocument().getBody();
  const text = body.getText().substring(0, 6000);
  const qna = askClaude_('아래 글을 읽는 사람이 궁금해할 질문 5개와 글에 근거한 짧은 답을 써 줘. "Q1. ... / A1. ..." 형식, 한국어.\n\n' + text);
  body.appendHorizontalRule();
  body.appendParagraph('자주 나올 질문과 답 (AI 작성)').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  qna.split('\n').forEach(function (line) {
    if (line.trim()) body.appendParagraph(line.trim());
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

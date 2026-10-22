/**
 * 036. 글에 어울리는 제목 후보 5개를 문서 맨 위에 넣기 (Claude 사용)
 */
function suggestTitles() {
  const body = DocumentApp.getActiveDocument().getBody();
  const text = body.getText().slice(0, 6000);
  if (!text.trim()) throw new Error('문서에 글이 없습니다.');

  const titles = askClaude_(
    '아래 글에 어울리는 제목 후보 5개를 한 줄에 하나씩, 번호 없이 한국어로 써 줘.\n\n' + text
  );
  body.insertParagraph(0, '[제목 후보]\n' + titles).setItalic(true);
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

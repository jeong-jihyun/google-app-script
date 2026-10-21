/**
 * 023. 구글 문서 말투 바꾸기
 * 열어 둔 문서(컨테이너 바인딩)의 글을 다른 말투로 바꿔 새 문서에 담습니다.
 */
const TARGET_TONE = '공손한 존댓말';

function rewriteTone() {
  const doc = DocumentApp.getActiveDocument();
  const text = doc.getBody().getText().trim();
  if (!text) throw new Error('문서에 글이 없습니다.');

  const result = askClaude_(
    '다음 글의 뜻은 그대로 두고 말투만 "' + TARGET_TONE + '"로 바꿔 줘. 바꾼 글만 출력해.\n\n' + text, 2000
  );

  const newDoc = DocumentApp.create(doc.getName() + ' (말투 변경)');
  newDoc.getBody().setText(result.trim());
  Logger.log('새 문서: ' + newDoc.getUrl());
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

// AI 답에서 JSON 부분만 꺼내 읽습니다.
function parseJson_(text) {
  const m = text.match(/[\[{][\s\S]*[\]}]/);
  if (!m) throw new Error('JSON 형태의 답이 아닙니다: ' + text);
  return JSON.parse(m[0]);
}

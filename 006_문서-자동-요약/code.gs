/**
 * 006. 구글 문서 자동 요약
 * 구글 문서(Docs) 맨 위에 "AI 요약" 문단을 넣어 줍니다.
 * 문서 안에서 열면 메뉴 "AI 도구 → 이 문서 요약하기"가 생깁니다.
 *
 * 준비: 스크립트 속성에 CLAUDE_API_KEY 저장
 */

const CLAUDE_MODEL = 'claude-sonnet-5-5';

function onOpen() {
  DocumentApp.getUi()
    .createMenu('AI 도구')
    .addItem('이 문서 요약하기', 'summarizeThisDoc')
    .addToUi();
}

function summarizeThisDoc() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const text = body.getText().substring(0, 12000); // 너무 길면 앞부분만

  if (text.trim().length < 50) {
    DocumentApp.getUi().alert('요약할 내용이 너무 짧습니다.');
    return;
  }

  const summary = askClaude_(
    '다음 글을 한국어로 핵심만 3~5개의 짧은 문장으로 요약해 줘.\n\n' + text
  );

  // 맨 위에 요약 문단 삽입
  const title = body.insertParagraph(0, '[AI 요약]');
  title.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.insertParagraph(1, summary);
  body.insertHorizontalRule(2);
}

function askClaude_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 700,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Claude 호출 실패: ' + res.getContentText());
  }
  return JSON.parse(res.getContentText()).content[0].text;
}

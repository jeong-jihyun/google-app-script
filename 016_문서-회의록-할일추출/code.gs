/**
 * 016. 회의 메모에서 할 일 뽑기 (구글 문서에 연결된 스크립트)
 */

function onOpen() {
  DocumentApp.getUi().createMenu('AI').addItem('할 일 뽑기', 'extractActionItems').addToUi();
}

function extractActionItems() {
  const body = DocumentApp.getActiveDocument().getBody();
  const memo = body.getText();
  if (!memo.trim()) return;

  const result = askClaude_(
    '다음 회의 메모에서 할 일을 "- 담당자 / 할 일 / 기한" 형식의 목록으로 정리해 줘. 없는 정보는 "미정"으로 써.\n\n' + memo.substring(0, 6000), 700
  );
  body.appendParagraph('');
  body.appendParagraph('[AI 할 일 정리]').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(result);
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

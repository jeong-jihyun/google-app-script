/**
 * 011. 구글 폼 응답에 AI가 자동 답변 메일 작성
 * 폼 편집기 > 스크립트 편집기(폼에 연결된 스크립트)에 붙여 넣어 사용합니다.
 */

const SEND_DIRECTLY = false; // true면 바로 발송, false면 임시보관함에만 저장

function onFormSubmit(e) {
  // 폼 응답에서 이메일(첫 질문)과 문의 내용(둘째 질문)을 꺼냅니다.
  const items = e.response.getItemResponses();
  const email = e.response.getRespondentEmail() || String(items[0].getResponse());
  const question = String(items[items.length - 1].getResponse());

  const reply = askClaude_(
    '고객 문의에 정중하고 간단하게 한국어로 답변해 줘. 모르는 내용은 "담당자가 확인 후 안내드리겠습니다"라고 써.\n\n문의: ' + question
  );

  const subject = '[문의 답변] 문의해 주셔서 감사합니다';
  if (SEND_DIRECTLY) {
    GmailApp.sendEmail(email, subject, reply);
  } else {
    GmailApp.createDraft(email, subject, reply);
  }
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

/**
 * 003. 안 읽은 메일 AI 요약
 * 받은편지함의 안 읽은 메일(최대 5통)을 Claude로 요약해 시트에 쌓습니다.
 *
 * 준비: 스크립트 속성에 CLAUDE_API_KEY 저장 (001번 README 참고)
 */

const CLAUDE_MODEL = 'claude-sonnet-5-5';
const MAX_MAILS = 5;

function summarizeUnreadMails() {
  const sheet = getOrCreateSheet_('메일요약', ['날짜', '보낸 사람', '제목', 'AI 요약']);
  const threads = GmailApp.search('is:unread in:inbox', 0, MAX_MAILS);

  threads.forEach(function (thread) {
    const msg = thread.getMessages()[thread.getMessageCount() - 1];
    // 너무 긴 본문은 앞부분만 보냅니다.
    const body = msg.getPlainBody().substring(0, 3000);
    const summary = askClaude_(
      '다음 메일을 한국어로 두세 줄로 요약하고, 내가 해야 할 일이 있으면 마지막 줄에 "할 일:"로 적어 줘.\n\n' + body
    );
    sheet.appendRow([msg.getDate(), msg.getFrom(), msg.getSubject(), summary]);
  });
}

function askClaude_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Claude 호출 실패: ' + res.getContentText());
  }
  return JSON.parse(res.getContentText()).content[0].text;
}

function getOrCreateSheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(header);
  }
  return sheet;
}

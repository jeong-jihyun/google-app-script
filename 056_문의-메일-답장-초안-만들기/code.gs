/** 056. 문의 메일 답장 초안 */
function draftReplies() {
  const threads = GmailApp.search('label:문의 is:unread', 0, 5);   // 한 번에 5개
  threads.forEach(function (th) {
    const msg = th.getMessages()[th.getMessageCount() - 1];
    const reply = askClaude_('아래 메일에 대한 정중한 한국어 답장 초안을 써 줘. 모르는 사실은 지어내지 말고 "확인 후 안내드리겠습니다"라고 써.\n\n보낸 사람: ' + msg.getFrom() + '\n제목: ' + msg.getSubject() + '\n내용:\n' + msg.getPlainBody().substring(0, 3000));
    th.createDraftReply(reply.trim());
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

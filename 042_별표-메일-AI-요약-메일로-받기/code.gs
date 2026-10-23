/**
 * 042. 별표 메일(최근 10통)을 AI로 요약해 나에게 메일로 보내기 (Claude 사용)
 */
function summarizeStarred() {
  const threads = GmailApp.search('is:starred', 0, 10);
  if (threads.length === 0) {
    Logger.log('별표 메일이 없습니다.');
    return;
  }
  const lines = [];
  threads.forEach(function (t) {
    const msg = t.getMessages()[t.getMessageCount() - 1];
    const body = msg.getPlainBody().substring(0, 1500);
    const sum = askClaude_('아래 메일을 한국어 한 줄(60자 안팎)로 요약해 줘.\n제목: ' + t.getFirstMessageSubject() + '\n\n' + body);
    lines.push('• ' + t.getFirstMessageSubject() + '\n   → ' + sum.trim());
  });
  const me = Session.getActiveUser().getEmail();
  GmailApp.sendEmail(me, '[AI 요약] 별표 메일 ' + threads.length + '통', lines.join('\n\n'));
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

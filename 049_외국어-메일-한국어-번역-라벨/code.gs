/**
 * 049. 한글이 거의 없는 최근 메일을 번역해 요약 메일로 보내고 "번역완료" 라벨 붙이기 (Claude 사용)
 */
function translateForeignMails() {
  const label = GmailApp.getUserLabelByName('번역완료') || GmailApp.createLabel('번역완료');
  const threads = GmailApp.search('in:inbox newer_than:2d -label:번역완료', 0, 10);
  const results = [];
  threads.forEach(function (t) {
    const msg = t.getMessages()[t.getMessageCount() - 1];
    const body = msg.getPlainBody().substring(0, 2000);
    const hangul = (body.match(/[가-힣]/g) || []).length;
    if (hangul / Math.max(body.length, 1) > 0.1) return;   // 한글이 많으면 건너뜀
    const ko = askClaude_('아래 메일을 자연스러운 한국어로 번역해 줘.\n\n' + body);
    results.push('■ ' + t.getFirstMessageSubject() + '\n' + ko.trim());
    t.addLabel(label);
  });
  if (results.length > 0) {
    GmailApp.sendEmail(Session.getActiveUser().getEmail(), '[번역] 외국어 메일 ' + results.length + '통', results.join('\n\n----------\n\n'));
  }
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

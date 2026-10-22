/**
 * 038. 할 일 목록에서 오늘 할 것 3개를 골라 내게 메일 보내기 (Claude 사용)
 */
function sendTodayPriority() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = sheet.getDataRange().getValues().filter(function (r) { return r[0]; });
  if (rows.length === 0) throw new Error('A열에 할 일을 적어 주세요.');
  const today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
  const list = rows.map(function (r) { return '- ' + r[0] + (r[1] ? ' (마감 ' + r[1] + ')' : ''); }).join('\n');

  const advice = askClaude_(
    '오늘은 ' + today + '이야. 아래 할 일 중 오늘 꼭 해야 할 3가지를 골라 이유와 함께 한국어로 짧게 알려 줘.\n' + list
  );
  MailApp.sendEmail(Session.getActiveUser().getEmail(), '오늘의 우선순위 ' + today, advice);
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

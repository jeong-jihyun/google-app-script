/**
 * 021. 시트 숫자를 AI가 읽고 월간 보고 메일 보내기
 * 시트 전체 표를 AI에게 보여 주고, 요약 보고서를 내 메일로 보냅니다.
 */
function sendMonthlyReport() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = sheet.getDataRange().getDisplayValues();
  if (rows.length < 2) throw new Error('데이터가 없습니다. 2행부터 숫자를 적어 주세요.');

  const table = rows.map(function (r) { return r.join(' | '); }).join('\n');
  const report = askClaude_(
    '아래 표는 월별 숫자입니다. 늘거나 줄어든 점, 눈에 띄는 점, 다음 달 제안을 ' +
    '쉬운 한국어로 5줄 이내로 정리해 줘.\n\n' + table, 700
  );

  const me = Session.getActiveUser().getEmail();
  MailApp.sendEmail(me, '[월간 보고] AI가 정리한 이번 달 숫자', report);
  Logger.log('보고 메일을 보냈습니다: ' + me);
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

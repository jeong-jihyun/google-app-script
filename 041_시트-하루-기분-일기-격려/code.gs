/**
 * 041. 시트 일기(A열)에 AI 격려 한마디(B열) 달기 (Claude 사용)
 * 1행은 제목, 2행부터 일기. B열이 비어 있는 줄만 처리합니다.
 */
function addEncouragement() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const rows = sheet.getRange(2, 1, last - 1, 2).getValues();
  rows.forEach(function (row, i) {
    if (row[0] && !row[1]) {
      const msg = askClaude_('아래는 누군가의 오늘 일기야. 읽고 따뜻하고 짧은 격려를 한국어 한 문장으로만 써 줘.\n\n' + row[0]);
      sheet.getRange(i + 2, 2).setValue(msg.trim());
    }
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

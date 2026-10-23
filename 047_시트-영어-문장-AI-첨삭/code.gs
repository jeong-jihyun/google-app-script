/**
 * 047. 영어 문장(A열) 첨삭 → 고친 문장(B열), 이유(C열) (Claude 사용)
 */
function correctEnglish() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const rows = sheet.getRange(2, 1, last - 1, 2).getValues();
  rows.forEach(function (row, i) {
    if (row[0] && !row[1]) {
      const out = askClaude_('아래 영어 문장을 자연스럽게 고쳐 줘. 반드시 이 형식으로만 답해:\n고친 문장 || 한국어로 이유 한 줄\n\n' + row[0]);
      const parts = out.split('||');
      sheet.getRange(i + 2, 2, 1, 2).setValues([[(parts[0] || '').trim(), (parts[1] || '').trim()]]);
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

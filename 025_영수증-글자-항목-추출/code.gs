/**
 * 025. 영수증 글에서 날짜·가게·금액·분류 뽑기
 * A열 원문 -> B열 날짜, C열 가게, D열 금액, E열 분류
 */
function extractReceipts() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 1) return;

  const rows = sheet.getRange(1, 1, last, 2).getValues();
  rows.forEach(function (row, i) {
    if (!row[0] || row[1]) return;
    const answer = askClaude_(
      '다음 영수증 글에서 정보를 뽑아 JSON 한 줄로만 답해: ' +
      '{"date":"yyyy-MM-dd","store":"가게","amount":숫자,"category":"식비|교통|쇼핑|기타"}\n\n' + row[0], 200
    );
    const r = parseJson_(answer);
    sheet.getRange(i + 1, 2, 1, 4).setValues([[r.date, r.store, r.amount, r.category]]);
  });
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

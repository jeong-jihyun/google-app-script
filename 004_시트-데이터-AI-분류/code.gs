/**
 * 004. 시트 데이터 AI 분류
 * A열의 문의 내용을 읽고 B열에 분류(결제/배송/사용법/기타)를 적어 줍니다.
 *
 * 준비: 스크립트 속성에 CLAUDE_API_KEY 저장
 */

const CLAUDE_MODEL = 'claude-sonnet-5-5';
const CATEGORIES = ['결제', '배송', '사용법', '기타'];

function classifyRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  // 1행은 제목, 2행부터 데이터. A열=문의, B열=분류
  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();

  values.forEach(function (row, i) {
    const text = row[0];
    const already = row[1];
    if (!text || already) return; // 비어 있거나 이미 분류됨

    const answer = askClaude_(
      '다음 문의를 [' + CATEGORIES.join(', ') + '] 중 하나로만 분류해. 다른 말은 하지 말고 단어 하나만 답해.\n\n' + text
    ).trim();

    const category = CATEGORIES.indexOf(answer) >= 0 ? answer : '기타';
    sheet.getRange(i + 2, 2).setValue(category);
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
      max_tokens: 20,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Claude 호출 실패: ' + res.getContentText());
  }
  return JSON.parse(res.getContentText()).content[0].text;
}

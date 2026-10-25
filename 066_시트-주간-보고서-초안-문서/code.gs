/** 066. '한일' 탭(A열 날짜, B열 한 일) → 주간 보고서 새 문서 */
function makeWeeklyReport() {
  const rows = SpreadsheetApp.getActive().getSheetByName('한일').getDataRange().getValues().slice(1);
  const list = rows.filter(function (r) { return r[1]; })
    .map(function (r) { return Utilities.formatDate(new Date(r[0]), 'Asia/Seoul', 'MM/dd') + ' ' + r[1]; }).join('\n');
  const report = askClaude_('아래 한 일 목록으로 "이번 주 한 일 / 어려웠던 점 / 다음 주 계획" 3부분의 주간 보고서를 한국어로 써 줘. 목록에 없는 사실은 지어내지 마.\n\n' + list);
  const doc = DocumentApp.create('주간 보고서 ' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd'));
  doc.getBody().setText(report);
  Logger.log(doc.getUrl());
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

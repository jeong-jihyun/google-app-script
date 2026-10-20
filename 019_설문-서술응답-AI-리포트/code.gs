/**
 * 019. 설문 서술형 답변 AI 리포트
 * 응답 시트에 붙여 사용합니다.
 */

const TARGET_COLUMN = 2;   // 서술형 답이 있는 열 번호 (A=1, B=2 ...)
const MAX_ANSWERS = 100;   // 한 번에 읽을 최대 답변 수

function makeSurveyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const source = ss.getSheets()[0];
  const lastRow = source.getLastRow();
  if (lastRow < 2) return;

  const answers = source.getRange(2, TARGET_COLUMN, Math.min(lastRow - 1, MAX_ANSWERS), 1)
    .getValues().map(function (r) { return String(r[0]).trim(); })
    .filter(function (t) { return t; });

  const report = askClaude_(
    '다음은 설문 서술형 답변 ' + answers.length + '개입니다. 공통된 의견 3가지와 개선 제안 2가지를 한국어로 정리해 줘.\n\n- ' +
    answers.join('\n- '), 800
  );
  const out = getOrCreateSheet_('AI리포트', ['생성 시각', '응답 수', '리포트']);
  out.appendRow([new Date(), answers.length, report]);
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

function getOrCreateSheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); sheet.appendRow(header); }
  return sheet;
}

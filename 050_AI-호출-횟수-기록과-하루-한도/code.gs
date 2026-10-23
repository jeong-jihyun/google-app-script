/**
 * 050. AI 호출 횟수 기록 + 하루 한도 (Claude 사용)
 * 다른 예제의 askClaude_ 대신 askClaudeSafe_ 를 쓰면 한도가 적용됩니다.
 */
const DAILY_LIMIT = 20;   // 하루 최대 호출 횟수 (원하는 숫자로 바꾸세요)

function askClaudeSafe_(prompt) {
  const props = PropertiesService.getScriptProperties();
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const used = props.getProperty('COUNT_DATE') === today ? Number(props.getProperty('COUNT') || 0) : 0;
  if (used >= DAILY_LIMIT) throw new Error('오늘 AI 호출 한도(' + DAILY_LIMIT + '회)를 모두 썼습니다.');

  const answer = askClaude_(prompt);
  props.setProperties({ COUNT_DATE: today, COUNT: String(used + 1) });
  logUsage_(today, used + 1, prompt);
  return answer;
}

function logUsage_(date, count, prompt) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('AI사용기록') || ss.insertSheet('AI사용기록');
  if (sheet.getLastRow() === 0) sheet.appendRow(['시간', '오늘 몇 번째', '질문 앞부분']);
  sheet.appendRow([new Date(), count, prompt.substring(0, 40)]);
}

/** 실행해 보는 함수 */
function testSafeCall() {
  Logger.log(askClaudeSafe_('안녕! 한 문장으로 인사해 줘.'));
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

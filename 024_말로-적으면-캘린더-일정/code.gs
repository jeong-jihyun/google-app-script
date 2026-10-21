/**
 * 024. 말로 적은 문장을 구글 캘린더 일정으로 만들기
 */
function addEventsFromSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const last = sheet.getLastRow();
  if (last < 2) return;
  const today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd (E)');

  const rows = sheet.getRange(2, 1, last - 1, 2).getValues();
  rows.forEach(function (row, i) {
    if (!row[0] || row[1]) return;           // 빈 줄·이미 처리한 줄은 건너뜀
    const answer = askClaude_(
      '오늘은 ' + today + ' 입니다. 아래 문장에서 일정 정보를 뽑아 JSON 한 줄로만 답해: ' +
      '{"title":"제목","start":"yyyy-MM-ddTHH:mm:00","end":"yyyy-MM-ddTHH:mm:00"} ' +
      '(끝나는 시간이 없으면 1시간 뒤)\n\n' + row[0], 300
    );
    const e = parseJson_(answer);
    CalendarApp.getDefaultCalendar().createEvent(e.title, new Date(e.start), new Date(e.end));
    sheet.getRange(i + 2, 2).setValue('등록 완료: ' + e.start);
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

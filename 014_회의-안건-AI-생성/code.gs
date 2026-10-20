/**
 * 014. 내일 회의 일정에 AI 추천 안건 달기
 */

const KEYWORD = '회의'; // 제목에 이 글자가 있는 일정만 처리

function addAgendaToTomorrowMeetings() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  CalendarApp.getDefaultCalendar().getEvents(start, end).forEach(function (event) {
    if (event.getTitle().indexOf(KEYWORD) === -1) return;
    if (event.getDescription().indexOf('[AI 추천 안건]') !== -1) return; // 중복 방지

    const agenda = askClaude_(
      '회의 제목: ' + event.getTitle() + '\n이 회의에서 다루면 좋을 안건을 체크리스트 형태로 4개 이내로, 한국어로 짧게 써 줘.'
    );
    event.setDescription((event.getDescription() + '\n\n[AI 추천 안건]\n' + agenda).trim());
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

function getOrCreateSheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); sheet.appendRow(header); }
  return sheet;
}

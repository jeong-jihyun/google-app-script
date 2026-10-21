/**
 * 022. 받은 메일 중요도를 AI가 1~5점으로 매기기
 */
function scoreRecentMails() {
  const threads = GmailApp.getInboxThreads(0, 10);
  const sheet = getOrCreateSheet_('메일점수', ['점수', '보낸 사람', '제목', '이유']);

  threads.forEach(function (t) {
    const msg = t.getMessages()[t.getMessageCount() - 1];
    const body = msg.getPlainBody().substring(0, 600);
    const answer = askClaude_(
      '아래 메일이 얼마나 급하고 중요한지 1(낮음)~5(매우 높음)로 판단해 줘. ' +
      '반드시 JSON 한 줄로만 답해: {"score":숫자,"reason":"한 문장 이유"}\n\n' +
      '제목: ' + msg.getSubject() + '\n내용: ' + body, 200
    );
    const r = parseJson_(answer);
    sheet.appendRow([r.score, msg.getFrom(), msg.getSubject(), r.reason]);
  });
}

function getOrCreateSheet_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); sheet.appendRow(header); }
  return sheet;
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

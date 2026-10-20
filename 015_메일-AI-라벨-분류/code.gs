/**
 * 015. 메일을 AI로 분류해 라벨 붙이기
 */

const CATEGORIES = ['업무', '결제·청구', '광고', '기타'];

function labelMailsByAI() {
  const threads = GmailApp.search('is:unread in:inbox -label:AI', 0, 10);
  threads.forEach(function (thread) {
    const msg = thread.getMessages()[0];
    const text = '제목: ' + msg.getSubject() + '\n본문: ' + msg.getPlainBody().substring(0, 1500);
    let answer = askClaude_(
      '다음 메일을 ' + CATEGORIES.join(', ') + ' 중 정확히 하나로 분류하고, 분류 이름만 출력해.\n\n' + text, 20
    ).trim();
    if (CATEGORIES.indexOf(answer) === -1) answer = '기타';

    const label = GmailApp.getUserLabelByName('AI/' + answer) || GmailApp.createLabel('AI/' + answer);
    thread.addLabel(label);
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

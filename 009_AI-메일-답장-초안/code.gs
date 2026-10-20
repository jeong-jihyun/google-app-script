/**
 * 009. AI 메일 답장 초안
 * "답장필요" 라벨이 붙은 메일에 대해 AI가 답장 초안을 만들어 Gmail 임시보관함에 저장합니다.
 * 메일을 직접 보내지는 않습니다. 사람이 읽고 고쳐서 보내세요.
 *
 * 준비: 스크립트 속성에 CLAUDE_API_KEY 저장, Gmail에서 "답장필요" 라벨 만들기
 */

const CLAUDE_MODEL = 'claude-sonnet-5-5';
const TARGET_LABEL = '답장필요';
const DONE_LABEL = '초안작성완료';

function createReplyDrafts() {
  const target = GmailApp.getUserLabelByName(TARGET_LABEL);
  if (!target) {
    throw new Error('Gmail에 "' + TARGET_LABEL + '" 라벨을 먼저 만들어 주세요.');
  }
  const done = GmailApp.getUserLabelByName(DONE_LABEL) || GmailApp.createLabel(DONE_LABEL);

  target.getThreads(0, 5).forEach(function (thread) {
    const last = thread.getMessages()[thread.getMessageCount() - 1];
    const body = last.getPlainBody().substring(0, 3000);

    const reply = askClaude_(
      '다음 메일에 대한 정중하고 간결한 한국어 답장 초안을 써 줘. ' +
      '모르는 사실은 지어내지 말고 [확인 필요]라고 표시해. 인사말과 맺음말 포함.\n\n' + body
    );

    thread.createDraftReply(reply);   // 임시보관함에만 저장
    thread.removeLabel(target);
    thread.addLabel(done);
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
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Claude 호출 실패: ' + res.getContentText());
  }
  return JSON.parse(res.getContentText()).content[0].text;
}

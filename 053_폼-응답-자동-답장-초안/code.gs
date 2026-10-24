/** 053. 폼 응답 자동 답장 */
function createTrigger() {
  ScriptApp.newTrigger('onFormSubmit_').forForm(FormApp.getActiveForm()).onFormSubmit().create();
}

function onFormSubmit_(e) {
  const resp = e.response;
  const email = resp.getRespondentEmail();
  if (!email) return;
  const body = resp.getItemResponses().map(function (ir) {
    return ir.getItem().getTitle() + ': ' + ir.getResponse();
  }).join('\n');
  const reply = askClaude_('아래는 설문 응답입니다. 보낸 분께 드릴 정중하고 따뜻한 한국어 답장 본문을 5문장 이내로 써 줘. 약속하지 않은 일은 적지 마.\n\n' + body);
  MailApp.sendEmail(email, '[자동 답장] 의견 감사합니다', reply);
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

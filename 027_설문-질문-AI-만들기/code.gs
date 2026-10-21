/**
 * 027. 주제를 주면 AI가 질문을 만들어 구글 폼 생성
 */
const SURVEY_TOPIC = '신입 사원 교육 만족도';

function createSurveyForm() {
  const answer = askClaude_(
    '"' + SURVEY_TOPIC + '" 설문 질문 6개를 만들어 줘. 앞 5개는 1~5점 척도 질문, ' +
    '마지막 1개는 자유 의견 질문. JSON 배열로만 답해: ' +
    '[{"type":"scale","q":"질문"},{"type":"text","q":"질문"}]', 800
  );
  const questions = parseJson_(answer);

  const form = FormApp.create(SURVEY_TOPIC + ' 설문');
  questions.forEach(function (item) {
    if (item.type === 'scale') {
      form.addScaleItem().setTitle(item.q).setBounds(1, 5).setLabels('매우 아니다', '매우 그렇다');
    } else {
      form.addParagraphTextItem().setTitle(item.q);
    }
  });
  Logger.log('수정 주소: ' + form.getEditUrl());
  Logger.log('응답 주소: ' + form.getPublishedUrl());
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

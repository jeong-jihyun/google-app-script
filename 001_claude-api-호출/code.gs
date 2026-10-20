/**
 * 001. Claude API 호출 기본 예제
 * 질문을 보내고 Claude의 답을 받아 옵니다.
 *
 * 준비: 스크립트 속성에 CLAUDE_API_KEY 를 저장해 두세요. (README 참고)
 */

// 사용할 모델 이름 (필요하면 바꾸세요)
const CLAUDE_MODEL = 'claude-sonnet-5-5';

/**
 * Claude에게 질문을 보내고 답을 글자로 돌려줍니다.
 * @param {string} question 물어볼 내용
 * @return {string} Claude의 답
 */
function askClaude(question) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  if (!apiKey) {
    throw new Error('스크립트 속성에 CLAUDE_API_KEY 가 없습니다.');
  }

  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      messages: [{ role: 'user', content: question }]
    }),
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  const data = JSON.parse(response.getContentText());
  if (code !== 200) {
    throw new Error('Claude 호출 실패 (' + code + '): ' + response.getContentText());
  }
  return data.content[0].text;
}

/** 실행해 보는 함수: 로그에 답이 찍힙니다. */
function testAskClaude() {
  const answer = askClaude('구글 앱 스크립트가 무엇인지 두 문장으로 쉽게 설명해 줘.');
  Logger.log(answer);
}

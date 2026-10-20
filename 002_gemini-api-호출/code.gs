/**
 * 002. Gemini API 호출 기본 예제
 * 질문을 보내고 Gemini의 답을 받아 옵니다.
 *
 * 준비: 스크립트 속성에 GEMINI_API_KEY 를 저장해 두세요. (README 참고)
 */

// 사용할 모델 이름 (필요하면 바꾸세요)
const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * Gemini에게 질문을 보내고 답을 글자로 돌려줍니다.
 * @param {string} question 물어볼 내용
 * @return {string} Gemini의 답
 */
function askGemini(question) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('스크립트 속성에 GEMINI_API_KEY 가 없습니다.');
  }

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
    GEMINI_MODEL + ':generateContent';

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify({
      contents: [{ parts: [{ text: question }] }]
    }),
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  if (code !== 200) {
    throw new Error('Gemini 호출 실패 (' + code + '): ' + response.getContentText());
  }
  const data = JSON.parse(response.getContentText());
  return data.candidates[0].content.parts[0].text;
}

/** 실행해 보는 함수: 로그에 답이 찍힙니다. */
function testAskGemini() {
  Logger.log(askGemini('구글 시트가 하는 일을 초등학생도 알아듣게 두 문장으로 설명해 줘.'));
}

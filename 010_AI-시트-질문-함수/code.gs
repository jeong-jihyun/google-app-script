/**
 * 010. 시트에서 =AI() 함수 만들기
 * 시트 칸에 =AI("질문") 또는 =AI("요약해줘: "&A2) 처럼 써서 AI 답을 바로 받습니다.
 * 같은 질문은 캐시에 저장해 두어 다시 호출하지 않습니다(비용 절약).
 *
 * 준비: 스크립트 속성에 GEMINI_API_KEY 저장
 */

const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * AI에게 물어보고 답을 칸에 보여 줍니다.
 * @param {string} prompt 물어볼 내용
 * @return {string} AI의 답
 * @customfunction
 */
function AI(prompt) {
  if (!prompt) return '질문을 입력하세요';

  // 같은 질문이면 6시간 동안 저장된 답을 재사용
  const cache = CacheService.getScriptCache();
  const key = 'ai_' + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(prompt))
  );
  const cached = cache.get(key);
  if (cached) return cached;

  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify({ contents: [{ parts: [{ text: String(prompt) }] }] }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    return '오류: ' + res.getResponseCode();
  }
  const answer = JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
  cache.put(key, answer.substring(0, 90000), 21600); // 캐시 한 칸은 약 100KB까지
  return answer;
}

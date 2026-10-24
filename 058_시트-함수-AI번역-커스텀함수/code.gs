/**
 * 058. 시트에서 쓰는 AI 번역 함수
 * 사용법: =AI번역(A2, "영어")
 * @customfunction
 */
function AI번역(text, language) {
  if (!text) return '';
  const cache = CacheService.getScriptCache();
  const key = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, language + '|' + text));
  const hit = cache.get(key);
  if (hit) return hit;
  const result = askGemini_('다음 글을 ' + (language || '영어') + '로 번역해 줘. 번역한 글만 쓰고 설명은 붙이지 마.\n\n' + text).trim();
  cache.put(key, result.substring(0, 9000), 21600);   // 6시간 저장
  return result;
}

// ---- 공통 도우미 (Gemini) ----
function askGemini_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('스크립트 속성에 GEMINI_API_KEY 가 없습니다.');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Gemini 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
}

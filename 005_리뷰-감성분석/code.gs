/**
 * 005. 리뷰 감성분석
 * A열의 리뷰를 읽고 B열에 긍정/부정/중립, C열에 이유 한 줄을 적어 줍니다.
 * 한 번에 여러 건을 보내서 호출 횟수를 줄입니다.
 *
 * 준비: 스크립트 속성에 GEMINI_API_KEY 저장
 */

const GEMINI_MODEL = 'gemini-2.5-flash';
const BATCH_SIZE = 10;

function analyzeSentiment() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  // 아직 분석 안 된 행만 모읍니다.
  const todo = [];
  values.forEach(function (row, i) {
    if (row[0] && !row[1]) todo.push({ rowNo: i + 2, text: row[0] });
  });

  for (let start = 0; start < todo.length; start += BATCH_SIZE) {
    const batch = todo.slice(start, start + BATCH_SIZE);
    const list = batch.map(function (item, n) { return (n + 1) + '. ' + item.text; }).join('\n');

    const prompt = '아래 리뷰 각각의 감정을 분석해 줘. ' +
      '반드시 JSON 배열로만 답해. 형식: [{"번호":1,"감정":"긍정|부정|중립","이유":"한 줄"}]\n\n' + list;

    const results = JSON.parse(askGeminiJson_(prompt));
    results.forEach(function (r) {
      const item = batch[r['번호'] - 1];
      if (item) {
        sheet.getRange(item.rowNo, 2, 1, 2).setValues([[r['감정'], r['이유']]]);
      }
    });
  }
}

function askGeminiJson_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' } // JSON으로만 답하게 함
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Gemini 호출 실패: ' + res.getContentText());
  }
  return JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
}

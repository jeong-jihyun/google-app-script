/**
 * 007. AI 번역 시트
 * A열 한국어 문장을 읽고 B열 영어, C열 일본어로 번역해 줍니다.
 * 시트 메뉴 "AI 도구 → 번역 실행"으로 누를 수 있습니다.
 *
 * 준비: 스크립트 속성에 CLAUDE_API_KEY 저장
 */

const CLAUDE_MODEL = 'claude-sonnet-5-5';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('AI 도구')
    .addItem('번역 실행', 'translateRows')
    .addToUi();
}

function translateRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  values.forEach(function (row, i) {
    const ko = row[0];
    if (!ko || (row[1] && row[2])) return; // 비었거나 이미 번역됨

    const answer = askClaude_(
      '다음 한국어 문장을 영어와 일본어로 번역해. 반드시 JSON으로만 답해. ' +
      '형식: {"en":"영어","ja":"일본어"}\n\n' + ko
    );
    const json = JSON.parse(extractJson_(answer));
    sheet.getRange(i + 2, 2, 1, 2).setValues([[json.en, json.ja]]);
  });
}

// 답에 설명이 섞여 있어도 { } 부분만 꺼냅니다.
function extractJson_(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  return text.substring(start, end + 1);
}

function askClaude_(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Claude 호출 실패: ' + res.getContentText());
  }
  return JSON.parse(res.getContentText()).content[0].text;
}

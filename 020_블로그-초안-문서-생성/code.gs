/**
 * 020. 주제로 글 초안 구글 문서 만들기
 * 시트: A열 주제, B열 분위기, C열 문서 링크(자동 입력)
 */

function createDraftDocs() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const rows = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  rows.forEach(function (row, i) {
    const topic = String(row[0]).trim();
    const tone = String(row[1]).trim() || '친근하게';
    if (!topic || row[2]) return;

    const draft = askClaude_(
      '주제: ' + topic + '\n분위기: ' + tone + '\n위 조건으로 제목 1개와 본문 4문단짜리 한국어 글 초안을 써 줘. 첫 줄은 제목만 써.', 1200
    );
    const lines = draft.trim().split('\n');
    const doc = DocumentApp.create('[초안] ' + lines[0].replace(/[#*]/g, '').trim());
    doc.getBody().setText(lines.slice(1).join('\n').trim());
    doc.saveAndClose();
    sheet.getRange(i + 2, 3).setValue(doc.getUrl());
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

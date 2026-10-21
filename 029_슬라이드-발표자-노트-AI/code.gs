/**
 * 029. 슬라이드 발표자 노트 자동 작성
 */
function writeSpeakerNotes() {
  const slides = SlidesApp.getActivePresentation().getSlides();

  slides.forEach(function (slide, i) {
    const notesShape = slide.getNotesPage().getSpeakerNotesShape();
    if (notesShape.getText().asString().trim()) return;   // 이미 노트가 있으면 건너뜀

    const content = slide.getShapes()
      .map(function (s) { return s.getText().asString().trim(); })
      .filter(function (t) { return t; })
      .join('\n');
    if (!content) return;

    const script = askClaude_(
      '다음은 발표 슬라이드 ' + (i + 1) + '번 내용입니다. 청중에게 말하듯 3~4문장 발표 대본을 써 줘.\n\n' + content, 500
    );
    notesShape.getText().setText(script.trim());
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

// AI 답에서 JSON 부분만 꺼내 읽습니다.
function parseJson_(text) {
  const m = text.match(/[\[{][\s\S]*[\]}]/);
  if (!m) throw new Error('JSON 형태의 답이 아닙니다: ' + text);
  return JSON.parse(m[0]);
}

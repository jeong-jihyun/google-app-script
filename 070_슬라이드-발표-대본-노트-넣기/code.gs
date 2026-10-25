/** 070. 각 슬라이드 글 → 발표 대본 → 발표자 노트 */
function writeSpeakerNotes() {
  const slides = SlidesApp.getActivePresentation().getSlides();
  slides.forEach(function (slide, i) {
    const text = slide.getShapes().map(function (s) { return s.getText().asString(); }).join(' ').trim();
    if (!text) return;
    const script = askClaude_('아래는 발표 슬라이드 ' + (i + 1) + '번의 글이야. 30초 분량의 자연스러운 한국어 발표 대본을 써 줘.\n\n' + text);
    slide.getNotesPage().getSpeakerNotesShape().getText().setText(script.trim());
  });
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

/**
 * 044. 현재 문서 내용으로 새 슬라이드 초안 만들기 (Claude 사용)
 * 문서에 연결된(컨테이너 바운드) 스크립트로 쓰세요.
 */
function makeSlidesFromDoc() {
  const text = DocumentApp.getActiveDocument().getBody().getText().substring(0, 6000);
  const json = askClaude_('아래 글로 발표 슬라이드 5장을 만들어 줘. 반드시 JSON 배열만 답해. 예: [{"title":"제목","bullets":["내용1","내용2"]}]\n\n' + text);
  const slidesData = JSON.parse(json.substring(json.indexOf('['), json.lastIndexOf(']') + 1));

  const pres = SlidesApp.create('AI 슬라이드 초안 ' + new Date().toLocaleDateString('ko-KR'));
  slidesData.forEach(function (s, i) {
    const slide = i === 0 ? pres.getSlides()[0] : pres.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    const shapes = slide.getShapes();
    if (shapes[0]) shapes[0].getText().setText(s.title);
    if (shapes[1]) shapes[1].getText().setText(s.bullets.join('\n'));
  });
  DocumentApp.getUi().alert('슬라이드를 만들었어요:\n' + pres.getUrl());
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
    payload: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('Claude 호출 실패: ' + res.getContentText());
  return JSON.parse(res.getContentText()).content[0].text;
}

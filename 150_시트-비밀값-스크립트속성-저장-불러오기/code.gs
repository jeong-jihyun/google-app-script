/** 150. 스크립트 속성 저장·불러오기 */
// 1) 아래 값을 바꿔 한 번만 실행한 뒤, 실행이 끝나면 코드에서 값을 지우세요.
function saveSecret() {
  PropertiesService.getScriptProperties().setProperty('MY_SECRET', '여기에-비밀값');
}

// 2) 다른 코드에서는 이렇게 불러 씁니다.
function useSecret() {
  const secret = PropertiesService.getScriptProperties().getProperty('MY_SECRET');
  if (!secret) { Logger.log('저장된 값이 없습니다.'); return; }
  Logger.log('불러왔습니다. 길이: ' + secret.length); // 값 자체는 로그에 남기지 않습니다
}

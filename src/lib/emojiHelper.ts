/**
 * Automatically suggests a relevant emoji based on site name, URL, and category.
 */
export function suggestEmoji(name: string, url: string = '', category: string = ''): string {
  const text = `${name} ${url} ${category}`.toLowerCase();

  // Math
  if (text.includes('수학') || text.includes('math') || text.includes('계산') || text.includes('분수') || text.includes('구구단') || text.includes('도형')) {
    return '🔢';
  }

  // Science / Nature
  if (text.includes('과학') || text.includes('science') || text.includes('실험') || text.includes('우주') || text.includes('생물') || text.includes('날씨')) {
    return '🔬';
  }

  // Korean / Books / Reading
  if (text.includes('국어') || text.includes('글쓰기') || text.includes('독서') || text.includes('책') || text.includes('도서') || text.includes('맞춤법') || text.includes('온작품')) {
    return '📖';
  }

  // Social studies / Maps / History
  if (text.includes('사회') || text.includes('지도') || text.includes('map') || text.includes('earth') || text.includes('역사') || text.includes('지리') || text.includes('박물관')) {
    return '🗺️';
  }

  // Coding / Software / Computers
  if (text.includes('엔트리') || text.includes('entry') || text.includes('코딩') || text.includes('code') || text.includes('스크래치') || text.includes('프로그래밍') || text.includes('컴퓨터')) {
    return '💻';
  }

  // Video / YouTube / Media
  if (text.includes('유튜브') || text.includes('youtube') || text.includes('영상') || text.includes('video') || text.includes('영화') || text.includes('방송') || text.includes('ebs')) {
    return '▶️';
  }

  // Art / Drawing / Design
  if (text.includes('미술') || text.includes('그림') || text.includes('캔바') || text.includes('canva') || text.includes('패들렛') || text.includes('padlet') || text.includes('디자인') || text.includes('포토')) {
    return '🎨';
  }

  // Music
  if (text.includes('음악') || text.includes('music') || text.includes('노래') || text.includes('악기') || text.includes('피아노') || text.includes('리코더')) {
    return '🎵';
  }

  // Physical Education / Health / Sports
  if (text.includes('체육') || text.includes('운동') || text.includes('체조') || text.includes('스포츠') || text.includes('보건') || text.includes('줄넘기')) {
    return '⚽';
  }

  // English / Language
  if (text.includes('영어') || text.includes('english') || text.includes('파닉스') || text.includes('단어')) {
    return '🔤';
  }

  // Search / Portal / Google / Naver
  if (text.includes('구글') || text.includes('google') || text.includes('검색') || text.includes('search') || text.includes('네이버') || text.includes('naver') || text.includes('다음') || text.includes('daum')) {
    return '🔍';
  }

  // Quiz / Kahoot / Games
  if (text.includes('퀴즈') || text.includes('quiz') || text.includes('카훗') || text.includes('kahoot') || text.includes('게임') || text.includes('띵커벨')) {
    return '🎯';
  }

  // Digital Textbook / School Portal
  if (text.includes('교과서') || text.includes('학교') || text.includes('클래스팅') || text.includes('하이러닝') || text.includes('위두랑') || text.includes('e학습터')) {
    return '🏫';
  }

  // Today's Class / Important
  if (category === '오늘의 수업' || text.includes('오늘') || text.includes('알림')) {
    return '⭐';
  }

  // Default web globe
  return '🌐';
}

export const POPULAR_EMOJIS = [
  '⭐', '📖', '🔢', '🗺️', '🔬', '🎨', '🎵', '⚽', '💻', '🔤',
  '🏫', '🔍', '▶️', '🎯', '🌐', '📚', '🧩', '🧪', '🌱', '🚀',
  '📝', '💡', '🤖', '📸', '✨'
];

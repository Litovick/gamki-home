export type PotatoTypeId =
  | 'calm'
  | 'cheerful'
  | 'searching'
  | 'creative'
  | 'dependable';

export interface QuizChoice {
  readonly text: string;
  readonly type: PotatoTypeId;
}

export interface QuizQuestion {
  readonly id: number;
  readonly question: string;
  readonly choices: readonly QuizChoice[];
}

export interface PotatoResultProfile {
  readonly id: PotatoTypeId;
  readonly name: string;
  readonly imagePath: string;
  readonly oneLiner: string;
  readonly traits: readonly [string, string, string];
  readonly partnerId: PotatoTypeId;
  readonly partnerName: string;
  readonly badgeBg: string;
  readonly stageBg: string;
}

export type QuizRouteState =
  | { readonly view: 'home' }
  | { readonly view: 'quiz'; readonly resultType: PotatoTypeId | null };

export interface QuizScoreSummary {
  readonly winner: PotatoTypeId;
  readonly scores: Record<PotatoTypeId, number>;
}

export const POTATO_TYPE_ORDER: readonly PotatoTypeId[] = [
  'calm',
  'cheerful',
  'searching',
  'creative',
  'dependable',
] as const;

export const POINTS_PER_CHOICE = 2;

export const POTATO_RESULTS: Record<PotatoTypeId, PotatoResultProfile> = {
  calm: {
    id: 'calm',
    name: '차분한 감자',
    imagePath: '/calm%20potato.png',
    oneLiner: '신중하고 꼼꼼하게 생각한 뒤 움직이는 유형',
    traits: [
      '결정 전 조건과 디테일을 빠짐없이 체크함',
      '급한 상황에서도 중심을 잡아주는 팀의 브레이크',
      '나만의 페이스로 알짜 경험을 차곡차곡 쌓음',
    ],
    partnerId: 'cheerful',
    partnerName: '활발한 감자',
    badgeBg: '#E9F3DF',
    stageBg: '#F1F7EA',
  },
  cheerful: {
    id: 'cheerful',
    name: '활발한 감자',
    imagePath: '/cheerful%20potato.png',
    oneLiner: '에너지가 넘치고 사람들과 어울리는 걸 좋아하는 유형',
    traits: [
      '어색한 첫 조별과제 분위기를 5분 만에 녹임',
      '서포터즈·축제·대외활동 현장에서 에너지를 얻음',
      '사람들과 부딪히며 새로운 기회를 가장 먼저 발견함',
    ],
    partnerId: 'calm',
    partnerName: '차분한 감자',
    badgeBg: '#FFF2CC',
    stageBg: '#FFF9E6',
  },
  searching: {
    id: 'searching',
    name: '탐구하는 감자',
    imagePath: '/searching%20potato.png',
    oneLiner: '궁금한 걸 깊이 파고들고 새로운 지식을 찾는 유형',
    traits: [
      '관심 분야가 생기면 레퍼런스부터 끝까지 파고듦',
      '근거와 논리가 탄탄한 자료 조사 능력자',
      '숨겨진 공고나 알짜 정보를 남들보다 빠르게 찾아냄',
    ],
    partnerId: 'creative',
    partnerName: '창의적인 감자',
    badgeBg: '#E6F1F8',
    stageBg: '#F1F7FB',
  },
  creative: {
    id: 'creative',
    name: '창의적인 감자',
    imagePath: '/creative%20potato.png',
    oneLiner: '남다른 아이디어와 표현으로 새로운 걸 만드는 유형',
    traits: [
      '뻔한 과제 주제도 색다른 컨셉으로 뒤집어 버림',
      '발표 자료나 결과물에 자기만의 감각을 담아냄',
      '"없으면 만들지 뭐!" 실행력으로 새 프로젝트를 엶',
    ],
    partnerId: 'dependable',
    partnerName: '든든한 감자',
    badgeBg: '#F1EBFF',
    stageBg: '#F7F3FF',
  },
  dependable: {
    id: 'dependable',
    name: '든든한 감자',
    imagePath: '/dependable%20potato.png',
    oneLiner: '책임감 있고 꾸준하게 맡은 일을 해내는 유형',
    traits: [
      '마감일과 체크리스트는 절대 놓치지 않는 일정 마스터',
      '맡은 일은 끝까지 마무리해 팀원들의 신뢰 1순위',
      '학년별 할 일을 하나씩 채워 이력서를 완성하는 성실파',
    ],
    partnerId: 'creative',
    partnerName: '창의적인 감자',
    badgeBg: '#F8ECD8',
    stageBg: '#FDF6EA',
  },
};

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 1,
    question: '새 학기 첫 조별과제 단톡방, 내가 가장 먼저 하는 행동은?',
    choices: [
      {
        text: '모두의 의견을 다 들어본 뒤 빠진 부분만 조용히 짚어준다',
        type: 'calm',
      },
      {
        text: '"안녕하세요!! 오늘 점심 같이 드실 분?" 분위기부터 띄운다',
        type: 'cheerful',
      },
      {
        text: '주제와 관련된 자료·레퍼런스 링크를 먼저 찾아 모아둔다',
        type: 'searching',
      },
      {
        text: '남들 다 하는 뻔한 PPT 말고 색다른 발표 컨셉을 던져본다',
        type: 'creative',
      },
      {
        text: '회의 일정표랑 역할 분담 체크리스트부터 정리해 올린다',
        type: 'dependable',
      },
    ],
  },
  {
    id: 2,
    question: '수업 사이 공강이 3시간이나 생겼다! 나의 선택은?',
    choices: [
      {
        text: '조용한 카페 구석에서 따뜻한 차 마시며 밀린 생각을 정리한다',
        type: 'calm',
      },
      {
        text: '공강 겹치는 친구들한테 바로 연락해서 같이 밥 먹고 수다 떤다',
        type: 'cheerful',
      },
      {
        text: '도서관이나 유튜브에서 요즘 꽂힌 분야를 끝까지 파고든다',
        type: 'searching',
      },
      {
        text: '문득 떠오른 아이디어를 메모장이나 노트에 끄적이며 구상한다',
        type: 'creative',
      },
      {
        text: '이번 주 할 일 목록을 꺼내서 과제 하나를 미리 끝내버린다',
        type: 'dependable',
      },
    ],
  },
  {
    id: 3,
    question: '"춘천에는 할 게 없다"는 친구의 말에 내 속마음은?',
    choices: [
      {
        text: "'일단 내가 뭘 하고 싶은지부터 차근차근 정리해 봐야겠는데'",
        type: 'calm',
      },
      {
        text: "'에이, 동아리나 축제 서포터즈 같이 해보면 재밌을 텐데!'",
        type: 'cheerful',
      },
      {
        text: "'진짜 없나? 온라인이랑 지역 공고부터 싹 다 검색해 봐야지'",
        type: 'searching',
      },
      {
        text: "'없으면 우리가 재밌는 프로젝트 하나 만들어 버리면 되지!'",
        type: 'creative',
      },
      {
        text: "'지금 학년에 꼭 해야 할 것부터 하나씩 챙겨 두는 게 먼저야'",
        type: 'dependable',
      },
    ],
  },
  {
    id: 4,
    question: '마음에 드는 공모전 공고를 발견했을 때 나는?',
    choices: [
      {
        text: '자격 요건, 심사 기준, 마감일까지 꼼꼼히 읽고 지원 여부를 결정한다',
        type: 'calm',
      },
      {
        text: '같이 나갈 팀원부터 신나게 모집해서 브레인스토밍을 시작한다',
        type: 'cheerful',
      },
      {
        text: '역대 수상작들을 전부 찾아보며 어떤 포인트가 먹히는지 분석한다',
        type: 'searching',
      },
      {
        text: '공고 주제를 보자마자 머릿속에 떠오르는 독특한 기획안부터 적는다',
        type: 'creative',
      },
      {
        text: '마감일까지 역산해서 주차별 작업 스케줄표부터 짠다',
        type: 'dependable',
      },
    ],
  },
  {
    id: 5,
    question: '발표 하루 전, 갑자기 기획 일부를 수정해야 한다면?',
    choices: [
      {
        text: '당황하지 않고 침착하게 어디부터 고쳐야 안전할지 우선순위를 정한다',
        type: 'calm',
      },
      {
        text: '"우리 할 수 있어!" 지친 팀원들 텐션을 끌어올리며 함께 해결한다',
        type: 'cheerful',
      },
      {
        text: '왜 문제가 생겼는지 원인을 정확히 파악해서 논리적인 대안을 찾는다',
        type: 'searching',
      },
      {
        text: '위기를 기회로 삼아 아예 더 임팩트 있는 반전 아이디어를 낸다',
        type: 'creative',
      },
      {
        text: '밤을 새우더라도 맡은 파트는 완성도 있게 끝까지 책임지고 마감한다',
        type: 'dependable',
      },
    ],
  },
  {
    id: 6,
    question: '축제 부스나 학과 행사를 준비할 때 맡고 싶은 역할은?',
    choices: [
      {
        text: '전체 동선과 안전, 예산 등을 꼼꼼하게 점검하는 운영 매니저',
        type: 'calm',
      },
      {
        text: '부스 앞에서 지나가는 사람들 시선을 끄는 홍보·MC 담당',
        type: 'cheerful',
      },
      {
        text: '사람들이 뭘 좋아하는지 사전 설문과 트렌드를 조사하는 리서처',
        type: 'searching',
      },
      {
        text: '포스터, 굿즈, 부스 컨셉을 톡톡 튀게 꾸미는 아트·기획 디렉터',
        type: 'creative',
      },
      {
        text: '물품 발주부터 당일 타임테이블까지 빈틈없이 챙기는 총괄 팀장',
        type: 'dependable',
      },
    ],
  },
  {
    id: 7,
    question: '나만의 스펙과 이력서를 채워가는 스타일은?',
    choices: [
      {
        text: '남들 속도 신경 쓰지 않고 내 페이스로 신중하게 알짜배기만 고른다',
        type: 'calm',
      },
      {
        text: '다양한 대외활동과 네트워킹으로 사람들과 부딪히며 경험을 쌓는다',
        type: 'cheerful',
      },
      {
        text: '관심 직무와 전공 지식을 깊이 파서 전문성 있는 기록을 남긴다',
        type: 'searching',
      },
      {
        text: '나만의 색깔이 드러나는 포트폴리오와 독창적인 결과물로 승부한다',
        type: 'creative',
      },
      {
        text: '1학년부터 4학년까지 학년별 할 일을 빠짐없이 성실하게 쌓아간다',
        type: 'dependable',
      },
    ],
  },
  {
    id: 8,
    question: '졸업할 때 내 감자가 어떤 모습이었으면 좋겠어?',
    choices: [
      {
        text: '흔들리지 않는 단단한 내면을 가진 여유로운 감자',
        type: 'calm',
      },
      {
        text: '어디서든 사랑받고 좋은 인연이 가득한 인싸 감자',
        type: 'cheerful',
      },
      {
        text: '자기 분야에 대해서라면 누구보다 잘 아는 박학다식 감자',
        type: 'searching',
      },
      {
        text: '세상에 없던 나만의 무기를 만들어낸 반짝이는 감자',
        type: 'creative',
      },
      {
        text: '어떤 자리든 믿고 맡길 수 있는 프로페셔널한 감자',
        type: 'dependable',
      },
    ],
  },
];

export function isPotatoTypeId(value: string | null | undefined): value is PotatoTypeId {
  if (!value) return false;
  return (POTATO_TYPE_ORDER as readonly string[]).includes(value);
}

/**
 * 각 선택지에 +2점을 부여하고 최다 득점 유형을 반환합니다.
 * 동점일 경우 가장 마지막으로 선택한 동점 유형을 우선 선택합니다.
 */
export function calculateQuizResult(
  answers: readonly (PotatoTypeId | null | undefined)[]
): QuizScoreSummary {
  const scores: Record<PotatoTypeId, number> = {
    calm: 0,
    cheerful: 0,
    searching: 0,
    creative: 0,
    dependable: 0,
  };

  const lastPickedIndex: Record<PotatoTypeId, number> = {
    calm: -1,
    cheerful: -1,
    searching: -1,
    creative: -1,
    dependable: -1,
  };

  answers.forEach((answer, index) => {
    if (answer && isPotatoTypeId(answer)) {
      scores[answer] += POINTS_PER_CHOICE;
      lastPickedIndex[answer] = index;
    }
  });

  let winner: PotatoTypeId = POTATO_TYPE_ORDER[0];
  let maxScore = -1;
  let winnerLastIndex = -1;

  for (const type of POTATO_TYPE_ORDER) {
    const score = scores[type];
    const pickedIdx = lastPickedIndex[type];
    if (
      score > maxScore ||
      (score === maxScore && pickedIdx > winnerLastIndex)
    ) {
      maxScore = score;
      winnerLastIndex = pickedIdx;
      winner = type;
    }
  }

  return { winner, scores };
}

/**
 * 해시(`#quiz`, `#quiz/result=calm`) 또는 쿼리(`?view=quiz&result=calm`)에서 현재 화면 상태를 파싱합니다.
 */
export function parseQuizRoute(hash: string, search = ''): QuizRouteState {
  const normalizedHash = hash.trim().replace(/^#/, '');

  if (normalizedHash === 'quiz' || normalizedHash === 'quiz/') {
    return { view: 'quiz', resultType: null };
  }

  if (normalizedHash.startsWith('quiz/')) {
    const rest = normalizedHash.slice('quiz/'.length);
    const match = rest.match(/^result=([a-z]+)$/i);
    if (match) {
      const candidate = match[1].toLowerCase();
      return {
        view: 'quiz',
        resultType: isPotatoTypeId(candidate) ? candidate : null,
      };
    }
    return { view: 'quiz', resultType: null };
  }

  if (search) {
    const params = new URLSearchParams(search);
    if (params.get('view') === 'quiz') {
      const candidate = params.get('result')?.toLowerCase() ?? null;
      return {
        view: 'quiz',
        resultType: isPotatoTypeId(candidate) ? candidate : null,
      };
    }
  }

  return { view: 'home' };
}

export function buildQuizHash(resultType?: PotatoTypeId | null): string {
  if (resultType && isPotatoTypeId(resultType)) {
    return `#quiz/result=${resultType}`;
  }
  return '#quiz';
}

export function buildShareableResultUrl(
  origin: string,
  pathname: string,
  resultType: PotatoTypeId
): string {
  const cleanOrigin = origin.replace(/\/$/, '');
  const cleanPath = pathname || '/';
  return `${cleanOrigin}${cleanPath}${buildQuizHash(resultType)}`;
}

export function getQuizProgressPercent(
  questionIndex: number,
  totalQuestions = QUIZ_QUESTIONS.length
): number {
  if (totalQuestions <= 1) return 100;
  const clamped = Math.max(0, Math.min(questionIndex, totalQuestions - 1));
  return Math.round(((clamped + 1) / totalQuestions) * 100);
}

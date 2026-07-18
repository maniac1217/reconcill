import { Product, DepositOrder } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: '프리미엄 무선 헤드폰',
    category: 'electronics',
    description: '하이리드 액티브 노이즈 캔슬링, 40시간 재생 시간, 그리고 공간 오디오를 지원하는 고품격 무선 헤드폰입니다. 고급 인조 가죽 패드와 인체공학적 설계로 하루 종일 착용해도 편안합니다.',
    price: 349000,
    stock: 25,
    discount: 20,
    shipping: 'free',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfmHIwaFP0utBqp5wCnjiEYrOQo1cWENiL8SmqBhFWVu0HRUCqFaHNB1DmLELf4I14gnUIUuLhLGQjP4HcT4uAWry1F6c6jmEkTiVyk7YVNkKW2vN5akkirLhG38bFqnpSyfj-cpbWF-pwB0ZDBEh8JPZqCbpmJ5ZZ0muOgsYWSErk3KLAbXr0Jyd8LvDRnL_JUSV6NtrCZVZe2v0ZK_6T7oewMM8stglunxMpFMhhtXwkASCeNF-n',
    additionalImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCC6Uuu5C-E1mBcUDapMTPOywT4dVUwnoMY67EXQKz6p4Wx7jjZCSFnZIDJ3J1jSkgdnkTyw5oQHEubVUfQmFnw_9djlsnYwG7kdi7wC_Y7RcmYyqEumTr8LV1RzGnp51YOpCmA0BiKPCH-xu3MU38tgLcT_rtlQyIWbaAX6AB5Qscr50tSOGmtpUuVpRZYsia1LuTSboUfMkHnKfUvLlwV4pOiv6K-7wCK_ZyNrUtjppRMXsucns0D',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDd_9E2H7l7ik9MWdJY9ilbPoXSrvMqSLnrserotZe0a5-d26pGFE-b8CCXM1eTwhGCrkYhWdpiQGF9LdYu4sZpVwARueaVecVnQcyjUpDsHGSIepIk1W8vpndGZVdmw9ejbm6RYsSfthPI0Q4dfa9lIIvA56l7QylLYwWwtv7f3a9uKXCiMwoasDTqrx1_2NPeUIgkh7wZ77UOVdZhSbvreWw-oSp1lqL-L6hu9ks7YuAymGhkFQw8'
    ],
    isNew: true
  },
  {
    id: 'prod-2',
    name: '핸드메이드 세라믹 화병',
    category: 'home',
    description: '자연스러운 질감과 불규칙하고 유려한 실루엣이 매력적인 오가닉 핸드메이드 화병입니다. 차분한 베이지 톤과 매트한 마감 처리가 어느 공간에나 잘 녹아듭니다.',
    price: 82000,
    stock: 12,
    shipping: 'free',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcE-1gV1DsDaSLLcQgmNX9UACmV9Y1pWaoatN0MpDRduo8ia89WMFGawHBgcNOEaY_EW5DhWihfSvX3GZJzn0sETtSy8d5IpxRnnkel2iCRzEuJ-DuxCt2R-P1jNyYtSNF4DZLBW1jqZZjl_TrS5zoig1Nu2jt9TTKIGlR2DiV5QmWvmHiZJ5pI-khuoJ4ouxRMPyGGbRxvIwSqk957eR3wdD6FMjNpETFodL5tBNm677X0RqDOj2Q',
    isNew: false
  },
  {
    id: 'prod-3',
    name: '프리미엄 레더 월렛',
    category: 'fashion',
    description: '최상급 천연 소가죽을 사용하여 슬림하면서도 실용적으로 설계된 지갑입니다. 카드 슬롯과 현금 포켓이 고루 갖춰져 있으며 대리석 질감의 패키지로 선물용으로도 좋습니다.',
    price: 89000,
    stock: 45,
    shipping: 'fixed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2pRMThCG7VX2O92IS1lgWnOMTlLCgBLzrDKqz6ejMiroTgaujd3XZjh0PMkHgr5mfqkI1xSRk5VTN57GkLTVTELmyY7fFAuANr5nDzV-vs-Phz3FlW-9dH4bM2ynG4d5hDD_I74lJuvNcGAEuUsbnYLP5SRV4ttTR_D-ZCpD9xpSBFUiEDmuiUaFxng3cgIcIGA6-8IU0buAGa7yVWvt15WcQ1y3yzdtnksHiapuXgsFLaiRmcXbH',
    isNew: true
  },
  {
    id: 'prod-4',
    name: '시그니처 머그컵',
    category: 'home',
    description: '따뜻한 모닝 커피나 차를 즐기기에 안성맞춤인 미니멀 세라믹 머그컵입니다. 원목 소재의 핸들이 편안한 그립감을 주며 톤다운된 깊은 인디고 색상이 지적인 데스크 환경을 조성해 줍니다.',
    price: 24000,
    stock: 80,
    shipping: 'fixed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQqgQ8Ed3rjk6HVkgDdTsk0P3HRtpWViiCHoVyNPuofSrJcoo-bFrNi1_Uhg48AdyruM3kB_gZKUJG0vNSRaTiFcMOO6QReOOjAB6L-kLGC-ZQgjPAdwMHe8hsy1wXKYZ8q8nOq9rnLhvXkfxqPplf0-NMg_exDc1Dj-pKRix81vEPair3L3591Ubd-_3-8bL1Hn-mY6lHpd0NusxiKWZ-yFQ2MaeXGY8jKofjGQTvFbxC7yJsVCi1',
    isNew: false
  },
  {
    id: 'prod-5',
    name: '아티스트 만년필',
    category: 'fashion',
    description: '부드러운 필기감과 고급스러운 메탈릭 마감이 돋보이는 프리미엄 만년필입니다. 비즈니스 미팅, 아이디어 스케치, 서명 등 다양한 기업 현대 라이프스타일에 격조 높은 포인트가 될 것입니다.',
    price: 145000,
    stock: 15,
    shipping: 'free',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQZb8O0lr5W96aWy-wEawoGRfGdOR7qeo3g4ZegwznEEIHqHgXiDzx0JQNgIiHIr1NpyY9aCFQeTLwgiNqRpBeZ5vVxlaJIh-VkT4Gb6FoTmVvwGgFZBF07GV5MgioBgAI0KlEWoo4aNIFPuQnYvseqNQX8k1-CWpV3aWJ3fOVwy-uM8x_aPOlbpKYBOR8IUIE86WBNoJrfAEeTo5gDV3DQ9Vx0PXXN5GB8UzBsFhu_v0_duPJp3sv',
    isNew: false
  },
  {
    id: 'prod-6',
    name: 'Obsidian Vessel (블랙 에디션 화병)',
    category: 'home',
    description: '매트하고 중후한 블랙 세라믹으로 제작되어 공간에 입체감과 격조를 부여해 주는 프리미엄 오브제 화병입니다. 드라이플라워나 한 가지 가지를 꽂아두면 동양적 여백의 미를 느낄 수 있습니다.',
    price: 120000,
    stock: 8,
    discount: 20,
    shipping: 'free',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwMNdUCeSAktJsDv-8PIznNbHtyPsrkiPd3k37uRDUztuObXSkJuhgOMTUUkWG8qK9YjX73msMNpeLJpEasnwUfStNew9mf1XGOcT372E1P0z3Oy1GujSx0ZQW5Gi6QxxCwl0ao5kuSRU3TU3dXnp8rOqseVY5GYgnYa94SKU2npfTbcLmmbsNzCV5biCs497_Vrnbz5FLuOwJ6rjkiPRz6wwkvudQjR8bv-KV1niksLScTx6_Tt9a',
    isNew: true
  },
  {
    id: 'prod-7',
    name: 'Titan Chrono 기계식 손목시계',
    category: 'electronics',
    description: '브러시 처리된 견고한 티타늄 프레임과 매력적인 인디고 색상 레더 스트랩이 적용된 정통 기계식 오토매틱 손목시계입니다. 현대적인 무드와 무한한 깊이를 느껴보세요.',
    price: 340000,
    stock: 5,
    discount: 19,
    shipping: 'free',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjVLlZYKqk61UQXdTOiFTAzpke7z668PsuZe5-wZerxLV8mr-N45agsW3mG8CbTVCvoVe7tDpeVvBXc8WZJdKYewLekkNXjK05ds_apPOfNgkefbT3Eim8ZXiMfXJe8XYszgZBKuD5jRJTiqwbyfisAzYl-POqN9GVagIFKA-kpE7LsVbPAeXNtw_WBoEkSDXvxBiWT28W2iKb98YdxANWTG8jqKsi7spR1Imp04sDaQjQ0rYK1F17',
    isNew: false
  },
  {
    id: 'prod-8',
    name: 'Ember 기하학 데스크 램프',
    category: 'home',
    description: '유리와 고광택 구리로 절묘하게 용접된 기하학적 형태의 데스크 조명입니다. 은은하고 따뜻한 앰버 톤 광채가 아늑하면서도 지적인 실내 분위기를 완성합니다.',
    price: 85000,
    stock: 18,
    discount: 22,
    shipping: 'fixed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrkTAh7IGy5tjuHRl74E4e6mQt87bmxniPhUXZkOqSy0XayhhA2CjH2YCoYtMJvAuBOO34HvF23HgDUT97VZqJn1YI9MbQqKgnkkjLp4hol1AyxEAlWYTDWv2ni9WzIUL2SnXdI4F6GuwvNUB6SIWllQC81gpufup3ESsVoztEPm4DGCLnYr9OBC1y0UWGukjiGRV4jKcInkqmsw7pPWrtETihBGzCoiGFq9PWKD6xzsJ4eZ1aWhyz',
    isNew: false
  },
  {
    id: 'prod-9',
    name: '심플 가죽 노트북 파우치 14인치',
    category: 'fashion',
    description: '차콜 그레이 색상의 고급 합성 가죽으로 마감되어 슬림한 핏과 견고함을 함께 선사하는 노트북 파우치입니다. 내부 안감이 소프트하여 기기를 흠집으로부터 보호합니다.',
    price: 59000,
    stock: 30,
    shipping: 'fixed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf5y5UIjeXr5XXNuHKagWtkWyxPyGGCKs-r5qwzH1KdlSrVE5vnsjSKyFuwWQF-HcfzVMqRjXsqzZm6J7gGw91I5JPxpb5ft4yLZzDPOyCMaJnJX7XocZe3OQ5JEMruYZamlP90kiAXDwzWBIpna41v_h0QjFxRQlvGqiiqj61aONmXEEQF_ucks4kW9slcWX2UYZ9tQEUAjkz_mQ1oWI-9uVp4A2jmkORWfNfGvwL8OsxCDhHFJV8',
    isNew: false
  },
  {
    id: 'prod-10',
    name: '피트니스 스마트 워치 (Indigo)',
    category: 'electronics',
    description: '심박수, 수면 패턴, 칼로리 버닝과 걸음수 추적 등 강력한 액티비티 트래킹을 지원하는 스마트 워치입니다. 깊이 있는 인디고 실리콘 밴드가 고급스러운 아웃도어 스타일을 더해 줍니다.',
    price: 199000,
    stock: 22,
    shipping: 'free',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4gt3j5oun6P5kWZFi5NYNFr4xhHb5F8Sti33UvG9rhDAhPvWXVBTwJQrGf5GDdcQb7Jq3Za5D9afEQlA_rd5WPKeSCokFGdaVddT-z39pKR3TmVKo99SL_Jzp62foYsYsEfO00oib7GtnvfjPxs8611cMm5CKrxYUlD3qoQWyS8RUqf0vZGuxCReL2DIYmz4RrC_atiniBWnXtJf-qcI1sW4pYXNuXwWAhTw3xy8JCkc9EacYO6Sj',
    isNew: false
  }
];

export const INITIAL_ORDERS: DepositOrder[] = [
  {
    id: 'ORD-98234',
    date: '2023.11.24 (금)',
    depositorName: '김지수',
    amount: 245000,
    bankName: '신한은행',
    status: 'PENDING',
    time: '14:15',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedColor: 'Black'
      }
    ],
    shippingAddress: {
      receiver: '김지수',
      phone: '010-9876-5432',
      address: '인천광역시 부평구 부평대로 42, 105동 402호'
    }
  },
  {
    id: 'ORD-98231',
    date: '2023.11.23 (목)',
    depositorName: '이영희',
    amount: 1020000,
    bankName: '국민은행',
    status: 'PAID',
    time: '13:58',
    items: [
      {
        product: INITIAL_PRODUCTS[6], // watch
        quantity: 3
      }
    ],
    shippingAddress: {
      receiver: '이영희',
      phone: '010-5555-1234',
      address: '부산광역시 해운대구 마린시티3로 51, 802호'
    }
  },
  {
    id: 'ORD-98229',
    date: '2023.11.22 (수)',
    depositorName: '박민재',
    amount: 89900,
    bankName: '카카오뱅크',
    status: 'PREPARING',
    time: '12:44',
    items: [
      {
        product: INITIAL_PRODUCTS[2], // wallet
        quantity: 1
      }
    ],
    shippingAddress: {
      receiver: '홍길동',
      phone: '010-1234-5678',
      address: '서울특별시 강남구 테헤란로 123 (역삼동) INDIGO 타워 18층'
    },
    trackingNumber: '4029-1834-9210'
  },
  {
    id: 'ORD-98205',
    date: '2023.11.21 (화)',
    depositorName: '최현우',
    amount: 45000,
    bankName: '우리은행',
    status: 'PENDING', // 보류 중
    time: '09:30',
    items: [
      {
        product: INITIAL_PRODUCTS[3], // mug cup
        quantity: 2
      }
    ],
    shippingAddress: {
      receiver: '최현우',
      phone: '010-4444-8888',
      address: '경기도 수원시 영통구 광교로 156'
    }
  }
];

export interface Room {
  id: string;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  capacity: number;
  price: number;
  features: { zh: string[]; en: string[] };
  image: string;
}

export interface WholeHouse {
  id: 'whole-house';
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  capacity: number;
  price: number;
  features: { zh: string[]; en: string[] };
}

export const wholeHouse: WholeHouse = {
  id: 'whole-house',
  name: { zh: '包棟模式', en: 'Whole House Rental' },
  description: {
    zh: '獨享整棟民宿，6 間客房全部包下，適合家族旅遊、朋友聚會或小型企業包場。包含所有公共空間、庭園與廚房使用權，享受完全私密的度假體驗。',
    en: 'Exclusive use of the entire B&B with all 6 rooms. Perfect for family gatherings, group trips, or corporate retreats. Includes all common areas, garden, and kitchen access.',
  },
  capacity: 18,
  price: 16800,
  features: {
    zh: ['全棟 6 間客房', '可容納 18 人', '獨享公共空間', '庭園與廚房使用', '專屬停車場', '客製化早餐'],
    en: ['All 6 rooms', 'Up to 18 guests', 'Exclusive common areas', 'Garden & kitchen access', 'Private parking', 'Custom breakfast'],
  },
};

export const rooms: Room[] = [
  {
    id: 'loft-suite',
    name: { zh: '閣樓套房', en: 'Loft Suite' },
    description: {
      zh: '挑高閣樓設計，獨立衛浴，大面積窗景俯瞰安農溪，享受私密靜謐的空間。',
      en: 'High-ceiling loft with private bathroom, panoramic windows overlooking Annong River.',
    },
    capacity: 2, price: 3800,
    features: {
      zh: ['挑高閣樓', '獨立衛浴', '溪景窗景', '冷暖空調', 'Wi-Fi'],
      en: ['Loft ceiling', 'Private bathroom', 'River view', 'A/C & heating', 'Wi-Fi'],
    },
    image: '/images/loft-suite.jpg',
  },
  {
    id: 'loft-standard',
    name: { zh: '閣樓雅房', en: 'Loft Standard' },
    description: {
      zh: '溫馨閣樓空間，共用衛浴，適合獨旅或背包客，感受最純粹的民宿體驗。',
      en: 'Cozy loft room with shared bathroom, perfect for solo travelers.',
    },
    capacity: 2, price: 2200,
    features: {
      zh: ['閣樓空間', '共用衛浴', '木質地板', '冷暖空調', 'Wi-Fi'],
      en: ['Loft space', 'Shared bathroom', 'Wooden floor', 'A/C & heating', 'Wi-Fi'],
    },
    image: '/images/loft-standard.jpg',
  },
  {
    id: 'tatami',
    name: { zh: '和室房', en: 'Tatami Room' },
    description: {
      zh: '日式榻榻米設計，適合家庭或朋友同行，席地而坐感受最道地的和風氛圍。',
      en: 'Japanese tatami design, ideal for families or friends.',
    },
    capacity: 4, price: 3200,
    features: {
      zh: ['榻榻米', '日式拉門', '庭園景觀', '獨立衛浴', 'Wi-Fi'],
      en: ['Tatami mats', 'Sliding doors', 'Garden view', 'Private bathroom', 'Wi-Fi'],
    },
    image: '/images/tatami.jpg',
  },
  {
    id: 'quad-suite-a',
    name: { zh: '4人套房 A', en: 'Quad Suite A' },
    description: {
      zh: '寬敞四人空間，兩張雙人床，獨立衛浴，適合家庭旅遊或好友出遊。',
      en: 'Spacious quad room with two double beds and private bathroom.',
    },
    capacity: 4, price: 3600,
    features: {
      zh: ['兩張雙人床', '獨立衛浴', '田園景觀', '冷暖空調', 'Wi-Fi'],
      en: ['2 double beds', 'Private bathroom', 'Countryside view', 'A/C & heating', 'Wi-Fi'],
    },
    image: '/images/quad-a.jpg',
  },
  {
    id: 'quad-suite-b',
    name: { zh: '4人套房 B', en: 'Quad Suite B' },
    description: {
      zh: '明亮舒適的四人房，獨立衛浴，窗外即是綠意盎然的冬山田園風光。',
      en: 'Bright quad room with private bathroom, green countryside views.',
    },
    capacity: 4, price: 3600,
    features: {
      zh: ['兩張雙人床', '獨立衛浴', '綠景窗戶', '冷暖空調', 'Wi-Fi'],
      en: ['2 double beds', 'Private bathroom', 'Green views', 'A/C & heating', 'Wi-Fi'],
    },
    image: '/images/quad-b.jpg',
  },
  {
    id: 'double-suite',
    name: { zh: '2人套房', en: 'Double Suite' },
    description: {
      zh: '精緻雙人空間，一張加大雙人床，獨立衛浴，最適合情侶或夫妻的浪漫選擇。',
      en: 'Refined double room with queen bed and private bathroom, perfect for couples.',
    },
    capacity: 2, price: 2800,
    features: {
      zh: ['加大雙人床', '獨立衛浴', '溪畔景觀', '冷暖空調', 'Wi-Fi'],
      en: ['Queen bed', 'Private bathroom', 'Riverside view', 'A/C & heating', 'Wi-Fi'],
    },
    image: '/images/double-suite.jpg',
  },
];

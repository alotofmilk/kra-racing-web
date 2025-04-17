import { NextApiRequest, NextApiResponse } from 'next';

// 임시 데이터 - 실제로는 외부 API에서 가져올 예정
const races = [
  {
    id: 1,
    time: '14:00',
    horses: [
      { number: 1, name: '번개', odds: 2.5 },
      { number: 2, name: '천둥', odds: 3.0 },
      { number: 3, name: '별', odds: 4.0 },
    ]
  },
  {
    id: 2,
    time: '15:00',
    horses: [
      { number: 1, name: '태양', odds: 2.0 },
      { number: 2, name: '달', odds: 3.5 },
      { number: 3, name: '별', odds: 4.5 },
    ]
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(races);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 
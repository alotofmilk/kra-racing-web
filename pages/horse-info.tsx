import { useState } from 'react';

interface Horse {
  id: number;
  name: string;
  age: number;
  gender: string;
  trainer: string;
  jockey: string;
  wins: number;
  image: string;
}

export default function HorseInfo() {
  const [horses] = useState<Horse[]>([
    {
      id: 1,
      name: "Thunder Bolt",
      age: 4,
      gender: "수컷",
      trainer: "김훈련사",
      jockey: "박기수",
      wins: 12,
      image: "/horses/horse1.jpg"
    },
    {
      id: 2,
      name: "Silver Star",
      age: 3,
      gender: "암컷",
      trainer: "이훈련사",
      jockey: "최기수",
      wins: 8,
      image: "/horses/horse2.jpg"
    },
    {
      id: 3,
      name: "Golden Dream",
      age: 5,
      gender: "수컷",
      trainer: "박훈련사",
      jockey: "김기수",
      wins: 15,
      image: "/horses/horse3.jpg"
    },
    {
      id: 4,
      name: "Blue Ocean",
      age: 4,
      gender: "암컷",
      trainer: "최훈련사",
      jockey: "이기수",
      wins: 10,
      image: "/horses/horse4.jpg"
    },
    {
      id: 5,
      name: "Red Fire",
      age: 3,
      gender: "수컷",
      trainer: "김훈련사",
      jockey: "박기수",
      wins: 7,
      image: "/horses/horse5.jpg"
    },
    {
      id: 6,
      name: "White Cloud",
      age: 4,
      gender: "암컷",
      trainer: "이훈련사",
      jockey: "최기수",
      wins: 9,
      image: "/horses/horse6.jpg"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center mb-16 text-black" style={{ fontFamily: 'SDKukdetopokki, serif' }}>
             
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {horses.map((horse) => (
            <div key={horse.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-56">
                <img
                  src="/images/horse.jpeg"
                  alt={horse.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-2xl font-bold text-white">{horse.name}</h2>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">나이</p>
                    <p className="font-medium">{horse.age}세</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">성별</p>
                    <p className="font-medium">{horse.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">훈련사</p>
                    <p className="font-medium">{horse.trainer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">기수</p>
                    <p className="font-medium">{horse.jockey}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">우승 횟수</p>
                    <p className="font-medium">{horse.wins}회</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
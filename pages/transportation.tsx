import { useState } from 'react';

interface Transportation {
  id: number;
  type: string;
  name: string;
  description: string;
  distance: string;
}

export default function Transportation() {
  const [transportations] = useState<Transportation[]>([
    {
      id: 1,
      type: "지하철",
      name: "서울경마공원역",
      description: "서울 지하철 4호선",
      distance: "도보 5분"
    },
    {
      id: 2,
      type: "지하철",
      name: "대공원역",
      description: "서울 지하철 4호선",
      distance: "도보 10분"
    },
    {
      id: 3,
      type: "버스",
      name: "서울경마공원 정문",
      description: "간선: 341, 3411, 3412, 3413, 3414\n지선: 3417, 4432, 4433",
      distance: "도보 1분"
    },
    {
      id: 4,
      type: "버스",
      name: "서울경마공원 후문",
      description: "간선: 341, 3411, 3412, 3413, 3414\n지선: 3417, 4432, 4433",
      distance: "도보 3분"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-16 text-black" style={{ fontFamily: 'SDKukdetopokki, serif' }}>
             
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {transportations.map((transport) => (
            <div key={transport.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-primary">{transport.name}</h2>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {transport.type}
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">설명</p>
                    <p className="font-medium whitespace-pre-line">{transport.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">거리</p>
                    <p className="font-medium">{transport.distance}</p>
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
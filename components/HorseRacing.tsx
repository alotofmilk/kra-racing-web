import { useState } from 'react';

interface Race {
  id: string;
  raceNumber: number;
  raceName: string;
  startTime: string;
  status: string;
  horses: {
    number: number;
    name: string;
    odds: number;
  }[];
}

const HorseRacing = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  // 목업 데이터
  useState(() => {
    const mockRaces: Race[] = [
      {
        id: '1',
        raceNumber: 1,
        raceName: '서울경마장 1R',
        startTime: '2024-03-17 13:00',
        status: 'upcoming',
        horses: [
          { number: 1, name: '번개', odds: 3.5 },
          { number: 2, name: '질주', odds: 2.8 },
          { number: 3, name: '쾌속', odds: 2.5 },
          { number: 4, name: '천둥', odds: 3.2 },
          { number: 5, name: '바람', odds: 2.9 },
          { number: 6, name: '구름', odds: 3.0 },
          { number: 7, name: '번개', odds: 3.0 },
          { number: 8, name: '별', odds: 3.8 }
        ]
      },
      {
        id: '2',
        raceNumber: 2,
        raceName: '서울경마장 2R',
        startTime: '2024-03-17 13:30',
        status: 'upcoming',
        horses: [
          { number: 1, name: '번개', odds: 3.5 },
          { number: 2, name: '질주', odds: 2.8 },
          { number: 3, name: '쾌속', odds: 2.5 },
          { number: 4, name: '천둥', odds: 3.2 },
          { number: 5, name: '바람', odds: 2.9 },
          { number: 6, name: '구름', odds: 3.0 },
          { number: 7, name: '번개', odds: 3.0 },
          { number: 8, name: '별', odds: 3.8 }
        ]
      }
    ];
    setRaces(mockRaces);
    setLoading(false);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {races.map((race) => (
        <div
          key={race.id}
          className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group border border-gray-200"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                  {race.raceName}
                </h2>
                <p className="text-gray-500">
                  시작 시간: {new Date(race.startTime).toLocaleString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                race.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                race.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {race.status === 'upcoming' ? '시작 전' :
                 race.status === 'in_progress' ? '진행 중' : '종료'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {race.horses.map((horse) => (
                <div
                  key={horse.number}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                >
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-800">{horse.number}번</p>
                    <p className="text-gray-600">{horse.name}</p>
                    <p className="text-sm text-gray-500 mt-2">배당률: {horse.odds}배</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HorseRacing; 
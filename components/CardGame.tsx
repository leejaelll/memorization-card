'use client';

import { useState } from 'react';
import { useNotion } from '@/context/NotionContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CardData {
  description: string;
  term: string;
}

export default function CardGame({ id }: { id: string }) {
  const { pages } = useNotion();
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [gameMode, setGameMode] = useState<'study' | 'quiz'>('study');

  const subjectProperty = pages
    .filter((page) => page.properties['과목'].select?.id === id)
    .map((page) => page.properties);

  const cards: CardData[] = subjectProperty.map((property) => {
    const description =
      property['설명']?.rich_text
        ?.map((item: any) => item.plain_text)
        .join('') ?? '';

    const term =
      property['용어']?.title?.map((item: any) => item.plain_text).join('') ??
      '';

    return { description, term };
  });

  const handleCardFlip = (index: number) => {
    const newFlippedCards = new Set(flippedCards);
    if (newFlippedCards.has(index)) {
      newFlippedCards.delete(index);
    } else {
      newFlippedCards.add(index);
    }
    setFlippedCards(newFlippedCards);
  };

  const handleSlideChange = (swiper: any) => {
    setCurrentCardIndex(swiper.activeIndex);
  };

  const resetGame = () => {
    setFlippedCards(new Set());
    setCurrentCardIndex(0);
  };

  if (cards.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-gray-500'>카드가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className=''>
      {/* 게임 컨트롤 */}
      <div className='mb-4 sm:mb-6 flex flex-col  justify-between items-center gap-2 sm:gap-0'>
        <div className=''>
          <button
            onClick={() => setGameMode('study')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
              gameMode === 'study'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            학습 모드
          </button>
          <button
            onClick={() => setGameMode('quiz')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
              gameMode === 'quiz'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            퀴즈 모드
          </button>
        </div>

        <div className='text-right w-full sm:w-auto mt-2 sm:mt-0'>
          <p className='text-xs sm:text-sm text-gray-600'>
            {currentCardIndex + 1} / {cards.length}
          </p>
        </div>
      </div>

      {/* 카드 스와이퍼 */}
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        onSlideChange={handleSlideChange}
        className='card-swiper'
        style={{ maxWidth: '100%', width: '100%' }}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <CardItem
              card={card}
              isFlipped={flippedCards.has(index)}
              onFlip={() => handleCardFlip(index)}
              gameMode={gameMode}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 게임 리셋 버튼 */}
      <div className='mt-4 sm:mt-6 text-center'>
        <button
          onClick={resetGame}
          className='px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base'
        >
          게임 리셋
        </button>
      </div>
    </div>
  );
}

interface CardItemProps {
  card: CardData;
  isFlipped: boolean;
  onFlip: () => void;
  gameMode: 'study' | 'quiz';
}

function CardItem({ card, isFlipped, onFlip, gameMode }: CardItemProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleCardClick = () => {
    if (gameMode === 'study') {
      onFlip();
    } else {
      setShowAnswer(true);
    }
  };

  return (
    <div className='flex justify-center'>
      <div
        className={`
          w-full max-w-xs
          sm:w-80 sm:h-96
          h-72 sm:h-96
          cursor-pointer perspective-1000
          ${gameMode === 'quiz' ? 'quiz-card' : 'study-card'}
        `}
        onClick={handleCardClick}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped || showAnswer ? 'rotate-y-180' : ''
          }`}
        >
          {/* 카드 앞면 */}
          <div className='absolute w-full h-full backface-hidden'>
            <div className='w-full h-full bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 sm:p-6 flex flex-col justify-center items-center'>
              <div className='text-center'>
                <h3 className='text-base sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4'>
                  {gameMode === 'study' ? '용어' : '문제'}
                </h3>
                <p className='text-sm sm:text-lg text-gray-600 break-words'>
                  {gameMode === 'study' ? card.term : card.description}
                </p>
                <p className='text-xs sm:text-sm text-gray-400 mt-2 sm:mt-4'>
                  클릭하여 답을 확인하세요
                </p>
              </div>
            </div>
          </div>

          {/* 카드 뒷면 */}
          <div className='absolute w-full h-full backface-hidden rotate-y-180'>
            <div className='w-full h-full bg-blue-50 rounded-xl shadow-lg border-2 border-blue-200 p-3 sm:p-6 flex flex-col justify-center items-center'>
              <div className='text-center'>
                <h3 className='text-base sm:text-xl font-bold text-blue-800 mb-2 sm:mb-4'>
                  {gameMode === 'study' ? '설명' : '정답'}
                </h3>
                <p className='text-sm sm:text-lg text-blue-600 break-words'>
                  {gameMode === 'study' ? card.description : card.term}
                </p>
                {gameMode === 'quiz' && showAnswer && (
                  <div className='mt-2 sm:mt-4'>
                    <p className='text-xs sm:text-sm text-green-600'>
                      +10점 획득!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

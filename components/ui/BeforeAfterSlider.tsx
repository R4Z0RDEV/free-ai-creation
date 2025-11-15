'use client';

import { useRef, useState } from 'react';

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
  className?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt = 'Before / After comparison',
  className = '',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50); // 0 ~ 100 (%)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updatePositionFromEvent = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX =
      'touches' in e
        ? e.touches[0]?.clientX ?? 0
        : (e as React.MouseEvent).clientX;

    const x = clientX - rect.left;
    const next = (x / rect.width) * 100;
    const clamped = Math.min(100, Math.max(0, next));

    setPosition(clamped);
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setIsDragging(true);
    updatePositionFromEvent(e);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;
    updatePositionFromEvent(e);
  };

  const stopDragging = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      className={
        'relative w-full h-[360px] md:h-[420px] overflow-hidden rounded-3xl bg-black/80 select-none ' +
        className
      }
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={stopDragging}
    >
      {/* AFTER 전체 이미지 */}
      <img
        src={afterSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />

      {/* BEFORE – 왼쪽 영역만 보이도록 clip-path로 자르기 */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <img
          src={beforeSrc}
          alt={alt}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* 중앙 세로 라인 */}
      <div
        className="absolute top-3 bottom-3 w-px bg-white/70"
        style={{ left: `${position}%`, transform: 'translateX(-0.5px)' }}
      />

      {/* 핸들 */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${position}%` }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#6366f1] shadow-lg shadow-purple-500/40 flex items-center justify-center border border-white/60">
          <span className="text-white text-xs">⇆</span>
        </div>
      </div>

      {/* BEFORE / AFTER 라벨 */}
      <div className="absolute left-5 bottom-4 text-xs font-medium tracking-[0.2em] text-white/80">
        BEFORE
      </div>
      <div className="absolute right-5 bottom-4 text-xs font-medium tracking-[0.2em] text-white/80">
        AFTER
      </div>
    </div>
  );
}
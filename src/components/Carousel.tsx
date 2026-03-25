import { Children, useRef, useState, useEffect, useCallback } from "react";

interface CarouselProps {
  children: React.ReactNode;
  itemWidth?: number;
  gap?: number;
}

export default function Carousel({ children, itemWidth = 280, gap = 24 }: CarouselProps) {
  const items = Children.toArray(children);
  const [index, setIndex] = useState(Math.floor(items.length / 2));
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);
  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, items.length - 1)),
    [items.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const onPointerDown = (e: React.PointerEvent) => {
    // NEW: Check if the user is clicking a link or button
    const target = e.target as HTMLElement;
    if (target.closest("a, button")) {
      return; // Let the browser handle the link/button naturally
    }

    dragStart.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragStart.current) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If it's a click (moved less than 6px)
    if (distance < 6) {
      // THE FIX: Ask the document what is at these coordinates
      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
      const card = elementAtPoint?.closest("[data-index]");

      if (card) {
        const newIndex = parseInt(card.getAttribute("data-index") || "0", 10);
        setIndex(newIndex);
      }
    }
    // If it's a swipe
    else if (Math.abs(deltaX) > 30) {
      if (deltaX < 0) next();
      else prev();
    }

    dragStart.current = null;
  };

  const step = itemWidth + gap;

  return (
    <div className="relative w-full select-none overflow-hidden py-10">
      <div
        className="flex items-center cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStart.current = null)}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          className="flex items-center transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            gap,
            transform: `translateX(calc(50% - ${index * step + itemWidth / 2}px))`,
          }}
        >
          {items.map((child, i) => (
            <div
              key={i}
              data-index={i}
              className="shrink-0 transition-all duration-500"
              style={{
                width: itemWidth,
                opacity: i === index ? 1 : Math.abs(i - index) === 1 ? 0.4 : 0.1,
                transform: `scale(${i === index ? 1 : 0.9})`,
              }}
            >
              {/* Ensure children don't block the hit-test */}
              <div>{child}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-2 justify-center">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

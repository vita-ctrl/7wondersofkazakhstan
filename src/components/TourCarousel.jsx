import React, { useRef, useEffect, useState } from "react";

const items = [
  { title: "Байконур", image: "https://www.russian.space/kosmodromy/kosmodrom-baykonur/scale_1200-24.jpeg", url: "/tours/baikonur" },
  { title: "Мавзолей Ясави", image: "https://fs.tonkosti.ru/cl/0u/cl0uikkvo3s40844kocogsckk.jpg", url: "/tours/mavsoley" },
  { title: "Чарынский каньон", image: "https://sputnik.kz/img/252/01/2520108_0:0:1200:754_1920x0_80_0_0_2f1a758190a93bf393a6da720eed4169.jpg", url: "/tours/kanyon" },
  { title: "Озеро Каинды", image: "https://img.tourister.ru/files/1/9/4/1/9/6/0/8/original.jpg", url: "/tours/ozero" },
  { title: "Тамгалы", image: "https://pictures.pibig.info/uploads/posts/2023-04/1680701922_pictures-pibig-info-p-naskalnie-risunki-tamgali-instagram-3.jpg", url: "/tours/tamgaly" },
  { title: "Пик Победы", image: "https://cs17.pikabu.ru/s/2025/08/30/16/ejhflvbn_lg.jpg", url: "/tours/pik" },
  { title: "Поющие барханы", image: "https://1zoom.club/uploads/posts/2023-03/1678128765_1zoom-club-p-barkhan-79.jpg", url: "/tours/barhany" }
];

export default function Carousel() {
  const trackRef = useRef(null);
  const animationRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  const pos = useRef(0);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const pauseTimeout = useRef(null);

  const speed = 0.8;

  const pauseAutoScroll = () => {
    isDown.current = true;
    setIsDragging(true);

    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);

    pauseTimeout.current = setTimeout(() => {
      isDown.current = false;
      setIsDragging(false);
    }, 6000);
  };

  const animate = () => {
    if (!isDown.current) {
      pos.current -= speed;
    }

    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;
    let finalPos = pos.current % totalWidth;

    if (finalPos < 0) finalPos += totalWidth;

    track.style.transform = `translateX(${-finalPos}px)`;

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const onDown = (x) => {
    pauseAutoScroll();
    startX.current = x;
    scrollStart.current = pos.current;
  };

  const onMove = (x) => {
    if (!isDragging) return;
    pos.current = scrollStart.current + (startX.current - x);
  };

  const onUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full overflow-hidden py-4 select-none -mx-4 mb-10">
      <div
        className="w-full cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => onDown(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={(e) => onDown(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onUp}
      >
        <div ref={trackRef} className="flex gap-6 w-max" style={{ transition: "none" }}>
          {[...items, ...items].map((item, index) => (
            <div
              key={index}
              className={`min-w-[350px] h-[420px] rounded-2xl overflow-hidden shadow-xl relative ${isDragging ? "" : "transition-transform duration-300 hover:scale-[1.03]"
                }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />

              {/* 🔥 Размытая нижняя область 20% */}
              <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-black/25 backdrop-blur-md flex items-end p-4">

                {/* Название — чуть темнее, хорошо читаемое */}
                <span className="text-[#D9CBB3] text-lg font-semibold drop-shadow-md">
                  {item.title}
                </span>

                {/* Кнопка справа */}
                <a
                  href={item.url}
                  onClick={(e) => e.stopPropagation()}
                  className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 bg-[#424E2B] text-[#E5D9C6]"
                >
                  Подробнее
                </a>
              </div>


            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

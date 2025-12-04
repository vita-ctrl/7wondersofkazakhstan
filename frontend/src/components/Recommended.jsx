import { useEffect } from "react";

export function Recommended(props) {
  const cards = props.recommendedCards;

  // Добавляем анимацию при монтировании
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(15px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeInUp {
        animation: fadeInUp 0.5s ease forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-left">
        Рекомендуем также
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="flex flex-col justify-between bg-cream dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:-translate-y-2 p-3 shadow-xl backdrop-blur-lg hover:shadow-2xl transition duration-300 animate-fadeInUp"
          >
            <a href={c.url}>
              <img
                src={c.img}
                alt={c.title}
                className="w-full h-48 object-cover rounded-md mb-3"
                loading="lazy"
              />

              <div className="flex flex-col grow">
                <div className="text-[15px] font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 min-h-10">
                  {c.title}
                </div>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[#FF9900] text-[15px] font-bold">
                      {c.price}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

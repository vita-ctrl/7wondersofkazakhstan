import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

export function ReviewsInfinite(props) {
  const [allReviews, setAllReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const maximumRating = 5;
  const url = props.url;

  // Загрузка отзывов при монтировании
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsInitialLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Ошибка при загрузке отзывов");
        }
        const data = await response.json();
        setAllReviews(data);
        setError(null);
      } catch (err) {
        console.error("Ошибка загрузки отзывов:", err);
        setError(err.message);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchReviews();
  }, [url]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 5, allReviews.length));
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(15px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeInUp { animation: fadeInUp 0.5s ease forwards; }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .animate-spin { animation: spin 1s linear infinite; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Показываем загрузку при первоначальной загрузке
  if (isInitialLoading) {
    return (
      <div className="my-8 flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Загружаем отзывы...</p>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="my-8 flex flex-col items-center justify-center py-20">
        <p className="text-red-600 dark:text-red-400">Ошибка: {error}</p>
      </div>
    );
  }

  return (
    <div className="my-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">
      <div className="relative">
        <div className="w-full max-w-[900px] space-y-6 relative overflow-hidden">
          {allReviews.slice(0, visibleCount).map((r) => (
            <div
              key={r.id}
              className="bg-vanilla dark:bg-gray-800 dark:border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-xs relative opacity-0 animate-fadeInUp"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[15px] text-gray-800 dark:text-gray-100">
                    {r.name}
                  </h3>
                  <p className="text-sm text-gray-500">{r.date}</p>
                </div>
                <div className="flex justify-end mt-1 text-yellow-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className="w-4 h-4"
                    />
                  ))}
                  {[...Array(maximumRating - r.rating)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStarRegular}
                      className="w-4 h-4"
                    />
                  ))}
                </div>
              </div>

              <p className="text-[14px] text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
                {r.text}
              </p>
            </div>
          ))}
        </div>

        {visibleCount < allReviews.length && (
          <div className="flex justify-start mt-6">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className={`cursor-pointer px-4 py-1.5 text-sm font-medium rounded-md border border-olive-dark text-olive-dark hover:bg-olive-dark dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 hover:text-white transition-all duration-300 ${
                isLoading ? "opacity-70 cursor-wait" : ""
              }`}
            >
              {isLoading ? "Загружаем..." : "Показать ещё"}
            </button>
          </div>
        )}
      </div>

      <div className="sticky top-24">
        <RatingSummary {...props.ratingSummary} />
      </div>
    </div>
  );
}

function RatingSummary(props) {
  const totalReviews = props.totalReviews;
  const average = props.average;
  const ratings = props.ratings;

  const getWidth = (count) => (count / totalReviews) * 100;

  return (
    <div className="bg-vanilla dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm max-w-[360px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex text-yellow-400 text-lg">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className={
                i < Math.round(average) ? "text-yellow-400" : "text-gray-300"
              }
            />
          ))}
        </div>
        <div className="text-[20px] font-bold text-gray-800 dark:text-gray-100">
          {average.toFixed(1)}{" "}
          <span className="text-gray-500 text-[16px]">/ 5</span>
        </div>
      </div>

      <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-5">
        Рейтинг формируется на основе отзывов
      </p>

      <div className="space-y-2 mb-5">
        {ratings.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[12px] text-gray-700 dark:text-gray-300 w-10">
              {r.stars}★
            </span>
            <div className="flex-1 bg-gray-50 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-yellow-400 h-full rounded-full"
                style={{ width: `${getWidth(r.count)}%` }}
              ></div>
            </div>
            <span className="text-[12px] text-gray-600 dark:text-gray-400 w-8 text-right">
              {r.count}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[12px] text-gray-500 dark:text-gray-400">
        Отзывы могут оставлять только те, кто купил тур.
      </p>
    </div>
  );
}

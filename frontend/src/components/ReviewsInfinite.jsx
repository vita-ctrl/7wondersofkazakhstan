import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

export function ReviewsInfinite(props) {
  const [allReviews, setAllReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const maximumRating = 5;
  const url = props.url;

  // Загрузка первой страницы при монтировании
  useEffect(() => {
    const fetchInitialReviews = async () => {
      try {
        setIsInitialLoading(true);
        const response = await fetch(`${url}&page=1`);
        if (!response.ok) throw new Error("Ошибка при загрузке отзывов");

        const data = await response.json();

        // Проверяем структуру ответа
        // Если API возвращает { reviews: [...], hasMore: true }
        if (data.reviews) {
          setAllReviews(data.reviews);
          setHasMore(data.hasMore ?? data.reviews.length > 0);
        } else {
          // Если API возвращает просто массив отзывов
          setAllReviews(data);
          setHasMore(data.length > 0);
        }

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialReviews();
  }, [url]);

  // Загрузка следующей страницы
  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const response = await fetch(`${url}&page=${nextPage}`);

      if (!response.ok) throw new Error("Ошибка при загрузке отзывов");

      const data = await response.json();

      // Проверяем структуру ответа
      if (data.reviews) {
        setAllReviews((prev) => [...prev, ...data.reviews]);
        setHasMore(data.hasMore ?? false);
      } else {
        setAllReviews((prev) => [...prev, ...data]);
        // Если вернулось меньше отзывов или пусто - больше страниц нет
        setHasMore(data.length > 0);
      }

      setCurrentPage(nextPage);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(15px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeInUp {
        animation: fadeInUp 0.5s ease forwards;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .animate-spin {
        animation: spin 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="font-['Inter'] my-8 flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Загружаем отзывы...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-['Inter'] my-8 flex flex-col items-center justify-center py-20">
        <p className="text-red-600 dark:text-red-400">Ошибка: {error}</p>
      </div>
    );
  }

  return (
    <div className="font-['Inter'] my-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">
      <div>
        <div className="w-full max-w-[900px] space-y-6">
          {allReviews.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md opacity-0 animate-fadeInUp"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[15px] text-gray-800 dark:text-gray-100">
                    {r.name}
                  </h3>
                  <p className="text-sm text-gray-500">{r.date}</p>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <FontAwesomeIcon
                      key={`full-${i}`}
                      icon={faStar}
                      className="w-4 h-4"
                    />
                  ))}
                  {[...Array(maximumRating - r.rating)].map((_, i) => (
                    <FontAwesomeIcon
                      key={`empty-${i}`}
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

        {hasMore && (
          <div className="flex justify-start mt-6">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className={`px-4 py-1.5 text-sm font-medium rounded-md border border-olive-dark text-olive-dark hover:bg-olive-dark hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 transition-all ${
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

function RatingSummary({ totalReviews, average, ratings }) {
  const getWidth = (count) => (count / totalReviews) * 100;

  return (
    <div className="font-['Inter'] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-lg max-w-[360px]">
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
          {average.toFixed(1)}
          <span className="text-gray-500 text-[16px]">/ 5</span>
        </div>
      </div>

      <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-5">
        Рейтинг формируется на основе отзывов
      </p>

      <div className="space-y-2 mb-5">
        {ratings
          .sort((a, b) => b.stars - a.stars) // сортировка по убыванию звезд
          .map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[12px] w-10 text-gray-700 dark:text-gray-300">
                {r.stars} <FontAwesomeIcon icon={faStar} />
              </span>
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full"
                  style={{ width: `${getWidth(r.count)}%` }}
                />
              </div>
              <span className="text-[12px] w-8 text-right text-gray-600 dark:text-gray-400">
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
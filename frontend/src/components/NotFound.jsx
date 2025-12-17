import { useState } from "react";
import { HashLink } from "react-router-hash-link";

export default function NotFoundPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="font-['Inter'] min-h-screen bg-linear-to-br text-white overflow-hidden relative">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-linear-to-r from-sage-green to-olive-dark dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold mb-4 text-sage-green dark:text-gray-200">
            Страница не найдена
          </h2>
          <p className="text-xl text-olive-dark dark:text-gray-400 max-w-md">
            Кажется, вы попали не на существующую страницу.
          </p>
        </div>

        <div className="mb-12 relative">
          <div className="w-24 h-24 border-4 border-olive-dark dark:border-blue-400 rounded-full flex items-center justify-center animate-spin-slow">
            <div className="w-2 h-8 bg-olive-dark dark:bg-blue-500 rounded-full"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
        </div>

        <HashLink
          smooth
          to="/#tours"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative px-8 py-4 rounded-full font-semibold text-lg
            bg-linear-to-r from-sage-green to-olive-dark dark:from-cyan-500 dark:to-blue-600
            hover:from-sage-green hover:to-olive-dark dark:hover:from-cyan-400 dark:hover:to-blue-500
            transform transition-all duration-300
            ${isHovered ? "scale-110 shadow-2xl" : "scale-100 shadow-lg"}
            overflow-hidden group
          `}
        >
          <div
            className={`
              absolute inset-0 bg-linear-to-r from-sage-green to-sage-green dark:from-cyan-400 dark:to-blue-500
              transition-opacity duration-300
              ${isHovered ? "opacity-100" : "opacity-0"}
            `}
          ></div>

          <span className="relative z-10 flex items-center">
            Вернуться к турам
            <svg
              className={`ml-2 w-5 h-5 transition-transform duration-300 ${
                isHovered ? "translate-x-1" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>

          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:animate-ping"></div>
        </HashLink>

        <div className="mt-8 flex flex-wrap justify-center gap-4 dark:text-gray-400 text-olive-dark">
          <a
            href="/contacts"
            className="hover:text-sage-green dark:hover:text-cyan-400 transition-colors duration-200 border border-olive-dark dark:border-gray-600 hover:border-sage-green dark:hover:border-cyan-400 px-4 py-2 rounded-lg"
          >
            Связаться с поддержкой
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-linear-to-br bg-cream dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col items-center gap-8">
        {/* Спиннер */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-white dark:border-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-olive-dark dark:border-t-blue-400 animate-spin"></div>
        </div>

        {/* Текст */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-olive-dark dark:text-white mb-2">
            Загрузка тура
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Пожалуйста, подождите...
          </p>
        </div>

        {/* Точки анимации */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-olive-dark dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-olive-dark dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-olive-dark dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
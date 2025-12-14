export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/90 dark:bg-slate-900/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8">
        {/* Спиннер */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-white dark:border-slate-700" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-olive-dark dark:border-t-blue-400 animate-spin" />
        </div>

        {/* Текст */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-olive-dark dark:text-white mb-2">
            Загрузка
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Пожалуйста, подождите...
          </p>
        </div>

        {/* Анимация точек */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-olive-dark dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-olive-dark dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-olive-dark dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}

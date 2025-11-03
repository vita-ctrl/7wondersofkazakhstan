export function Hero() {
  return (
    <div className="relative pt-16">
      <div className="max-w-7xl mx-auto rounded-xl overflow-hidden">
        <div className="relative h-96 rounded-t-xl overflow-hidden">
          <div className="w-full h-full rounded-t-xl overflow-hidden">
            <img src="hero.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
              Путешествия по Казахстану
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

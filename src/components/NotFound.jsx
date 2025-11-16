import { useState, useEffect } from 'react';


export default function NotFoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 5,
          size: Math.random() * 3 + 1
        });
      }
      setParticles(newParticles);
    };

    window.addEventListener('mousemove', handleMouseMove);
    generateParticles();

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden relative">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-28 h-28 bg-cyan-500 rounded-full blur-xl"></div>
      </div>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold mb-4 text-gray-200">
            Страница не найдена
          </h2>
          <p className="text-xl text-gray-400 max-w-md">
            Кажется, вы попали не на существующую страницу.
          </p>
        </div>

        <div className="mb-12 relative">
          <div className="w-24 h-24 border-4 border-green-400 rounded-full flex items-center justify-center animate-spin-slow">
            <div className="w-2 h-8 bg-green-400 rounded-full"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
        </div>

        <button
          onClick={handleGoHome}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative px-8 py-4 rounded-full font-semibold text-lg
            bg-linear-to-r from-cyan-500 to-blue-600
            hover:from-cyan-400 hover:to-blue-500
            transform transition-all duration-300
            ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100 shadow-lg'}
            overflow-hidden group
          `}
        >
          <div className={`
            absolute inset-0 bg-linear-to-r from-cyan-400 to-blue-500
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}></div>
          
          <span className="cursor-pointer relative z-10 flex items-center">
            Вернуться к турам
            <svg 
              className={`ml-2 w-5 h-5 transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>

          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:animate-ping"></div>
        </button>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-gray-400">
          <a href='/contacts' className="hover:text-cyan-400 transition-colors duration-200 border border-gray-600 hover:border-cyan-400 px-4 py-2 rounded-lg">
            Связаться с поддержкой
          </a>
        </div>
      </div>
    </div>
  );
};

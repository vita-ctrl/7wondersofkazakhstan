import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuoteLeft,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

export default function ReviewCard({ logo, name, rating, text }) {
  return (
    <div className="bg-[#e7e1d5] dark:bg-gray-800 backdrop-blur-lg shadow-xl rounded-3xl p-5 border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>

      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="relative">
          <img
            src={logo}
            alt={name}
            className="w-12 h-12 rounded-full shadow-lg object-cover border-2 border-[#E5D9C6] group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-[#E5D9C6] flex items-center justify-center">
            <FontAwesomeIcon icon={faQuoteLeft} className="text-white text-xs" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 dark:text-[#E5D9C6] text-lg truncate">{name}</p>
          <div className="flex">
            {[...Array(rating)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className="text-yellow-400"
              />
            ))}
            {[...Array(5 - rating)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStarRegular}
                className="text-gray-400"
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-[#353d27] dark:text-[#E5D9C6] text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
        {text}
      </p>
    </div>
  );
}
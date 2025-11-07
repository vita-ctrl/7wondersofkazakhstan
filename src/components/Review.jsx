import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Review(props) {
  const maximumRating = 5;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md testimonial-card transition-colors duration-300">
      <div className="flex items-center mb-4">
        <img
          src={props.logo}
          alt={props.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <h4 className="font-bold text-gray-900 dark:text-white">
            {props.name}
          </h4>

          {/* динамические звезды */}
          <div className="flex text-yellow-400">
            {[...Array(props.rating)].map((_, i) => (
              <FontAwesomeIcon
                className="text-yellow-400 text-xs"
                icon={faStar}
              />
            ))}
            {[...Array(maximumRating - props.rating)].map((_, i) => (
              <FontAwesomeIcon
                className="text-yellow-400 text-xs"
                icon={faStarRegular}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 italic">{props.text}</p>
    </div>
  );
}

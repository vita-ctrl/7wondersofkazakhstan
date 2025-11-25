import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Card(props) {
  const maximumRating = 5;

  return (
    <>
      <div
        id="alps"
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden tour-card transition"
      >
        <div className="relative">
          <img
            src={props.image}
            alt="image"
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {props.title}
            </h3>
          </div>

          <p className="text-[#424e2b] dark:text-gray-300 mb-10">
            {props.description}
          </p>

          <div className="absolute left-5 bottom-5 flex items-center text-yellow-400 mb-4">
            {[...Array(props.stars)].map((_, i) => (
              <FontAwesomeIcon
                className="text-yellow-400 text-xs"
                icon={faStar}
              />
            ))}
            {[...Array(maximumRating - props.stars)].map((_, i) => (
              <FontAwesomeIcon
                className="text-yellow-400 text-xs"
                icon={faStarRegular}
              />
            ))}
            <span className="text-gray-600 dark:text-gray-400 ml-1">
              ({props.rating})
            </span>
          </div>

          <div className="absolute right-5 bottom-5 flex justify-end items-center">
            <a
              href={props.url}
              className="bg-[#424e2b] text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md font-medium text-sm transition duration-300"
              id="open-alps"
            >
              Подробнее
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

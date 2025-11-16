import { useState } from "react";

export default function ParticipantsCounter() {
  const maximumCount = 10;
  const [count, setCount] = useState(1);

  const handleDecrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3">
      <span className="text-[13px] text-gray-700 dark:text-gray-300">
        Участников
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={count <= 1}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          –
        </button>
        <span className="px-2 text-sm font-semibold">{count}</span>
        <button
          onClick={handleIncrease}
          disabled={count == maximumCount}
          className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Search } from "lucide-react";

const SmartSearch = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("AI Search:", query);
  };

  return (
    <div className="w-full border-b shadow-md">

      <div className="max-w-7xl mx-auto px-4 py-2">

        <form
          onSubmit={handleSearch}
          className="
            flex items-center
            bg-gray-100
            rounded-full
            px-3 py-1.5
            gap-2
            shadow-md shadow-black/50
          "
        >
          {/* Icon */}
          <Search size={16} className="text-gray-500" />

          {/* Input */}
          <input
            type="text"
            placeholder='Try: "men shoes under 3000"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              flex-1
              bg-transparent
              outline-none
              text-sm
              sm:text-base
              placeholder:text-[11px]
              sm:placeholder:text-sm
              placeholder-gray-400
            "
          />

          {/* Button */}
          <button
            type="submit"
            className="
              bg-indigo-600
              text-white
              text-xs sm:text-sm
              px-3 py-1
              rounded-full
              hover:bg-indigo-700
              transition
            "
          >
            Search
          </button>

        </form>

      </div>

    </div>
  );
};

export default SmartSearch;
import { useState } from "react";
import { Search } from "lucide-react";

const SmartSearch = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("AI Search Query:", query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="
        bg-white shadow-lg rounded-xl
        px-4 py-4
        flex flex-col gap-3
        sm:flex-row sm:items-center
      "
    >
      {/* Search Icon */}
      <div className="flex items-center gap-2 text-indigo-600">
        <Search />
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder='Try: "men shoes under 3000"'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          flex-1
          outline-none
          text-gray-700
          placeholder-gray-400
          text-sm sm:text-base
        "
      />

      {/* Button */}
      <button
        type="submit"
        className="
          w-full sm:w-auto
          px-4 py-2
          bg-indigo-600 text-white
          rounded-lg
          hover:bg-indigo-700
          transition
        "
      >
        Search
      </button>
    </form>
  );
};

export default SmartSearch;

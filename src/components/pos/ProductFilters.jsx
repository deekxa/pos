import { Search, Grid3x3, List } from 'lucide-react';

export default function ProductFilters({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  categories,
  selectedCategory,
  onCategoryChange
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-gray-900 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-3 rounded-lg border-2 transition-all ${
              viewMode === "grid"
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-900"
            }`}
          >
            <Grid3x3 size={20} />
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={`p-3 rounded-lg border-2 transition-all ${
              viewMode === "table"
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-900"
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${
              selectedCategory === category
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-900"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

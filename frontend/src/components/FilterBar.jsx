export default function FilterBar({
    searchText,
    setSearchText,
    selectedStatus,
    setSelectedStatus,
    selectedKeyword,
    setSelectedKeyword,
    availableKeywords = [],
  }) {
    return (
      <div className="flex gap-4 mb-4 p-2 bg-gray-100 rounded">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-3 py-1 border rounded"
        />
  
        {/* Open/Closed filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="all">All Restaurants</option>
          <option value="open">Open Now</option>
          <option value="closed">Closed</option>
        </select>
  
        {/* Keywords filter */}
        <select
          value={selectedKeyword}
          onChange={(e) => setSelectedKeyword(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="">All Categories</option>
          {availableKeywords.map((keyword) => (
            <option key={keyword} value={keyword}>
              { keyword.charAt(0).toUpperCase() + keyword.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
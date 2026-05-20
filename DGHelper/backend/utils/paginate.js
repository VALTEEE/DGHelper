function paginate(items, page = 1, limit = 24) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = items.slice(start, end);

  return {
    page,
    totalItems,
    totalPages,
    data
  };
}

module.exports = paginate;  // ✅ must export the function directly
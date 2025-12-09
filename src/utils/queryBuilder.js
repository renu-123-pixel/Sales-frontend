export const buildQuery = (filters, search, sort, page, limit) => {
  const query = {};

  // Search, sorting, pagination
  if (search) query.q = search;
  if (sort) query.sort = sort;
  if (page) query.page = page;
  if (limit) query.limit = limit;

  // Filters mapping to backend field names
  if (filters.region && filters.region.length > 0) {
    query.regions = filters.region.join(",");
  }

  if (filters.category && filters.category.length > 0) {
    query.categories = filters.category.join(",");
  }

  // You can add more filters later if needed
  return query;
};

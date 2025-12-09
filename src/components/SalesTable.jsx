import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Debounce utility
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Sorting
  const [sort, setSort] = useState("date_desc");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounced search handler
  const handleSearchChange = (e) => {
    setPage(1);
    setSearch(e.target.value);
  };
  const debouncedSearch = useCallback(debounce(handleSearchChange, 500), []);

let controller;
  // Fetch data from backend
  const fetchSales = async () => {
    setLoading(true);
    // Cancel previous request if it exists
  if (controller) {
    controller.abort();
  }

  // Create a new controller for this request
  controller = new AbortController();
  const signal = controller.signal;

    try {
      const params = {
        q: search,
        regions: regions.join(","), // multi-select filter
        categories: categories.join(","),
        sort,
        page,
        page_size: pageSize,
      };
      const response = await axios.get("http://localhost:5000/api/sales", { params,signal, });
      setSales(response.data.items);
      setTotalPages(response.data.total_pages);
      setTotalItems(response.data.total);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch sales data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [search, regions, categories, sort, page, pageSize]);

  // Sorting
  const handleSort = (key) => {
    if (key === "customer") setSort(sort === "customer_asc" ? "customer_desc" : "customer_asc");
    if (key === "quantity") setSort(sort === "quantity_desc" ? "quantity_asc" : "quantity_desc");
    if (key === "date") setSort(sort === "date_desc" ? "date_asc" : "date_desc");
  };

  const getSortIcon = (key) => {
    if ((key === "customer" && sort.includes("customer")) ||
        (key === "quantity" && sort.includes("quantity")) ||
        (key === "date" && sort.includes("date"))) {
      return sort.endsWith("asc") ? "↑" : "↓";
    }
    return "↕️";
  };

  // Handle multi-select filters
  const handleRegionChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setPage(1);
    setRegions(options);
  };

  const handleCategoryChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setPage(1);
    setCategories(options);
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={debouncedSearch}
          className="border p-1 rounded"
        />

        <select
          multiple
          value={regions}
          onChange={handleRegionChange}
          className="border p-1 rounded"
        >
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </select>

        <select
          multiple
          value={categories}
          onChange={handleCategoryChange}
          className="border p-1 rounded"
        >
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Books">Books</option>
        </select>

        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          className="border p-1 rounded"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-center font-semibold">
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("customer")}>
                Customer {getSortIcon("customer")}
              </th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Region</th>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("quantity")}>
                Quantity {getSortIcon("quantity")}
              </th>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("date")}>
                Date {getSortIcon("date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-2">
                  No data found
                </td>
              </tr>
            ) : (
              sales.map((s, i) => (
                <tr key={i} className="text-center hover:bg-gray-100">
                  <td className="border p-2">{s["Customer Name"]}</td>
<td className="border p-2">{s["Product Name"]}</td>
<td className="border p-2">{s["Product Category"]}</td>
<td className="border p-2">{s["Customer Region"]}</td>
<td className="border p-2">{s["Quantity"]}</td>

<td className="border p-2">
  {new Date(s["Date"].split("-").reverse().join("-")).toLocaleDateString()}
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="border px-3 py-1 rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-2 py-1">{page} / {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="border px-3 py-1 rounded disabled:opacity-50"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SalesTable;

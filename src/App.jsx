import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import SalesTable from "./components/SalesTable";
import Pagination from "./components/Pagination";
import { getSales } from "./services/api";
import { buildQuery } from "./utils/queryBuilder";

function App() {
  const [sales, setSales] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchSales = async () => {
    try {
      const params = buildQuery(filters, search, sort, page, limit);
      const data = await getSales(params);

      setSales(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [filters, search, sort, page]);

  return (
    <div className="min-h-screen w-full p-8 max-w-full black">
      <h1 className="text-3xl font-bold mb-6">Retail Sales Dashboard</h1>

      {/* Search */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* Filters */}
      <div className="mt-6">
        <Filters filters={filters} setFilters={setFilters} />
      </div>

      {/* Table */}
      <div className="mt-8">
        <SalesTable sales={sales} sort={sort} setSort={setSort} />
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
}

export default App;

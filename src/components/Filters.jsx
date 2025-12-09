import React, { useEffect, useState } from "react";
import axios from "axios";

const Filters = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);

  // Fetch dynamic options from backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sales/");
        setCategories(res.data.categories || []);
        setRegions(res.data.regions || []);
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    };
    fetchOptions();
  }, []);

  // Toggle filter selection
  const toggle = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((i) => i !== value)
          : [...arr, value],
      };
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold">Category</h4>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => toggle("category", c)}
            className={`px-3 py-1 border rounded mr-2 mt-2 ${
              filters.category?.includes(c) ? "bg-blue-500 text-white" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div>
        <h4 className="font-semibold">Region</h4>
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => toggle("region", r)}
            className={`px-3 py-1 border rounded mr-2 mt-2 ${
              filters.region?.includes(r) ? "bg-blue-500 text-white" : ""
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;

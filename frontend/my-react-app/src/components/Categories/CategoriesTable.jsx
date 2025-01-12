import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CategoriesTable.css";

const CategoriesTable = () => {
  const [categories, setCategories] = useState([]); // All categories from backend
  const [searchResults, setSearchResults] = useState([]); // Elasticsearch results
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const navigate = useNavigate();

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token not found. Redirecting to login.");
        navigate("/login"); // Redirect to login if no token
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized. Redirecting to login.");
          navigate("/login"); // Redirect to login on 401 error
        } else {
          console.error("Error fetching categories:", error);
        }
      }
    };

    fetchCategories();
  }, [navigate]);

  // Handle search input changes
  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    const token = localStorage.getItem("token");

    if (query.trim()) {
      if (!token) {
        console.error("Token not found. Redirecting to login.");
        navigate("/login"); // Redirect to login if no token
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/search/?q=${query}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSearchResults(response.data.products); // Set search results from API response
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized. Redirecting to login.");
          navigate("/"); // Redirect to login on 401 error
        } else {
          console.error("Error fetching search results:", error);
          setSearchResults([]); // Clear search results on error
        }
      }
    } else {
      setSearchResults([]); // Clear search results if input is empty
    }
  };

  // Navigate to products of a category
  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}/products/`);
  };

  return (
    <div>
      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Conditional Rendering for Search Results or Categories */}
      {searchTerm && searchResults.length > 0 ? (
        <div className="search-results">
          <h2>Search Results:</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
            
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Category ID</th>
              <th>Category Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
              >
                <td>{category.id}</td>
                <td>{category.name}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoriesTable;


/*
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CategoriesTable.css";

const CategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/categories/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}/products/`);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Category ID</th>
          <th>Category Name</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id} onClick={() => handleCategoryClick(category.id)}>
            <td>{category.id}</td>
            <td>{category.name}</td>
            <td>{category.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoriesTable;*/

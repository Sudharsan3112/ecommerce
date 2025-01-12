import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductsTable.css";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/categories/${categoryId}/products/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
        setError(null); // Clear any previous error
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      }
    };

    fetchProducts();
  }, [categoryId]);

  const back = () => {
    navigate("/categories");
  };

  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    setSearchTerm(inputValue);

    if (!inputValue.trim()) {
      // Show all products if the search term is empty
      setFilteredProducts(products);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/categories/${categoryId}/products/?productname=${inputValue}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFilteredProducts(response.data);
      setError(null); // Clear any previous error
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setError("Failed to fetch search results. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <button onClick={back}>Back</button>
      </div>
     
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>No of Items</th>
            <th>MRP</th>
            <th>Discount</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.items}</td>
                <td>{product.mrp}</td>
                <td>{product.discount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;

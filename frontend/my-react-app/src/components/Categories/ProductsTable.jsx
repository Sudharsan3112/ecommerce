import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProductsTable.css";
const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const { categoryId } = useParams();
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://127.0.0.1:8000/api/categories/${categoryId}/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    };
    fetchProducts();
  }, [categoryId]);

  return (
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
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.category}</td>
            <td>{product.items}</td>
            <td>{product.mrp}</td>
            <td>{product.discount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;

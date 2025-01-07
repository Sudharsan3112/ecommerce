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
    navigate(`/categories/${categoryId}`);
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

export default CategoriesTable;

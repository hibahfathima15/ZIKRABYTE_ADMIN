import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Product interface
const Products = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [slugs, setSlugs] = useState([]); // State for slugs
  const [selectedSlug, setSelectedSlug] = useState(""); // State for selected slug
  const [editingSlug, setEditingSlug] = useState(""); // State for editing slug

  // Fetch all products and slugs
  useEffect(() => {
    const fetchProductsAndSlugs = async () => {
      try {
        const [productsResponse, slugsResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/products/get-all-products`),
          axios.get(`${baseUrl}/api/homepage-project/projects`), // Fetch slugs here
        ]);
        setProducts(productsResponse.data);
        setSlugs(slugsResponse.data.map((project) => project.slug)); // Extract slugs
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchProductsAndSlugs();
  }, [baseUrl]);

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Upload new product
  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);
    formData.append("slug", selectedSlug); // Include the selected slug

    try {
      await axios.post(`${baseUrl}/api/products/create-products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(null);
      setSelectedSlug(""); // Reset selected slug

      Swal.fire({
        title: "Success",
        text: "Product created successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // Reload page to show the new product
      });
    } catch (error) {
      console.error("Error uploading product", error);
      Swal.fire("Error", "Failed to upload product", "error");
    }
  };

  // Handle delete product
  const handleDelete = async (id, publicId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/api/products/delete-product/${id}`, {
            data: { publicId }, // Send publicId for Cloudinary deletion
          });
          setProducts(products.filter((product) => product._id !== id));
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting product", error);
          Swal.fire("Error", "Failed to delete product", "error");
        }
      }
    });
  };

  // Edit product
  const handleEdit = async (id) => {
    if (!image && !editingSlug) return;
    const formData = new FormData();

    // Append new image if provided
    if (image) {
      formData.append("image", image);
    }

    // Append new slug if provided
    if (editingSlug) {
      formData.append("slug", editingSlug);
    }

    try {
      await axios.put(`${baseUrl}/api/products/edit-product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditingProductId(null);
      setEditingSlug(""); // Reset editing slug

      Swal.fire({
        title: "Success",
        text: "Product updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // Reload page to show the updated product
      });
    } catch (error) {
      console.error("Error editing product", error);
      Swal.fire("Error", "Failed to update product", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Products Management (Minimum 9 Required)
      </h1>

      {/* Form to upload new product */}
      <div className="mb-6 flex flex-col">
        <h2 className="text-xl font-semibold">Upload New Product</h2>
        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)} // Set selected slug
          className="border border-gray-300 p-2 rounded mb-4 mt-2"
          required
        >
          <option value="" disabled>
            Select a slug
          </option>
          {slugs.map((slug, index) => (
            <option key={index} value={slug}>
              {slug}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={handleImageChange}
          className="border border-gray-300 p-2 rounded mb-4"
        />
        <button
          onClick={handleUpload}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </div>

      {/* Display all products */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <img
                src={product.image}
                alt="Product"
                className="w-full h-64 object-cover mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{product.slug}</h3>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setEditingProductId(product._id);
                    setEditingSlug(product.slug); // Pre-fill the slug for editing
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id, product.publicId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              {/* Editing Section */}
              {editingProductId === product._id && (
                <div className="mt-4">
                  <select
                    value={editingSlug}
                    onChange={(e) => setEditingSlug(e.target.value)} // Allow slug editing via dropdown
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                    required
                  >
                    <option value="" disabled>
                      Select a new slug
                    </option>
                    {slugs.map((slug, index) => (
                      <option key={index} value={slug}>
                        {slug}
                      </option>
                    ))}
                  </select>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                  />
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingProductId(null)}
                    className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

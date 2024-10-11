import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Product interface
const Companies = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [companies, setCompanies] = useState([]);
  const [image, setImage] = useState(null);
  const [editingCompanyId, setEditingCompanyId] = useState(null);

  // Fetch all products
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/companies/get-all-companies`
        );
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies", error);
      }
    };
    fetchCompanies();
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

    try {
      await axios.post(`${baseUrl}/api/companies/create-companies`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(null);

      Swal.fire({
        title: "Success",
        text: "Product created successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // Reload page to show the new product
      });
    } catch (error) {
      console.error("Error uploading companies", error);
      Swal.fire("Error", "Failed to upload company", "error");
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
          await axios.delete(`${baseUrl}/api/companies/delete-company/${id}`, {
            data: { publicId }, // Send publicId for cloudinary deletion
          });
          setCompanies(companies.filter((company) => company._id !== id));
          Swal.fire("Deleted!", "Your company has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting company", error);
          Swal.fire("Error", "Failed to delete company", "error");
        }
      }
    });
  };

  // Edit product
  const handleEdit = async (id) => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.put(`${baseUrl}/api/companies/edit-company/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditingCompanyId(null);

      Swal.fire({
        title: "Success",
        text: "Company updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(); // Reload page to show the updated product
      });
    } catch (error) {
      console.error("Error editing company", error);
      Swal.fire("Error", "Failed to update company", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Company Managment</h1>

      {/* Form to upload new product */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Upload New Company</h2>
        <input
          type="file"
          onChange={handleImageChange}
          className="border border-gray-300 p-2 rounded"
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
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <img
                src={company.image}
                alt="Company"
                className="w-full h-64 object-cover mb-4"
              />
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setEditingCompanyId(company._id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(company._id, company.publicId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              {/* Editing Section */}
              {editingCompanyId === company._id && (
                <div className="mt-4">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="border border-gray-300 p-2 rounded mb-4"
                  />
                  <button
                    onClick={() => handleEdit(company._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingCompanyId(null)}
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

export default Companies;

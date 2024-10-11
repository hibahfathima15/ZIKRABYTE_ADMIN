import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Services = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState({
    header: "",
    description: "",
    content: "",
    tag: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseUrl}/api/services/all-service`);
      if (Array.isArray(response.data)) {
        setServices(response.data);
      } else {
        throw new Error("Data received is not an array");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Failed to fetch services. Please try again later.");
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setCurrentService({ ...currentService, [name]: files[0] });
    } else {
      setCurrentService({ ...currentService, [name]: value });
    }
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!currentService.header.trim()) errors.header = "Header is required";
    if (!currentService.description.trim())
      errors.description = "Description is required";
    if (!currentService.content.trim()) errors.content = "Content is required";
    if (!currentService.tag.trim()) errors.tag = "Tag is required";
    if (!isEditing && !currentService.image) errors.image = "Image is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    for (const key in currentService) {
      formData.append(key, currentService[key]);
    }

    try {
      if (isEditing) {
        await axios.put(
          `${baseUrl}/api/services/update-service/${currentService._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire("Success", "Service updated successfully!", "success");
      } else {
        await axios.post(`${baseUrl}/api/services/create-service`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Service created successfully!", "success");
      }
      fetchServices();
      resetForm();
    } catch (error) {
      console.error("Error saving service:", error);
      setError("Failed to save service. Please try again.");
      Swal.fire("Error", "Failed to save service. Please try again.", "error");
    }
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setError(null);
      try {
        await axios.delete(`${baseUrl}/api/services/delete-service/${id}`);
        fetchServices();
        Swal.fire("Deleted!", "Service has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting service:", error);
        setError("Failed to delete service. Please try again.");
        Swal.fire(
          "Error",
          "Failed to delete service. Please try again.",
          "error"
        );
      }
    }
  };

  const resetForm = () => {
    setCurrentService({
      header: "",
      description: "",
      content: "",
      tag: "",
      image: null,
    });
    setIsEditing(false);
    setShowForm(false);
    setFormErrors({});
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading services...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Services Management (Exactly 4 Required)
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {showForm ? "Cancel" : "Create New Service"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? "Edit Service" : "Create New Service"}
          </h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="header"
            >
              Header
            </label>
            <input
              type="text"
              id="header"
              name="header"
              value={currentService.header}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.header ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.header && (
              <p className="text-red-500 text-xs italic">{formErrors.header}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={currentService.description}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.description ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.description && (
              <p className="text-red-500 text-xs italic">
                {formErrors.description}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={currentService.content}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.content ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.content && (
              <p className="text-red-500 text-xs italic">
                {formErrors.content}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.image ? "border-red-500" : ""
              }`}
            />
            {formErrors.image && (
              <p className="text-red-500 text-xs italic">{formErrors.image}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="tag"
            >
              Tag
            </label>
            <input
              type="text"
              id="tag"
              name="tag"
              value={currentService.tag}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.tag ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.tag && (
              <p className="text-red-500 text-xs italic">{formErrors.tag}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isEditing ? "Update Service" : "Create Service"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-semibold mb-4">Services List</h2>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-semibold mb-2">{service.header}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-sm text-gray-500 mb-2">Tag: {service.tag}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleEdit(service)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No services found.</p>
        )}
      </div>
    </div>
  );
};

export default Services;

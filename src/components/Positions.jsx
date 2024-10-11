import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = process.env.REACT_APP_API_URL;

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [editingPosition, setEditingPosition] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    desc: "",
    mode: "",
    contract: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch positions on component mount
  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/position/all`);
      setPositions(response.data.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch positions.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.type.trim()) newErrors.type = "Type is required";
    if (!formData.desc.trim()) newErrors.desc = "Description is required";
    if (!formData.mode.trim()) newErrors.mode = "Mode is required";
    if (!formData.contract.trim()) newErrors.contract = "Contract is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingPosition) {
        await axios.put(
          `${baseUrl}/api/position/update/${editingPosition._id}`,
          formData
        );
        Swal.fire("Success", "Position updated successfully!", "success");
      } else {
        await axios.post(`${baseUrl}/api/position/create`, formData);
        Swal.fire("Success", "Position created successfully!", "success");
      }
      fetchPositions();
      resetForm();
    } catch (error) {
      Swal.fire(
        "Error",
        `Failed to ${editingPosition ? "update" : "create"} position.`,
        "error"
      );
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setFormData({
      name: position.name,
      type: position.type,
      desc: position.desc,
      mode: position.mode,
      contract: position.contract,
    });
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
      try {
        await axios.delete(`${baseUrl}/api/position/delete/${id}`);
        Swal.fire("Deleted!", "The position has been deleted.", "success");
        fetchPositions();
      } catch (error) {
        Swal.fire("Error", "Failed to delete position.", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      desc: "",
      mode: "",
      contract: "",
    });
    setEditingPosition(null);
    setErrors({});
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Positions</h1>

      {/* Form Section */}
      <div className="bg-white shadow-md rounded p-4 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingPosition ? "Edit Position" : "Create Position"}
        </h2>
        <form onSubmit={handleCreateOrUpdate}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              placeholder="Type"
              className="w-full p-2 border rounded"
            />
            {errors.type && (
              <span className="text-red-500 text-sm">{errors.type}</span>
            )}
          </div>
          <div className="mb-4">
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            {errors.desc && (
              <span className="text-red-500 text-sm">{errors.desc}</span>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="mode"
              value={formData.mode}
              onChange={handleInputChange}
              placeholder="Mode"
              className="w-full p-2 border rounded"
            />
            {errors.mode && (
              <span className="text-red-500 text-sm">{errors.mode}</span>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="contract"
              value={formData.contract}
              onChange={handleInputChange}
              placeholder="Contract"
              className="w-full p-2 border rounded"
            />
            {errors.contract && (
              <span className="text-red-500 text-sm">{errors.contract}</span>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {editingPosition ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* List of Positions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Loading positions...</p>
        ) : (
          positions.map((position) => (
            <div
              key={position._id}
              className="border p-4 rounded shadow-md bg-white"
            >
              <h3 className="text-xl font-bold">{position.name}</h3>
              <p className="text-gray-600">{position.type}</p>
              <div>{position.desc}</div>
              <p className="text-gray-600">Mode: {position.mode}</p>
              <p className="text-gray-600">Contract: {position.contract}</p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleEdit(position)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(position._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Positions;

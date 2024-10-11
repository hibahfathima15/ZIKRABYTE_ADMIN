import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const OurTeam = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState({
    name: "",
    position: "",
    about: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseUrl}/api/our-team/all-team`);
      if (Array.isArray(response.data)) {
        setTeams(response.data);
      } else {
        throw new Error("Data received is not an array");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      setError("Failed to fetch services. Please try again later.");
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setCurrentTeam({ ...currentTeam, [name]: files[0] });
    } else {
      setCurrentTeam({ ...currentTeam, [name]: value });
    }
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!currentTeam.name.trim()) errors.name = "Name is required";
    if (!currentTeam.about.trim()) errors.about = "About is required";
    if (!currentTeam.position.trim()) errors.position = "Position is required";
    if (!isEditing && !currentTeam.image) errors.image = "Image is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    for (const key in currentTeam) {
      formData.append(key, currentTeam[key]);
    }

    try {
      if (isEditing) {
        await axios.put(
          `${baseUrl}/api/our-team/update-team/${currentTeam._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire("Success", "Team updated successfully!", "success");
      } else {
        await axios.post(`${baseUrl}/api/our-team/create-team`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Team created successfully!", "success");
      }
      fetchTeams();
      resetForm();
    } catch (error) {
      console.error("Error saving teams:", error);
      setError("Failed to save team. Please try again.");
      Swal.fire("Error", "Failed to save team. Please try again.", "error");
    }
  };

  const handleEdit = (team) => {
    setCurrentTeam(team);
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
        await axios.delete(`${baseUrl}/api/our-team/delete-team/${id}`);
        fetchTeams();
        Swal.fire("Deleted!", "Team has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting team:", error);
        setError("Failed to delete team. Please try again.");
        Swal.fire("Error", "Failed to delete team. Please try again.", "error");
      }
    }
  };

  const resetForm = () => {
    setCurrentTeam({
      name: "",
      position: "",
      about: "",
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
        Team Management (Exactly 4 Required)
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
        {showForm ? "Cancel" : "Create New Team"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? "Edit Team" : "Create New Team"}
          </h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={currentTeam.name}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.name ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs italic">{formErrors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="about"
            >
              About
            </label>
            <textarea
              id="about"
              name="about"
              value={currentTeam.about}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.about ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.about && (
              <p className="text-red-500 text-xs italic">
                {formErrors.about}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="position"
            >
              Position
            </label>
            <textarea
              id="position"
              name="position"
              value={currentTeam.position}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.position ? "border-red-500" : ""
              }`}
              required
            />
            {formErrors.position && (
              <p className="text-red-500 text-xs italic">
                {formErrors.position}
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
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isEditing ? "Update Team" : "Create Team"}
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
        <h2 className="text-2xl font-semibold mb-4">Teams List</h2>
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                <p className="text-gray-600 mb-4">{team.about}</p>
                <p className="text-sm text-gray-500 mb-2">Position: {team.position}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleEdit(team)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(team._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No teams found.</p>
        )}
      </div>
    </div>
  );
};

export default OurTeam;

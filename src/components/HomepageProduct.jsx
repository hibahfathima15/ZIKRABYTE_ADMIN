import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const HomepageProduct = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    tags: "",
    title: "",
    description: "",
    initial: "left",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Fetch all projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/homepage-project/projects`
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Handle form submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("tags", formData.tags);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("initial", formData.initial);
    if (selectedImage) data.append("image", selectedImage);

    try {
      if (editingProjectId) {
        // Update existing project
        await axios.put(
          `${baseUrl}/api/homepage-project/projects/${editingProjectId}`,
          data
        );
        Swal.fire("Updated!", "Project has been updated.", "success");
      } else {
        // Create new project
        await axios.post(`${baseUrl}/api/homepage-project/projects`, data);
        Swal.fire("Created!", "Project has been created.", "success");
      }
      resetForm(); // Reset the form fields
      fetchProjects(); // Refresh project list
    } catch (error) {
      console.error("Error saving project", error);
      Swal.fire("Error!", "There was an error saving the project.", "error");
    }
  };

  // Handle delete project
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/api/homepage-project/projects/${id}`);
        Swal.fire("Deleted!", "Project has been deleted.", "success");
        fetchProjects(); // Refresh project list
      } catch (error) {
        console.error("Error deleting project", error);
        Swal.fire(
          "Error!",
          "There was an error deleting the project.",
          "error"
        );
      }
    }
  };

  // Handle edit button click
  const handleEdit = (project) => {
    setFormData({
      tags: project.tags.join(","),
      title: project.title,
      description: project.description,
      initial: project.initial,
    });
    setEditingProjectId(project._id);
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      tags: "",
      title: "",
      description: "",
      initial: "left",
    });
    setSelectedImage(null);
    setEditingProjectId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        HomePage Projects Management (Minimum 4 Required)
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title:
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Tags (comma separated):
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label
            htmlFor="initial"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Initial:
          </label>
          <select
            name="initial"
            value={formData.initial}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image:
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editingProjectId ? "Update Project" : "Create Project"}
        </button>
      </form>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-lg font-bold">All Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="text-lg font-bold mt-2">{project.title}</h3>
              <p>{project.description}</p>
              <p className="text-sm text-gray-600">
                Tags: {project.tags.join(", ")}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(project)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepageProduct;

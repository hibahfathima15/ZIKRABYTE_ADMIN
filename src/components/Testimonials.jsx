import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = process.env.REACT_APP_API_URL;

const TestimonialForm = ({ onSubmit, testimonial, onCancel }) => {
  const [formData, setFormData] = useState({
    name: testimonial?.name || "",
    username: testimonial?.username || "",
    text: testimonial?.text || "",
    role: testimonial?.role || "",
  });
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setErrors({ ...errors, avatar: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.text.trim()) newErrors.text = "Testimonial text is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!testimonial && !avatar) newErrors.avatar = "Avatar is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (avatar) {
        data.append("avatar", avatar);
      }
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-lg">
      <h3 className="text-xl font-semibold mb-4">{testimonial ? "Update Testimonial" : "Create New Testimonial"}</h3>
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-2 border rounded"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}
      </div>
      <div>
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          placeholder="Testimonial text"
          className="w-full p-2 border rounded"
        />
        {errors.text && <p className="text-red-500 text-sm">{errors.text}</p>}
      </div>
      <div>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          className="w-full p-2 border rounded"
        />
        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
      </div>
      <div>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full p-2 border rounded"
        />
        {errors.avatar && (
          <p className="text-red-500 text-sm">{errors.avatar}</p>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {testimonial ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const TestimonialList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseUrl}/api/testimonials/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      setError("Error fetching testimonials. Please try again later.");
      console.error("Error fetching testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await axios.post(`${baseUrl}/api/testimonials/create-testimonials`, data);
      Swal.fire("Success", "Testimonial created successfully!", "success");
      fetchTestimonials();
    } catch (error) {
      Swal.fire("Error", "Failed to create testimonial. Please try again.", "error");
      console.error("Error creating testimonial:", error);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await axios.put(`${baseUrl}/api/testimonials/update-testimonials/${id}`, data);
      Swal.fire("Success", "Testimonial updated successfully!", "success");
      fetchTestimonials();
      setEditingTestimonial(null);
    } catch (error) {
      Swal.fire("Error", "Failed to update testimonial. Please try again.", "error");
      console.error("Error updating testimonial:", error);
    }
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
        await axios.delete(`${baseUrl}/api/testimonials/delete-testimonials/${id}`);
        Swal.fire("Deleted!", "The testimonial has been deleted.", "success");
        fetchTestimonials();
      } catch (error) {
        Swal.fire("Error", "Failed to delete testimonial. Please try again.", "error");
        console.error("Error deleting testimonial:", error);
      }
    }
  };

  if (isLoading) return <p>Loading testimonials...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      {/* Form Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Testimonials (Minimum 4 Required)</h2>
        <TestimonialForm onSubmit={handleCreate} onCancel={() => {}} />
      </div>

      {/* Testimonial Grid */}
      <div>
        <h2 className="text-3xl font-bold mb-4">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="border p-4 rounded shadow-md bg-white">
              {editingTestimonial === testimonial._id ? (
                <TestimonialForm
                  onSubmit={(data) => handleUpdate(testimonial._id, data)}
                  testimonial={testimonial}
                  onCancel={() => setEditingTestimonial(null)}
                />
              ) : (
                <>
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mb-4"
                  />
                  <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-600">@{testimonial.username}</p>
                  <p className="my-2 text-gray-700">{testimonial.text}</p>
                  <p className="text-gray-600">{testimonial.role}</p>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => setEditingTestimonial(testimonial._id)}
                      className="px-4 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="px-4 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialList;

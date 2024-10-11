import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminPanel = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    id: "",
    title: "",
    date: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/achievements/get-achievements`
      );
      setAchievements(response.data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewAchievement({ ...newAchievement, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${baseUrl}/api/achievements/update-achievements/${editingId}`,
          newAchievement
        );
        Swal.fire("Success", "Achievement updated successfully!", "success");
      } else {
        await axios.post(
          `${baseUrl}/api/achievements/create-achievements`,
          newAchievement
        );
        Swal.fire("Success", "Achievement created successfully!", "success");
      }
      fetchAchievements();
      setNewAchievement({ id: "", title: "", date: "", description: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving achievement:", error);
      Swal.fire("Error", "There was an issue saving the achievement.", "error");
    }
  };

  const handleEdit = (achievement) => {
    setNewAchievement(achievement);
    setEditingId(achievement._id);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the achievement permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${baseUrl}/api/achievements/delete-achievements/${id}`
          );
          fetchAchievements();
          Swal.fire("Deleted", "Achievement has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting achievement:", error);
          Swal.fire(
            "Error",
            "There was an issue deleting the achievement.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - Achievements</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          name="id"
          value={newAchievement.id}
          onChange={handleInputChange}
          placeholder="Number Start with 00"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          name="title"
          value={newAchievement.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={newAchievement.date}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={newAchievement.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="w-full p-2 mb-2 border rounded"
          required
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingId ? "Update Achievement" : "Add Achievement"}
        </button>
      </form>

      <div>
        <h2 className="text-2xl font-bold mb-4">Achievements List</h2>
        {achievements.map((achievement) => (
          <div key={achievement._id} className="border p-4 mb-4 rounded">
            <h3 className="text-xl font-semibold">{achievement.title}</h3>
            <p className="text-gray-600">{achievement.number}</p>
            <p className="text-gray-600">{achievement.date}</p>
            <p>{achievement.description}</p>
            <div className="mt-2">
              <button
                onClick={() => handleEdit(achievement)}
                className="bg-yellow-500 text-white p-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(achievement._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Privacy = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [privacyPolicies, setPrivacyPolicies] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState({ id: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPrivacyPolicies();
  }, []);

  const fetchPrivacyPolicies = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/contact/get-privacy`);
      setPrivacyPolicies(response.data);
    } catch (error) {
      console.error("Error fetching privacy policies:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPolicy({ ...currentPolicy, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updatePrivacyPolicy();
    } else {
      await createPrivacyPolicy();
    }
    resetForm();
    fetchPrivacyPolicies();
  };

  const createPrivacyPolicy = async () => {
    try {
      await axios.post(`${baseUrl}/api/contact/privacy`, {
        content: currentPolicy.content,
      });
      Swal.fire("Success", "Privacy policy created successfully!", "success");
    } catch (error) {
      console.error("Error creating privacy policy:", error);
      Swal.fire("Error", "Failed to create privacy policy.", "error");
    }
  };

  const updatePrivacyPolicy = async () => {
    try {
      await axios.put(`${baseUrl}/api/contact/privacy/${currentPolicy.id}`, {
        content: currentPolicy.content,
      });
      Swal.fire("Success", "Privacy policy updated successfully!", "success");
    } catch (error) {
      console.error("Error updating privacy policy:", error);
      Swal.fire("Error", "Failed to update privacy policy.", "error");
    }
  };

  const handleEdit = (policy) => {
    setCurrentPolicy({ id: policy._id, content: policy.content });
    setIsEditing(true);
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
        await axios.delete(`${baseUrl}/api/contact/privacy/${id}`);
        fetchPrivacyPolicies();
        Swal.fire(
          "Deleted!",
          "Your privacy policy has been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting privacy policy:", error);
        Swal.fire("Error", "Failed to delete privacy policy.", "error");
      }
    }
  };

  const resetForm = () => {
    setCurrentPolicy({ id: "", content: "" });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy (Exactly 1)</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          name="content"
          value={currentPolicy.content}
          onChange={handleChange}
          placeholder="Enter privacy policy content"
          rows="4"
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
        >
          {isEditing ? "Update Policy" : "Add Policy"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="mt-2 ml-2 bg-gray-500 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4">Existing Policies</h2>
      <ul>
        {privacyPolicies.map((policy) => (
          <li key={policy._id} className="mb-4 border p-4">
            <p>{policy.content}</p>
            <button
              onClick={() => handleEdit(policy)}
              className="mr-2 text-blue-500"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(policy._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Privacy;

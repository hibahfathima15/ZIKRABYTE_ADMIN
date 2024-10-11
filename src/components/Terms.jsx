import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Terms = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [termsConditions, setTermsConditions] = useState([]);
  const [currentTerm, setCurrentTerm] = useState({ id: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTermsConditions();
  }, []);

  const fetchTermsConditions = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/contact/get-terms`);
      setTermsConditions(response.data);
    } catch (error) {
      console.error('Error fetching terms and conditions:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTerm({ ...currentTerm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateTermsConditions();
    } else {
      await createTermsConditions();
    }
    resetForm();
    fetchTermsConditions();
  };

  const createTermsConditions = async () => {
    try {
      await axios.post(`${baseUrl}/api/contact/terms`, { content: currentTerm.content });
      Swal.fire('Success', 'Terms and conditions created successfully!', 'success');
    } catch (error) {
      console.error('Error creating terms and conditions:', error);
      Swal.fire('Error', 'Failed to create terms and conditions.', 'error');
    }
  };

  const updateTermsConditions = async () => {
    try {
      await axios.put(`${baseUrl}/api/contact/terms/${currentTerm.id}`, { content: currentTerm.content });
      Swal.fire('Success', 'Terms and conditions updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating terms and conditions:', error);
      Swal.fire('Error', 'Failed to update terms and conditions.', 'error');
    }
  };

  const handleEdit = (term) => {
    setCurrentTerm({ id: term._id, content: term.content });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/api/contact/terms/${id}`);
        fetchTermsConditions();
        Swal.fire('Deleted!', 'Your terms and conditions have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting terms and conditions:', error);
        Swal.fire('Error', 'Failed to delete terms and conditions.', 'error');
      }
    }
  };

  const resetForm = () => {
    setCurrentTerm({ id: '', content: '' });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions (Exactly 1)</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          name="content"
          value={currentTerm.content}
          onChange={handleChange}
          placeholder="Enter terms and conditions content"
          rows="4"
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
          {isEditing ? 'Update Terms' : 'Add Terms'}
        </button>
        <button type="button" onClick={resetForm} className="mt-2 ml-2 bg-gray-500 text-white py-2 px-4 rounded">
          Cancel
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4">Existing Terms and Conditions</h2>
      <ul>
        {termsConditions.map((term) => (
          <li key={term._id} className="mb-4 border p-4">
            <p>{term.content}</p>
            <button onClick={() => handleEdit(term)} className="mr-2 text-blue-500">
              Edit
            </button>
            <button onClick={() => handleDelete(term._id)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Terms;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';

const Review = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    text: '',
    name: '',
    company: '',
    country: '',
    ratings: { quality: 0, schedule: 0, cost: 0, willingToRefer: 0 }
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/review/get-review`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('ratings.')) {
      const ratingName = name.split('.')[1];
      setNewReview(prev => ({
        ...prev,
        ratings: {
          ...prev.ratings,
          [ratingName]: Math.min(Math.max(Number(value), 0), 5)
        }
      }));
    } else {
      setNewReview(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`${baseUrl}/api/review/update-review/${editReviewId}`, newReview);
        Swal.fire('Updated!', 'The review has been updated.', 'success');
      } else {
        await axios.post(`${baseUrl}/api/review/create-review`, newReview);
        Swal.fire('Created!', 'The review has been created.', 'success');
      }
      fetchReviews();
      resetForm();
    } catch (error) {
      Swal.fire('Error', `There was an error ${isEditMode ? 'updating' : 'creating'} the review.`, 'error');
    }
  };

  const handleEdit = (review) => {
    setNewReview(review);
    setIsEditMode(true);
    setEditReviewId(review._id);
  };

  const resetForm = () => {
    setNewReview({
      text: '',
      name: '',
      company: '',
      country: '',
      ratings: { quality: 0, schedule: 0, cost: 0, willingToRefer: 0 }
    });
    setIsEditMode(false);
    setEditReviewId(null);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/api/review/delete-review/${id}`);
          Swal.fire('Deleted!', 'The review has been deleted.', 'success');
          fetchReviews();
        } catch (error) {
          Swal.fire('Error', 'There was an error deleting the review.', 'error');
        }
      }
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar key={index} className={`inline-block ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-6">
      Client Reviews
    </h1>
      
      <form onSubmit={handleSubmit} className="mb-12 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="text">
            Review Text
          </label>
          <textarea
            name="text"
            value={newReview.text}
            onChange={handleInputChange}
            placeholder="Share your experience"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newReview.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={newReview.company}
              onChange={handleInputChange}
              placeholder="Your company"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={newReview.country}
            onChange={handleInputChange}
            placeholder="Your country"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          {['quality', 'schedule', 'cost', 'willingToRefer'].map((rating) => (
            <div key={rating} className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`ratings.${rating}`}>
                {rating.charAt(0).toUpperCase() + rating.slice(1)} (0-5)
              </label>
              <input
                type="number"
                name={`ratings.${rating}`}
                value={newReview.ratings[rating]}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                max="5"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isEditMode ? 'Update Review' : 'Add Review'}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <p className="text-gray-700 text-base mb-4">{review.text}</p>
              <p className="font-bold text-xl mb-2">{review.name}</p>
              <p className="text-gray-600 text-sm mb-2">{review.company}</p>
              <p className="text-gray-500 text-xs mb-4">{review.country}</p>
              <div className="mb-4">
                {Object.entries(review.ratings).map(([key, value]) => (
                  <div key={key} className="flex items-center mb-1">
                    <span className="text-gray-700 text-sm w-32">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                    <div className="ml-2">{renderStars(value)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => handleEdit(review)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                <FaEdit className="inline-block mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(review._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                <FaTrash className="inline-block mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
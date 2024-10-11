import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactUs = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyData, setReplyData] = useState({
    contactId: "",
    replyMessage: "",
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/contact-us/contact-us`);
      setSubmissions(response.data.contacts);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch submissions");
      setLoading(false);
    }
  };

  const handleReply = (contactId) => {
    setReplyData({ ...replyData, contactId });
  };

  const sendReply = async () => {
    try {
      await axios.post(`${baseUrl}/api/contact-us/contact-us/reply`, replyData);
      alert("Reply sent successfully");
      setReplyData({ contactId: "", replyMessage: "" });
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Company Name
              </th>
              <th scope="col" className="px-6 py-3">
                Website URL
              </th>
              <th scope="col" className="px-6 py-3">
                Project Details
              </th>
              <th scope="col" className="px-6 py-3">
                Help Type
              </th>
              <th scope="col" className="px-6 py-3">
                Budget
              </th>
              <th scope="col" className="px-6 py-3">
                Complexity
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr
                key={submission._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {submission.name}
                </td>
                <td className="px-6 py-4">{submission.email}</td>
                <td className="px-6 py-4">{submission.companyName}</td>
                <td className="px-6 py-4">{submission.websiteUrl}</td>
                <td className="px-6 py-4">{submission.projectDetails.substring(0, 50)}...</td>
                <td className="px-6 py-4">{submission.helpType}</td>
                <td className="px-6 py-4">
                  {submission.budget}
                </td>
                <td className="px-6 py-4">
                  {submission.complexity}
                </td>
                <td className="px-6 py-4">
                  {new Date(submission.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleReply(submission._id)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {replyData.contactId && (
        <div className="mt-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Reply to Message
          </h2>
          <textarea
            value={replyData.replyMessage}
            onChange={(e) =>
              setReplyData({ ...replyData, replyMessage: e.target.value })
            }
            placeholder="Type your reply here..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
          />
          <button
            onClick={sendReply}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            Send Reply
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactUs;

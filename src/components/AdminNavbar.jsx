import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaBell, FaUser } from "react-icons/fa";

const AdminNavbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-600 focus:outline-none mr-4"
          >
            <FaBars size={24} />
          </button>
          <Link to="/admin" className="text-xl font-bold text-gray-800">
            Admin Panel
          </Link>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <button className="flex items-center focus:outline-none">
              <FaUser size={20} className="text-gray-500 mr-2" />
              <span className="text-gray-700">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
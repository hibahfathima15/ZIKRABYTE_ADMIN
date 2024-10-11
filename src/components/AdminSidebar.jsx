import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaProjectDiagram, 
  FaCogs, 
  FaBuilding, 
  FaBoxes, 
  FaQuoteRight,
  FaUserTie,
  FaShieldAlt,
  FaFileContract,
  FaEnvelope,
  FaUsers,
  FaAddressBook,
  FaStar
} from "react-icons/fa";
import { MdMiscellaneousServices } from "react-icons/md";
import { BsFillChatQuoteFill } from "react-icons/bs";

const AdminSidebar = ({ isOpen }) => {
  const [activeItem, setActiveItem] = useState(null);

  const sidebarItems = [
    {
      name: "HomePage",
      icon: <FaHome className="text-xl text-white" />,
      subLinks: [
        {
          name: "HomePage Projects",
          icon: <FaProjectDiagram />,
          path: "/admin/homepage-products",
        },
        {
          name: "HomePage Services",
          icon: <MdMiscellaneousServices />,
          path: "/admin/homepage-services",
        },
        {
          name: "Companies",
          icon: <FaBuilding />,
          path: "/admin/companies",
        },
        {
          name: "Products",
          icon: <FaBoxes />,
          path: "/admin/products",
        },
        {
          name: "Testimonials",
          icon: <FaQuoteRight />,
          path: "/admin/testimonials",
        },
      ],
    },
    {
      name: "Services",
      icon: <FaCogs className="text-xl text-white" />,
      subLinks: [
        { name: "Services", icon: <MdMiscellaneousServices />, path: "/admin/services" },
        {
          name: "Services Contact Form",
          icon: <FaEnvelope />,
          path: "/admin/services-contact",
        },
      ],
    },
    {
      name: "Positions",
      icon: <FaUserTie />,
      path: "/admin/positions",
    },
    {
      name: "Privacy Policy",
      icon: <FaShieldAlt />,
      path: "/admin/policy",
    },
    {
      name: "Terms and Conditions",
      icon: <FaFileContract />,
      path: "/admin/terms",
    },
    {
      name: "Contact Form",
      icon: <FaEnvelope />,
      path: "/admin/contact",
    },
    {
      name: "Career Team",
      icon: <FaUsers />,
      path: "/admin/career-team",
    },
    {
      name: "Contact Us",
      icon: <FaAddressBook />,
      path: "/admin/contact-us",
    },
    {
      name: "Our Team",
      icon: <FaUsers />,
      path: "/admin/team",
    },
    {
      name: "Client Review",
      icon: <FaStar />,
      path: "/admin/review",
    },
    {
      name: "Our Achievements",
      icon: <FaStar />,
      path: "/admin/achievements",
    },
    {
      name: "Case Studies",
      icon: <FaStar />,
      path: "/admin/case-studies",
    },
  ];

  const handleToggle = (index) => {
    setActiveItem(activeItem === index ? null : index);
  };

  return (
    <aside
      className={`bg-gray-800 text-white pb-16 w-64 h-full z-50 overflow-y-auto no-scrollbar fixed transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <nav className="p-4">
        <ul>
          {sidebarItems.map((item, index) => (
            <li key={index} className="mb-2">
              {item.subLinks ? (
                <>
                  <div
                    onClick={() => handleToggle(index)}
                    className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </div>
                  {activeItem === index && (
                    <ul className="ml-4">
                      {item.subLinks.map((subLink, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subLink.path}
                            className="flex items-center p-2 hover:bg-gray-600 rounded"
                          >
                            {subLink.icon}
                            <span className="ml-2">{subLink.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center p-2 hover:bg-gray-700 rounded"
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
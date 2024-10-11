import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import Services from "./Services";
import ServicesContactForm from "./ServicesContactForm";
import Products from "./Products";
import Companies from "./Companies";
import HomepageService from "./HomepageService";
import HomepageProduct from "./HomepageProduct";
import Testimonials from "./Testimonials";
import Positions from "./Positions";
import Privacy from "./Privacy";
import Terms from "./Terms";
import Contact from "./Contact";
import CareerTeam from "./CareerTeam";
import ContactUs from "./ContactUs";
import OurTeam from "./OurTeam";
import Review from "./Review";
import Achievements from "./Achievements";
import CaseStudies from "./CaseStudies";

const Homepage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex flex-col bg-gray-100 h-screen">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <div className="flex flex-1">
          {/* Sidebar */}
          <AdminSidebar isOpen={isSidebarOpen} />

          {/* Main content area */}
          <main
            className={`transition-all duration-300 ease-in-out flex-1 ml-0 ${
              isSidebarOpen ? "ml-64" : ""
            }`}
            style={{ overflowY: "auto", height: "calc(100vh - 64px)" }} // Adjust the height based on your Navbar height
          >
            <div className="p-4">
              <Routes>
                <Route path="/admin/services" element={<Services />} />
                <Route
                  path="/admin/services-contact"
                  element={<ServicesContactForm />}
                />
                <Route path="/admin/products" element={<Products />} />
                <Route path="/admin/companies" element={<Companies />} />
                <Route
                  path="/admin/homepage-services"
                  element={<HomepageService />}
                />
                <Route
                  path="/admin/homepage-products"
                  element={<HomepageProduct />}
                />
                <Route path="/admin/testimonials" element={<Testimonials />} />
                <Route path="/admin/positions" element={<Positions />} />
                <Route path="/admin/policy" element={<Privacy />} />
                <Route path="/admin/terms" element={<Terms />} />
                <Route path="/admin/contact" element={<Contact />} />
                <Route path="/admin/career-team" element={<CareerTeam />} />
                <Route path="/admin/contact-us" element={<ContactUs />} />
                <Route path="/admin/team" element={<OurTeam />} />
                <Route path="/admin/review" element={<Review />} />
                <Route path="/admin/achievements" element={<Achievements />} />
                <Route path="/admin/case-studies" element={<CaseStudies />} />

                {/* Add more routes as needed */}
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default Homepage;

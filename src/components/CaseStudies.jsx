import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CaseStudies = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [projects, setProjects] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [formData, setFormData] = useState({
    projectId: "",
    caseBanner: { targetWord: "", description: "", imageUrl: null },
    challenge: { title: "", description: "", tags: "" },
    explorePage: { image: null },
    rebranding: {
      sectionTitle: "",
      logoTitle: "",
      mainDescription: "",
      sideDescriptions: "",
    },
    rebrandingWithImage: {
      title: "",
      subtitle: "",
      description: "",
      image: null,
    },
    outcome: { title: "", description: "", images: [null, null, null, null] },
  });

  useEffect(() => {
    fetchProjects();
    fetchCaseStudies();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/homepage-project/projects`
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      showAlert("error", "Failed to fetch projects");
    }
  };

  const fetchCaseStudies = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/case-studies/case-studies`
      );
      setCaseStudies(response.data);
    } catch (error) {
      console.error("Error fetching case studies:", error);
      showAlert("error", "Failed to fetch case studies");
    }
  };

  const handleChange = (e, section, field, index) => {
    const { value, files } = e.target;
    setFormData((prev) => {
      const newState = { ...prev };
      if (section === "outcome" && field === "images") {
        newState[section][field][index] = files[0] || prev[section][field][index];
      } else if (files) {
        newState[section][field] = files[0];
      } else {
        newState[section][field] = value;
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    let caseStudyData = {
      projectId: formData.projectId,
      caseBanner: {
        targetWord: formData.caseBanner.targetWord,
        description: formData.caseBanner.description,
        imageUrl: formData.caseBanner.imageUrl, // Include existing image URL
      },
      challenge: formData.challenge,
      explorePage: {
        image: formData.explorePage.image, // Include existing image URL
      },
      rebranding: formData.rebranding,
      rebrandingWithImage: {
        title: formData.rebrandingWithImage.title,
        subtitle: formData.rebrandingWithImage.subtitle,
        description: formData.rebrandingWithImage.description,
        image: formData.rebrandingWithImage.image, // Include existing image URL
      },
      outcome: {
        title: formData.outcome.title,
        description: formData.outcome.description,
        images: formData.outcome.images, // Include existing image URLs
      },
    };

    // If updating, merge with existing data
    if (selectedCaseStudy) {
      caseStudyData = { ...selectedCaseStudy, ...caseStudyData };
    }

    data.append("caseStudy", JSON.stringify(caseStudyData));

    // Append file data only if a new file is selected
    if (formData.caseBanner.imageUrl instanceof File)
      data.append("caseBanner.image", formData.caseBanner.imageUrl);
    if (formData.explorePage.image instanceof File)
      data.append("explorePage.image", formData.explorePage.image);
    if (formData.rebrandingWithImage.image instanceof File)
      data.append("rebrandingWithImage.image", formData.rebrandingWithImage.image);
    formData.outcome.images.forEach((image, index) => {
      if (image instanceof File) data.append(`outcome.images`, image);
    });

    try {
      let response;
      if (selectedCaseStudy) {
        response = await axios.put(
          `${baseUrl}/api/case-studies/case-studies/${selectedCaseStudy._id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire("Success", "Case Study updated successfully!", "success");
      } else {
        // ... (create new case study code remains the same)
      }
      resetForm();
      fetchCaseStudies();
    } catch (error) {
      console.error("Error saving case study:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to save case study", "error");
    }
  };

  const handleEdit = (caseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setFormData({
      projectId: caseStudy.projectId,
      caseBanner: {
        targetWord: caseStudy.caseBanner?.targetWord || "",
        description: caseStudy.caseBanner?.description || "",
        imageUrl: caseStudy.caseBanner?.imageUrl || null,
      },
      challenge: {
        title: caseStudy.challenge?.title || "",
        description: caseStudy.challenge?.description || "",
        tags: caseStudy.challenge?.tags || "",
      },
      explorePage: { 
        image: caseStudy.explorePage?.image || null 
      },
      rebranding: {
        sectionTitle: caseStudy.rebranding?.sectionTitle || "",
        logoTitle: caseStudy.rebranding?.logoTitle || "",
        mainDescription: caseStudy.rebranding?.mainDescription || "",
        sideDescriptions: caseStudy.rebranding?.sideDescriptions || "",
      },
      rebrandingWithImage: {
        title: caseStudy.rebrandingWithImage?.title || "",
        subtitle: caseStudy.rebrandingWithImage?.subtitle || "",
        description: caseStudy.rebrandingWithImage?.description || "",
        image: caseStudy.rebrandingWithImage?.image || null,
      },
      outcome: {
        title: caseStudy.outcome?.title || "",
        description: caseStudy.outcome?.description || "",
        images: caseStudy.outcome?.images || [null, null, null, null],
      },
    });
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
        await axios.delete(`${baseUrl}/api/case-studies/case-studies/${id}`);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Case study has been deleted.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        fetchCaseStudies();
      } catch (error) {
        console.error("Error deleting case study:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to delete case study",
        });
      }
    }
  };

  const resetForm = () => {
    setSelectedCaseStudy(null);
    setFormData({
      projectId: "",
      caseBanner: { targetWord: "", description: "", imageUrl: null },
      challenge: { title: "", description: "", tags: "" },
      explorePage: { image: null },
      rebranding: {
        sectionTitle: "",
        logoTitle: "",
        mainDescription: "",
        sideDescriptions: "",
      },
      rebrandingWithImage: {
        title: "",
        subtitle: "",
        description: "",
        image: null,
      },
      outcome: { title: "", description: "", images: [null, null, null, null] },
    });
  };

  const showAlert = (icon, text) => {
    Swal.fire({
      icon: icon,
      title: text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Case Studies Management</h1>

      {/* Case Studies List */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Existing Case Studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseStudies.map((study) => (
            <div key={study._id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">
                {study.caseBanner.targetWord}
              </h3>
              <p className="text-gray-600 mb-4">{study.challenge.title}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(study)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(study._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <h2 className="text-2xl font-semibold mb-6">
          {selectedCaseStudy ? "Edit Case Study" : "Create New Case Study"}
        </h2>

        {/* Project Selection */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="project"
          >
            Project
          </label>
          <select
            id="project"
            value={formData.projectId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, projectId: e.target.value }))
            }
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        {/* Case Banner Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Case Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="targetWord"
              >
                Target Word
              </label>
              <input
                id="targetWord"
                type="text"
                placeholder="Target Word"
                value={formData.caseBanner.targetWord}
                onChange={(e) => handleChange(e, "caseBanner", "targetWord")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="bannerDescription"
              >
                Description
              </label>
              <textarea
                id="bannerDescription"
                placeholder="Description"
                value={formData.caseBanner.description}
                onChange={(e) => handleChange(e, "caseBanner", "description")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="bannerImage"
            >
              Banner Image
            </label>
            <input
              id="bannerImage"
              type="file"
              onChange={(e) => handleChange(e, "caseBanner", "imageUrl")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {/* Challenge Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Challenge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="challengeTitle"
              >
                Title
              </label>
              <input
                id="challengeTitle"
                type="text"
                placeholder="Title"
                value={formData.challenge.title}
                onChange={(e) => handleChange(e, "challenge", "title")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="challengeDescription"
              >
                Description
              </label>
              <textarea
                id="challengeDescription"
                placeholder="Description"
                value={formData.challenge.description}
                onChange={(e) => handleChange(e, "challenge", "description")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="challengeTags"
            >
              Tags
            </label>
            <input
              id="challengeTags"
              type="text"
              placeholder="Tags (comma-separated)"
              value={formData.challenge.tags}
              onChange={(e) => handleChange(e, "challenge", "tags")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {/* Explore Page Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Explore Page</h3>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="explorePageImage"
            >
              Explore Page Image
            </label>
            <input
              id="explorePageImage"
              type="file"
              onChange={(e) => handleChange(e, "explorePage", "image")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {/* Rebranding Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Rebranding</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="rebrandingSectionTitle"
              >
                Section Title
              </label>
              <input
                id="rebrandingSectionTitle"
                type="text"
                placeholder="Section Title"
                value={formData.rebranding.sectionTitle}
                onChange={(e) => handleChange(e, "rebranding", "sectionTitle")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="rebrandingLogoTitle"
              >
                Logo Title
              </label>
              <input
                id="rebrandingLogoTitle"
                type="text"
                placeholder="Logo Title"
                value={formData.rebranding.logoTitle}
                onChange={(e) => handleChange(e, "rebranding", "logoTitle")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="rebrandingMainDescription"
            >
              Main Description
            </label>
            <textarea
              id="rebrandingMainDescription"
              placeholder="Main Description"
              value={formData.rebranding.mainDescription}
              onChange={(e) => handleChange(e, "rebranding", "mainDescription")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="rebrandingSideDescriptions"
            >
              Side Descriptions
            </label>
            <textarea
              id="rebrandingSideDescriptions"
              placeholder="Side Descriptions (comma-separated)"
              value={formData.rebranding.sideDescriptions}
              onChange={(e) =>
                handleChange(e, "rebranding", "sideDescriptions")
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {/* Rebranding with Image Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Rebranding with Image</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="rebrandingWithImageTitle"
              >
                Title
              </label>
              <input
                id="rebrandingWithImageTitle"
                type="text"
                placeholder="Title"
                value={formData.rebrandingWithImage.title}
                onChange={(e) =>
                  handleChange(e, "rebrandingWithImage", "title")
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="rebrandingWithImageSubtitle"
              >
                Subtitle
              </label>
              <input
                id="rebrandingWithImageSubtitle"
                type="text"
                placeholder="Subtitle"
                value={formData.rebrandingWithImage.subtitle}
                onChange={(e) =>
                  handleChange(e, "rebrandingWithImage", "subtitle")
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="rebrandingWithImageDescription"
            >
              Description
            </label>
            <textarea
              id="rebrandingWithImageDescription"
              placeholder="Description"
              value={formData.rebrandingWithImage.description}
              onChange={(e) =>
                handleChange(e, "rebrandingWithImage", "description")
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="rebrandingWithImageImage"
            >
              Image
            </label>
            <input
              id="rebrandingWithImageImage"
              type="file"
              onChange={(e) => handleChange(e, "rebrandingWithImage", "image")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {/* Outcome Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Outcome</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="outcomeTitle"
              >
                Title
              </label>
              <input
                id="outcomeTitle"
                type="text"
                placeholder="Title"
                value={formData.outcome.title}
                onChange={(e) => handleChange(e, "outcome", "title")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="outcomeDescription"
              >
                Description
              </label>
              <textarea
                id="outcomeDescription"
                placeholder="Description"
                value={formData.outcome.description}
                onChange={(e) => handleChange(e, "outcome", "description")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Outcome Images
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index}>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleChange(e, "outcome", "images", index)
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {selectedCaseStudy ? "Update Case Study" : "Create Case Study"}
          </button>
          {selectedCaseStudy && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CaseStudies;

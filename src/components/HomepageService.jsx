import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

const HomepageService = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [services, setServices] = useState([]);
  const [brandingCards, setBrandingCards] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    buttonText: "",
    features: [],
    image: null,
  });
  const [newBrandingCard, setNewBrandingCard] = useState({
    title: "",
    description: "",
    buttonText: "",
    image: null,
  });
  const [editingService, setEditingService] = useState(null);
  const [editingBrandingCard, setEditingBrandingCard] = useState(null);
  const [newFeature, setNewFeature] = useState("");
  const [errors, setErrors] = useState({});
  const serviceFileInputRef = useRef(null);
  const brandingCardFileInputRef = useRef(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/homepage-service/service-cards`
      );
      const data = await response.json();
      setServices(data.services);
      setBrandingCards(data.brandingCards);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Failed to fetch data. Please try again.", "error");
    }
  };

  const validateForm = (data, type) => {
    const errors = {};
    if (!data.title.trim()) errors.title = "Title is required";
    if (!data.description.trim())
      errors.description = "Description is required";
    if (!data.buttonText.trim()) errors.buttonText = "Button text is required";
    if (type === "service" && data.features.length === 0)
      errors.features = "At least one feature is required";
    if (!data.image) errors.image = "Image is required";
    return errors;
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleBrandingCardChange = (e) => {
    const { name, value } = e.target;
    setNewBrandingCard({ ...newBrandingCard, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleServiceImageChange = (e) => {
    setNewService({ ...newService, image: e.target.files[0] });
    setErrors({ ...errors, image: "" });
  };

  const handleBrandingCardImageChange = (e) => {
    setNewBrandingCard({ ...newBrandingCard, image: e.target.files[0] });
    setErrors({ ...errors, image: "" });
  };

  const addService = async () => {
    const validationErrors = validateForm(newService, "service");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("title", newService.title);
    formData.append("description", newService.description);
    formData.append("buttonText", newService.buttonText);
    formData.append("features", newService.features.join(","));
    formData.append("image", newService.image);

    try {
      const response = await fetch(`${baseUrl}/api/homepage-service/services`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        Swal.fire("Success", "Service added successfully!", "success");
        fetchServices();
        setNewService({
          title: "",
          description: "",
          buttonText: "",
          features: [],
          image: null,
        });
        if (serviceFileInputRef.current) {
          serviceFileInputRef.current.value = "";
        }
      } else {
        Swal.fire("Error", "Failed to add service. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      Swal.fire("Error", "Failed to add service. Please try again.", "error");
    }
  };

  const addBrandingCard = async () => {
    const validationErrors = validateForm(newBrandingCard, "brandingCard");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append("title", newBrandingCard.title);
    formData.append("description", newBrandingCard.description);
    formData.append("buttonText", newBrandingCard.buttonText);
    formData.append("image", newBrandingCard.image);

    try {
      const response = await fetch(
        `${baseUrl}/api/homepage-service/branding-cards`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        Swal.fire("Success", "Branding card added successfully!", "success");
        fetchServices();
        setNewBrandingCard({
          title: "",
          description: "",
          buttonText: "",
          image: null,
        });
        if (brandingCardFileInputRef.current) {
          brandingCardFileInputRef.current.value = "";
        }
      } else {
        Swal.fire(
          "Error",
          "Failed to add branding card. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error adding branding card:", error);
      Swal.fire(
        "Error",
        "Failed to add branding card. Please try again.",
        "error"
      );
    }
  };

  const updateService = async (id) => {
    const formData = new FormData();
    formData.append("title", editingService.title);
    formData.append("description", editingService.description);
    formData.append("buttonText", editingService.buttonText);
    formData.append("features", editingService.features.join(","));
    if (editingService.image instanceof File) {
      formData.append("image", editingService.image);
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/homepage-service/services/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (response.ok) {
        Swal.fire("Success", "Service updated successfully!", "success");
        fetchServices();
        setEditingService(null);
      }
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const updateBrandingCard = async (id) => {
    const formData = new FormData();
    formData.append("title", editingBrandingCard.title);
    formData.append("description", editingBrandingCard.description);
    formData.append("buttonText", editingBrandingCard.buttonText);
    if (editingBrandingCard.image instanceof File) {
      formData.append("image", editingBrandingCard.image);
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/homepage-service/branding-cards/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (response.ok) {
        Swal.fire("Success", "Branding card updated successfully!", "success");
        fetchServices();
        setEditingBrandingCard(null);
      }
    } catch (error) {
      console.error("Error updating branding card:", error);
    }
  };

  const deleteService = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${baseUrl}/api/homepage-service/services/${id}`, {
            method: "DELETE",
          });
          Swal.fire("Deleted!", "Service has been deleted.", "success");
          fetchServices();
        } catch (error) {
          console.error("Error deleting service:", error);
        }
      }
    });
  };

  const deleteBrandingCard = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${baseUrl}/api/homepage-service/branding-cards/${id}`, {
            method: "DELETE",
          });
          Swal.fire("Deleted!", "Branding card has been deleted.", "success");
          fetchServices();
        } catch (error) {
          console.error("Error deleting branding card:", error);
        }
      }
    });
  };

  const addFeature = () => {
    if (newFeature.trim() !== "") {
      if (editingService) {
        setEditingService({
          ...editingService,
          features: [...editingService.features, newFeature.trim()],
        });
      } else {
        setNewService({
          ...newService,
          features: [...newService.features, newFeature.trim()],
        });
      }
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        if (editingService) {
          const updatedFeatures = [...editingService.features];
          updatedFeatures.splice(index, 1);
          setEditingService({ ...editingService, features: updatedFeatures });
        } else {
          const updatedFeatures = [...newService.features];
          updatedFeatures.splice(index, 1);
          setNewService({ ...newService, features: updatedFeatures });
        }
        Swal.fire("Removed!", "Feature has been removed.", "success");
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Homepage Services</h1>

      {/* Services Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Services(Exactly 2 Required)
        </h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <input
            type="text"
            name="title"
            placeholder="Service Title"
            value={editingService ? editingService.title : newService.title}
            onChange={
              editingService
                ? (e) =>
                    setEditingService({
                      ...editingService,
                      title: e.target.value,
                    })
                : handleServiceChange
            }
            className={`w-full mb-2 px-3 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mb-2">{errors.title}</p>
          )}
          <textarea
            name="description"
            placeholder="Service Description"
            value={
              editingService
                ? editingService.description
                : newService.description
            }
            onChange={
              editingService
                ? (e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                : handleServiceChange
            }
            className={`w-full mb-2 px-3 py-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mb-2">{errors.description}</p>
          )}
          <input
            type="text"
            name="buttonText"
            placeholder="Button Text"
            value={
              editingService ? editingService.buttonText : newService.buttonText
            }
            onChange={
              editingService
                ? (e) =>
                    setEditingService({
                      ...editingService,
                      buttonText: e.target.value,
                    })
                : handleServiceChange
            }
            className={`w-full mb-2 px-3 py-2 border ${
              errors.buttonText ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.buttonText && (
            <p className="text-red-500 text-sm mb-2">{errors.buttonText}</p>
          )}
          <input
            type="file"
            name="image"
            onChange={
              editingService
                ? (e) =>
                    setEditingService({
                      ...editingService,
                      image: e.target.files[0],
                    })
                : handleServiceImageChange
            }
            className={`w-full mb-2 px-3 py-2 border ${
              errors.image ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            ref={serviceFileInputRef}
          />
          {errors.image && (
            <p className="text-red-500 text-sm mb-2">{errors.image}</p>
          )}
          <div className="mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addFeature}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              Add Feature
            </button>
          </div>
          {errors.features && (
            <p className="text-red-500 text-sm mb-2">{errors.features}</p>
          )}
          <ul className="mb-4">
            {(editingService
              ? editingService.features
              : newService.features
            ).map((feature, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md mb-2"
              >
                <span>{feature}</span>
                <button
                  onClick={() => removeFeature(index)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {editingService ? (
            <div>
              <button
                onClick={() => updateService(editingService._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 mr-2"
              >
                Update Service
              </button>
              <button
                onClick={() => setEditingService(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={addService}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add Service
            </button>
          )}
        </div>
      </div>

      {/* Display Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="mb-2">
                <strong>Button:</strong> {service.buttonText}
              </p>
              <p className="mb-4">
                <strong>Features:</strong> {service.features.join(", ")}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => setEditingService(service)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteService(service._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Branding Cards Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Branding Cards(Minimum 3 Required)
        </h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <input
            type="text"
            name="title"
            placeholder="Branding Card Title"
            value={
              editingBrandingCard
                ? editingBrandingCard.title
                : newBrandingCard.title
            }
            onChange={
              editingBrandingCard
                ? (e) =>
                    setEditingBrandingCard({
                      ...editingBrandingCard,
                      title: e.target.value,
                    })
                : handleBrandingCardChange
            }
            className={`w-full mb-2 px-3 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mb-2">{errors.title}</p>
          )}
          <textarea
            name="description"
            placeholder="Branding Card Description"
            value={
              editingBrandingCard
                ? editingBrandingCard.description
                : newBrandingCard.description
            }
            onChange={
              editingBrandingCard
                ? (e) =>
                    setEditingBrandingCard({
                      ...editingBrandingCard,
                      description: e.target.value,
                    })
                : handleBrandingCardChange
            }
            className={`w-full mb-2 px-3 py-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mb-2">{errors.description}</p>
          )}
          <input
            type="text"
            name="buttonText"
            placeholder="Button Text"
            value={
              editingBrandingCard
                ? editingBrandingCard.buttonText
                : newBrandingCard.buttonText
            }
            onChange={
              editingBrandingCard
                ? (e) =>
                    setEditingBrandingCard({
                      ...editingBrandingCard,
                      buttonText: e.target.value,
                    })
                : handleBrandingCardChange
            }
            className={`w-full mb-2 px-3 py-2 border ${
              errors.buttonText ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.buttonText && (
            <p className="text-red-500 text-sm mb-2">{errors.buttonText}</p>
          )}
          <input
            type="file"
            name="image"
            onChange={
              editingBrandingCard
                ? (e) =>
                    setEditingBrandingCard({
                      ...editingBrandingCard,
                      image: e.target.files[0],
                    })
                : handleBrandingCardImageChange
            }
            className={`w-full mb-2 px-3 py-2 border ${
              errors.image ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.image && (
            <p className="text-red-500 text-sm mb-2">{errors.image}</p>
          )}
          {editingBrandingCard ? (
            <div>
              <button
                onClick={() => updateBrandingCard(editingBrandingCard._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 mr-2"
              >
                Update Branding Card
              </button>
              <button
                onClick={() => setEditingBrandingCard(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={addBrandingCard}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add Branding Card
            </button>
          )}
        </div>
      </div>

      {/* Display Branding Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandingCards.map((card) => (
          <div
            key={card._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <p className="mb-4">
                <strong>Button:</strong> {card.buttonText}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => setEditingBrandingCard(card)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBrandingCard(card._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomepageService;

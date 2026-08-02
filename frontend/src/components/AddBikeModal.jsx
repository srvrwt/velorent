import { useState } from "react";
import { addBike } from "../services/bikeService";

function AddBikeModal({
  onClose,
  onSuccess,
}) {

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const [formData, setFormData] = useState({
    bikeName: "",
    brand: "",
    model: "",
    category: "",
    description: "",

    registrationNumber: "",

    addressLine: "",
    city: "",
    district: "",
    state: "",
    pincode: "",

    mobileNumber: "",

    pricePerHour: "",
    pricePerDay: "",
    securityDeposit: "",
  });

  const [files, setFiles] = useState({
    frontImage: null,
    backImage: null,
    leftImage: null,
    rightImage: null,
    rcDocument: null,
    idProof: null,
  });




  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;

    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0],
    }));
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  // ==========================================
  // VALIDATE ALL 4 BIKE IMAGES
  // ==========================================

  const requiredImages = [
    {
      key: "frontImage",
      label: "Front bike image",
    },
    {
      key: "backImage",
      label: "Back bike image",
    },
    {
      key: "leftImage",
      label: "Left side bike image",
    },
    {
      key: "rightImage",
      label: "Right side bike image",
    },
  ];

  for (const image of requiredImages) {
    if (!files[image.key]) {
      setError(`${image.label} is required`);
      return;
    }
  }

  // ==========================================
  // VALIDATE DOCUMENTS
  // ==========================================

  if (!files.rcDocument) {
    setError("RC document is required");
    return;
  }

  if (!files.idProof) {
    setError("ID proof is required");
    return;
  }

  setLoading(true);

  try {
    const data = new FormData();

    // ==========================================
    // ADD TEXT FIELDS
    // ==========================================

    Object.entries(formData).forEach(
      ([key, value]) => {
        data.append(key, value);
      }
    );

    // ==========================================
    // ADD BIKE IMAGES
    // ==========================================

    data.append(
      "frontImage",
      files.frontImage
    );

    data.append(
      "backImage",
      files.backImage
    );

    data.append(
      "leftImage",
      files.leftImage
    );

    data.append(
      "rightImage",
      files.rightImage
    );

    // ==========================================
    // ADD DOCUMENTS
    // ==========================================

    data.append(
      "rcDocument",
      files.rcDocument
    );

    data.append(
      "idProof",
      files.idProof
    );

    // ==========================================
    // DEBUG - CHECK FILES BEFORE SUBMIT
    // ==========================================

    console.log(
      "Front Image:",
      files.frontImage
    );

    console.log(
      "Back Image:",
      files.backImage
    );

    console.log(
      "Left Image:",
      files.leftImage
    );

    console.log(
      "Right Image:",
      files.rightImage
    );

    console.log(
      "RC Document:",
      files.rcDocument
    );

    console.log(
      "ID Proof:",
      files.idProof
    );

    // ==========================================
    // SUBMIT
    // ==========================================

    const response = await addBike(data);

    console.log(
      "Bike submitted:",
      response
    );

    alert(
      "Bike submitted successfully for admin approval"
    );

    if (onSuccess) {
      onSuccess(response.bike);
    }

    onClose();

  } catch (error) {

    console.error(
      "Add Bike Error:",
      error
    );

    console.error(
      "Server Response:",
      error.response?.data
    );

    setError(
      error.response?.data?.message ||
      "Failed to submit bike"
    );

  } finally {

    setLoading(false);

  }
};

  return (

    <div className="modal-overlay">

      <div className="modal">


        {/* HEADER */}

        <div className="modal-header">

          <div>

            <h2>
              List Your Bike
            </h2>

            <p>
              Submit your bike for admin approval
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* ERROR */}

        {error && (

          <div className="form_error">

            {error}

          </div>

        )}


        <form
          onSubmit={
            handleSubmit
          }
        >


          {/* ================================= */}
          {/* BIKE DETAILS */}
          {/* ================================= */}

  
          <div className="form_grid">

            <input
              name="bikeName"
              placeholder="Bike Name"
              value={
                formData.bikeName
              }
              onChange={
                handleChange
              }
            />


            <input
              name="brand"
              placeholder="Brand"
              value={
                formData.brand
              }
              onChange={
                handleChange
              }
            />


            <input
              name="model"
              placeholder="Model"
              value={
                formData.model
              }
              onChange={
                handleChange
              }
            />


            <h3>
              Bike Images
            </h3>

            <div className="form_grid">

              <div>
                <label>
                  Front Image
                </label>

                <input
                  type="file"
                  name="frontImage"
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                />
              </div>


              <div>
                <label>
                  Back Image
                </label>

                <input
                  type="file"
                  name="backImage"
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                />
              </div>


              <div>
                <label>
                  Left Image
                </label>

                <input
                  type="file"
                  name="leftImage"
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                />
              </div>


              <div>
                <label>
                  Right Image
                </label>

                <input
                  type="file"
                  name="rightImage"
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                />
              </div>

            </div>

            <select
              name="category"
              value={
                formData.category
              }
              onChange={
                handleChange
              }
            >

              <option value="">
                Select Category
              </option>

              <option value="scooter">
                Scooter
              </option>

              <option value="motorcycle">
                Motorcycle
              </option>

              <option value="electric">
                Electric Bike
              </option>

              <option value="sports">
                Sports Bike
              </option>

            </select>

          </div>


          <textarea
            name="description"
            placeholder="Describe your bike..."
            value={
              formData.description
            }
            onChange={
              handleChange
            }
          />


          {/* ================================= */}
          {/* BIKE IMAGES */}
          {/* ================================= */}

          <h3>
            Bike Images
          </h3>

          <p>
            Add minimum 4 images
          </p>




          {/* ================================= */}
          {/* RC */}
          {/* ================================= */}

          <h3>
            Registration Details
          </h3>


          <input
            name="registrationNumber"
            placeholder="Bike RC / Registration Number"
            value={
              formData.registrationNumber
            }
            onChange={
              handleChange
            }
          />


          {/* ================================= */}
          {/* ADDRESS */}
          {/* ================================= */}

          <h3>
            Bike Location
          </h3>


          <input
            name="addressLine"
            placeholder="Complete Address"
            value={
              formData.addressLine
            }
            onChange={
              handleChange
            }
          />


          <div className="form_grid">

            <input
              name="city"
              placeholder="City"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
            />


            <input
              name="district"
              placeholder="District"
              value={
                formData.district
              }
              onChange={
                handleChange
              }
            />


            <input
              name="state"
              placeholder="State"
              value={
                formData.state
              }
              onChange={
                handleChange
              }
            />


            <input
              name="pincode"
              placeholder="Pincode"
              value={
                formData.pincode
              }
              onChange={
                handleChange
              }
            />

          </div>


          {/* ================================= */}
          {/* CONTACT */}
          {/* ================================= */}

          <h3>
            Contact
          </h3>


          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={
              formData.mobileNumber
            }
            onChange={
              handleChange
            }
          />


          {/* ================================= */}
          {/* PRICE */}
          {/* ================================= */}

          <h3>
            Rental Pricing
          </h3>


          <div className="form_grid">

            <input
              type="number"
              name="pricePerHour"
              placeholder="Price per Hour ₹"
              value={
                formData.pricePerHour
              }
              onChange={
                handleChange
              }
            />


            <input
              type="number"
              name="pricePerDay"
              placeholder="Price per Day ₹"
              value={
                formData.pricePerDay
              }
              onChange={
                handleChange
              }
            />


            <input
              type="number"
              name="securityDeposit"
              placeholder="Security Deposit ₹"
              value={
                formData.securityDeposit
              }
              onChange={
                handleChange
              }
            />

          </div>


          {/* ================================= */}
          {/* DOCUMENTS */}
          {/* ================================= */}

          <h3>
            Documents
          </h3>


          <div>
            <label>RC Document</label>

            <input
              type="file"
              name="rcDocument"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label>ID Proof</label>

            <input
              type="file"
              name="idProof"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>


          {/* ================================= */}
          {/* BUTTONS */}
          {/* ================================= */}

          <div className="modal_buttons">

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Submitting..."
                : "Submit Bike"}

            </button>

          </div>


        </form>

      </div>

    </div>

  );

}

export default AddBikeModal;
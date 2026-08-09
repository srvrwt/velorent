import { useState, useEffect } from "react";
import { addBike } from "../services/bikeService";
import InputField from "../components/InputField";
import FormButton from "../components/FormButton";

const STEPS = [
  { id: 1, label: "Bike Details" },
  { id: 2, label: "Registration & Documents" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Address & Contact" },
];

// Popular bike/scooter brands available in India
const BIKE_BRANDS = [
  "Hero MotoCorp",
  "Honda",
  "Bajaj",
  "TVS",
  "Royal Enfield",
  "Yamaha",
  "Suzuki",
  "KTM",
  "Jawa",
  "Yezdi",
  "Mahindra",
  "Harley-Davidson",
  "Triumph",
  "Ducati",
  "Kawasaki",
  "BMW Motorrad",
  "Aprilia",
  "Benelli",
  "CFMoto",
  "Husqvarna",
  "Vespa",
  "Piaggio",
  "MV Agusta",
  "Indian Motorcycle",
  "Moto Guzzi",
  "UM Motorcycles",
  "Ather Energy",
  "Ola Electric",
  "Bounce",
  "Revolt Motors",
  "Okinawa",
  "Ampere",
  "Hero Electric",
  "PURE EV",
  "Bgauss",
];

function AddBikeModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastError, setToastError] = useState("");

  // NEW: tracks which fields are currently invalid -> { fieldName: true }
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    bikeName: "",
    brand: "",
    model: "",
    category: "",
    description: "",
    registrationNumber: "",
    addressLine: "",
    city: "",
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

  useEffect(() => {
    if (!toastError) return;
    const timer = setTimeout(() => setToastError(""), 3000);
    return () => clearTimeout(timer);
  }, [toastError]);

  function handleFileChange(e) {
    const { name, files: selectedFiles } = e.target;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));

    // clear the error highlight as soon as the user fixes it
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  // STEP VALIDATION — now returns both a toast message AND a map of bad fields
  function validateStep(currentStep) {
    const errors = {};
    let message = "";

    function fail(field, msg) {
      errors[field] = true;
      if (!message) message = msg;
    }

    if (currentStep === 1) {
      if (!formData.bikeName.trim()) fail("bikeName", "Bike name is required");
      if (!formData.brand.trim() || formData.brand === "Other")
        fail("brand", "Please select or enter a brand");
      if (!formData.model.trim()) fail("model", "Model is required");
      if (!formData.category) fail("category", "Please select a category");

      const requiredImages = [
        { key: "frontImage", label: "Front bike image" },
        { key: "backImage", label: "Back bike image" },
        { key: "leftImage", label: "Left side bike image" },
        { key: "rightImage", label: "Right side bike image" },
      ];

      for (const image of requiredImages) {
        if (!files[image.key]) fail(image.key, `${image.label} is required`);
      }
    }

    if (currentStep === 2) {
      if (!formData.registrationNumber.trim())
        fail("registrationNumber", "Registration number is required");
      if (!files.rcDocument) fail("rcDocument", "RC document is required");
      if (!files.idProof) fail("idProof", "ID proof is required");
    }

    if (currentStep === 3) {
      if (!formData.pricePerHour) fail("pricePerHour", "Price per hour is required");
      if (!formData.pricePerDay) fail("pricePerDay", "Price per day is required");
      if (!formData.securityDeposit) fail("securityDeposit", "Security deposit is required");
    }

    if (currentStep === 4) {
      if (!formData.addressLine.trim()) fail("addressLine", "Address is required");
      if (!formData.city.trim()) fail("city", "City is required");
      if (!formData.state.trim()) fail("state", "State is required");
      if (!formData.pincode.trim()) fail("pincode", "Pincode is required");

      if (!formData.mobileNumber.trim()) {
        fail("mobileNumber", "Mobile number is required");
      } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
        fail("mobileNumber", "Enter a valid 10-digit mobile number");
      }
    }

    return { message, errors };
  }

  function handleNext() {
    const { message, errors } = validateStep(step);
    setFieldErrors(errors);

    if (message) {
      setToastError(message);
      return;
    }

    setStep((prev) => Math.min(prev + 1, STEPS.length));
  }

  function handleBack() {
    setToastError("");
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function goToStep(targetStep) {
    if (targetStep >= step) return;
    setToastError("");
    setStep(targetStep);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { message, errors } = validateStep(4);
    setFieldErrors(errors);

    if (message) {
      setToastError(message);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append("frontImage", files.frontImage);
      data.append("backImage", files.backImage);
      data.append("leftImage", files.leftImage);
      data.append("rightImage", files.rightImage);
      data.append("rcDocument", files.rcDocument);
      data.append("idProof", files.idProof);

      console.log("--- FormData being sent ---");
      for (let pair of data.entries()) {
        console.log(pair[0], ":", pair[1]);
      }
      const response = await addBike(data);

      if (onSuccess) onSuccess(response.bike);
      onClose();
    } catch (error) {
      console.error("Add Bike Error:", error);
      console.error("Server Response:", error.response?.data);

      setToastError(
        error.response?.data?.message || "Failed to submit bike. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // small helper so JSX stays clean
  const errClass = (name) => (fieldErrors[name] ? "required" : "");

  // whether the brand select should show "Other" (i.e. brand is empty, custom, or explicitly "Other")
  const isCustomBrand =
    formData.brand !== "" && !BIKE_BRANDS.includes(formData.brand);

  return (
    <div className="form_container modal-overlay pd_fixed">
      <div className="modal_wrap">
        {toastError && (
          <div className="toast toast_error flex gap_xsm align_center justify_center">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
              <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
            </svg>
            {toastError}
          </div>
        )}

        <div className="form_wrap modal modal-large radius">
          <div className="modal-header flex gap_sm align_center space_between">
            <h3 className="color_green font_large">List Your Bike</h3>
            <button type="button" className="modal_close" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--text-dark)"><path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z"></path></svg>
            </button>
          </div>

          <p className="mt_xsm para_xsm color_light font_xsmall">
            Submit your bike for admin approval.
          </p>

          <div className="step_bar flex align_center justify_center mt_sm">
            {STEPS.map((s, index) => {
              const isCompleted = s.id < step;
              const isActive = s.id === step;
              return (
                <div className="step_bar_item flex align_center" key={s.id}>
                  <div
                    className={
                      "step_bar_dot flex align_center justify_center " +
                      (isCompleted ? "step_completed " : "") +
                      (isActive ? "step_active" : "")
                    }
                    onClick={() => goToStep(s.id)}
                  >
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                      </svg>
                    ) : (
                      s.id
                    )}
                  </div>
                  <span className={"step_bar_label " + (isActive ? "color_green" : "color_light")}>
                    {s.label}
                  </span>
                  {index < STEPS.length - 1 && (
                    <div className={"step_bar_line " + (isCompleted ? "step_line_filled" : "")} />
                  )}
                </div>
              );
            })}
          </div>

          <form className="bike_form" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form_step">
                <InputField
                  label="Bike Name"
                  type="text"
                  name="bikeName"
                  placeholder="Enter bike name"
                  value={formData.bikeName}
                  onChange={handleChange}
                  className={errClass("bikeName")}
                />

                <div className="input_group">
                  <label htmlFor="brand">Brand</label>
                  <select
                    id="brand"
                    name="brand"
                    value={isCustomBrand ? "Other" : formData.brand}
                    onChange={handleChange}
                    className={errClass("brand")}
                  >
                    <option value="">Select Brand</option>
                    {BIKE_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>

                {(formData.brand === "Other" || isCustomBrand) && (
                  <InputField
                    label="Enter Brand Name"
                    type="text"
                    name="brand"
                    placeholder="Type brand name"
                    value={formData.brand === "Other" ? "" : formData.brand}
                    onChange={handleChange}
                    className={errClass("brand")}
                  />
                )}

                <InputField
                  label="Model"
                  type="text"
                  name="model"
                  placeholder="Enter model"
                  value={formData.model}
                  onChange={handleChange}
                  className={errClass("model")}
                />

                <div className="input_group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errClass("category")}
                  >
                    <option value="">Select Category</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Sports Bike">Sports Bike</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Naked Bike">Naked Bike</option>
                    <option value="Touring Bike">Touring Bike</option>
                    <option value="Adventure Bike">Adventure Bike</option>
                    <option value="Dirt Bike">Dirt Bike</option>
                    <option value="Cafe Racer">Cafe Racer</option>
                    <option value="Scrambler">Scrambler</option>
                    <option value="Commuter Bike">Commuter Bike</option>
                    <option value="Electric Bike">Electric Bike</option>
                    <option value="Electric Scooter">Electric Scooter</option>
                    <option value="Off Road">Off-Road Bike</option>
                    <option value="Dual Sport">Dual Sport</option>
                    <option value="Superbike">Superbike</option>
                    <option value="Moped">Moped</option>
                  </select>
                </div>

                <div className="input_group">
                  <label htmlFor="frontImage">Front Image</label>
                  <input
                    id="frontImage"
                    type="file"
                    name="frontImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={errClass("frontImage")}
                  />
                </div>

                <div className="input_group">
                  <label htmlFor="backImage">Back Image</label>
                  <input
                    id="backImage"
                    type="file"
                    name="backImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={errClass("backImage")}
                  />
                </div>

                <div className="input_group">
                  <label htmlFor="leftImage">Left Image</label>
                  <input
                    id="leftImage"
                    type="file"
                    name="leftImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={errClass("leftImage")}
                  />
                </div>

                <div className="input_group">
                  <label htmlFor="rightImage">Right Image</label>
                  <input
                    id="rightImage"
                    type="file"
                    name="rightImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={errClass("rightImage")}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form_step">
                <InputField
                  label="Registration Number"
                  type="text"
                  name="registrationNumber"
                  placeholder="Enter registration number"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className={errClass("registrationNumber")}
                />

                <div className="input_group">
                  <label htmlFor="rcDocument">RC Document</label>
                  <input
                    id="rcDocument"
                    type="file"
                    name="rcDocument"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className={errClass("rcDocument")}
                  />
                </div>

                <div className="input_group">
                  <label htmlFor="idProof">ID Proof</label>
                  <input
                    id="idProof"
                    type="file"
                    name="idProof"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className={errClass("idProof")}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form_step">
                <InputField
                  label="Price per Hour (₹)"
                  type="number"
                  name="pricePerHour"
                  placeholder="Enter price per hour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className={errClass("pricePerHour")}
                />

                <InputField
                  label="Price per Day (₹)"
                  type="number"
                  name="pricePerDay"
                  placeholder="Enter price per day"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  className={errClass("pricePerDay")}
                />

                <InputField
                  label="Security Deposit (₹)"
                  type="number"
                  name="securityDeposit"
                  placeholder="Enter security deposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  className={errClass("securityDeposit")}
                />
              </div>
            )}

            {step === 4 && (
              <div className="form_step">
                <InputField
                  label="Address"
                  type="text"
                  name="addressLine"
                  placeholder="Enter address"
                  value={formData.addressLine}
                  onChange={handleChange}
                  className={errClass("addressLine")}
                />
                <InputField
                  label="City"
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errClass("city")}
                />
                <InputField
                  label="State"
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errClass("state")}
                />
                <InputField
                  label="Pincode"
                  type="text"
                  name="pincode"
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={errClass("pincode")}
                />
                <InputField
                  label="Mobile Number"
                  type="tel"
                  name="mobileNumber"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={errClass("mobileNumber")}
                />

                <div className="input_group">
                  <label htmlFor="description">Note / Additional Information</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe your bike..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            )}

            <div className="flex gap_sm justify_center modal_footer">
              {step === 1 ? (
                <button type="button" className="btn_danger" onClick={onClose}>
                  Cancel
                </button>
              ) : (
                <button type="button" className="btn_danger" onClick={handleBack}>
                  Back
                </button>
              )}

              {step < STEPS.length ? (
                <button type="button" className="btn_primary" onClick={handleNext}>
                  Next
                </button>
              ) : (
                <FormButton text={loading ? "Submitting..." : "Submit Bike"} disabled={loading} />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBikeModal;
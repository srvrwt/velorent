import { useState } from "react";

function AdminBikeDetailsModal({
  bike,
  onClose,
  onApprove,
  onReject,
}) {
  const [activeImage, setActiveImage] = useState(0);

  if (!bike) {
    return null;
  }


  // BACKEND URL


  const API_URL = "http://localhost:5000";



  // HELPER
  // Convert backend relative URL to full URL


  const getFileUrl = (filePath) => {
    if (!filePath) {
      return "";
    }

    // Already a complete URL
    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    // Backend relative path
    return `${API_URL}${filePath}`;
  };



  // BIKE IMAGES
  // Backend:
  //
  // images: {
  //   front: "/uploads/bikes/front.webp",
  //   back: "/uploads/bikes/back.webp",
  //   left: "/uploads/bikes/left.webp",
  //   right: "/uploads/bikes/right.webp"
  // }


  const imageList = [
    {
      label: "Front",
      path: bike.images?.front,
    },
    {
      label: "Back",
      path: bike.images?.back,
    },
    {
      label: "Left",
      path: bike.images?.left,
    },
    {
      label: "Right",
      path: bike.images?.right,
    },
  ].filter((image) => image.path);


  // Convert image paths to full URLs
  const images = imageList.map((image) => ({
    label: image.label,
    url: getFileUrl(image.path),
  }));


  // Fallback image
  const finalImages =
    images.length > 0
      ? images
      : [
        {
          label: "Bike",
          url: "/placeholder-bike.jpg",
        },
      ];



  // IMAGE SLIDER


  const showPrev = () => {
    setActiveImage((prev) =>
      prev === 0
        ? finalImages.length - 1
        : prev - 1
    );
  };


  const showNext = () => {
    setActiveImage((prev) =>
      prev === finalImages.length - 1
        ? 0
        : prev + 1
    );
  };



  // DOCUMENTS
  //
  // Backend:
  //
  // documents: {
  //   rc: "/uploads/documents/rc.jpg",
  //   idProof: "/uploads/documents/id-proof.jpg"
  // }


  const documents = [
    bike.documents?.rc && {
      name: "Registration Certificate (RC)",
      path: bike.documents.rc,
    },

    bike.documents?.idProof && {
      name: "ID Proof",
      path: bike.documents.idProof,
    },
  ].filter(Boolean);



  // CHECK IF DOCUMENT IS IMAGE


  const isImageDocument = (filePath) => {
    return /\.(jpg|jpeg|png|webp)$/i.test(
      filePath
    );
  };



  // RENDER


  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div className="modal_wrap radius">
        <div
          className="modal-content modal modal-large"
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          {/* = */}
          {/* MAIN BODY */}
          {/* = */}

          <div className="bike-modal-body flex gap_md">


            {/* = */}
            {/* LEFT: BIKE IMAGES */}
            {/* = */}

            <div className="bike-modal-images flex_1">

              <div className="image-slider">

                {/* MAIN IMAGE */}

                <img
                  src={
                    finalImages[activeImage].url
                  }
                  alt={
                    `${bike.bikeName || "Bike"} - ${finalImages[activeImage].label
                    }`
                  }
                  className="image-slider-main"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/placeholder-bike.jpg";
                  }}
                />


                {/* PREVIOUS BUTTON */}

                {finalImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="slider-arrow slider-arrow-left"
                      onClick={showPrev}
                      aria-label="Previous image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>

                    </button>


                    {/* NEXT BUTTON */}

                    <button
                      type="button"
                      className="slider-arrow slider-arrow-right"
                      onClick={showNext}
                      aria-label="Next image"
                    >


                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
                    </button>


                    {/* COUNTER */}

                    <div className="slider-counter">
                      {activeImage + 1} /{" "}
                      {finalImages.length}
                    </div>
                  </>
                )}

              </div>


              {/* = */}
              {/* IMAGE THUMBNAILS */}
              {/* = */}

              {finalImages.length > 1 && (
                <div className="image-thumbnails">

                  {finalImages.map(
                    (image, index) => (
                      <button
                        type="button"
                        key={image.label}
                        className={
                          `thumbnail ${index === activeImage
                            ? "active"
                            : ""
                          }`
                        }
                        onClick={() =>
                          setActiveImage(index)
                        }
                      >

                        <img
                          src={image.url}
                          alt={
                            `${image.label} view`
                          }
                          onError={(e) => {
                            e.currentTarget.src =
                              "/placeholder-bike.jpg";
                          }}
                        />

                      </button>
                    )
                  )}

                </div>
              )}

            </div>


            {/* = */}
            {/* RIGHT: DETAILS */}
            {/* = */}

            <div className="bike-modal-details flex_1">


              {/* = */}
              {/* HEADER */}
              {/* = */}

              <div className="modal-header flex align_center space_between">

                <h2 className="color_green">
                  Bike Request Details
                </h2>

                <button
                  className="modal-close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--text-dark)"><path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z"></path></svg>
                </button>

              </div>


              {/* = */}
              {/* BIKE NAME + STATUS */}
              {/* = */}

              <div className="detail-section mt_xsm flex align_center space_between">

                <h3>
                  {bike.bikeName ||
                    "Untitled Bike"}
                </h3>

                <span
                  className={`badge ${bike.status}`}
                >
                  {bike.status}
                </span>

              </div>


              {/* = */}
              {/* REJECTION REASON */}
              {/* = */}

              {bike.status === "rejected" &&
                bike.rejectionReason && (
                  <p className="rejection-note color_light font_small">
                    Rejection reason:{" "}
                    {bike.rejectionReason}
                  </p>
                )}


              {/* = */}
              {/* BIKE INFORMATION */}
              {/* = */}

              <div className="detail-section mt_sm border_top pt_sm ">

                <h4 className="weight_medium">Bike Information</h4>

                <div className="detail-grid">

                  <div>
                    <span className="detail-value font_small color_light">
                      Brand
                    </span>

                    <span className="detail-value font_small">
                      {bike.brand || "-"}
                    </span>
                  </div>


                  <div>
                    <span className="detail-value font_small color_light">
                      Model
                    </span>

                    <span className="detail-value font_small">
                      {bike.model || "-"}
                    </span>
                  </div>


                  <div>
                    <span className="detail-value font_small color_light">
                      Category
                    </span>

                    <span className="detail-value font_small">
                      {bike.category || "-"}
                    </span>
                  </div>


                  <div>
                    <span className="detail-value font_small color_light">
                      Registration No.
                    </span>

                    <span className="detail-value font_small">
                      {bike.registrationNumber ||
                        "-"}
                    </span>
                  </div>


                  <div>
                    <span className="detail-value font_small color_light">
                      Price / Hour
                    </span>

                    <span className="detail-value font_small">
                      ₹
                      {bike.pricePerHour ??
                        "-"}
                    </span>
                  </div>


                  <div>
                    <span className="detail-value font_small color_light">
                      Price / Day
                    </span>

                    <span className="detail-value font_small">
                      ₹
                      {bike.pricePerDay ??
                        "-"}
                    </span>
                  </div>


                  <div>
                    <span className="detail-value font_small color_light">
                      Security Deposit
                    </span>

                    <span className="detail-value font_small">
                      ₹
                      {bike.securityDeposit ??
                        "-"}
                    </span>
                  </div>

                </div>

              </div>


              {/* = */}
              {/* LOCATION */}
              {/* = */}

                 <div className="detail-section mt_sm border_top pt_sm ">

                <h4 className="weight_medium">Address</h4>

              <div className="detail-grid">

                <div className="span_2">
                  <span className="detail-value font_small color_light">
                    Address
                  </span>

                  <span className="detail-value font_small">
                    {bike.address?.addressLine || "-"}
                  </span>
                </div>

                <div className="span_2">
                  <span className="detail-value font_small color_light">
                    City
                  </span>

                  <span className="detail-value font_small">
                    {bike.address?.city || "-"}
                  </span>
                </div>

                <div className="span_2">
                  <span className="detail-value font_small color_light">
                    State
                  </span>

                  <span className="detail-value font_small">
                    {bike.address?.state || "-"}
                  </span>
                </div>

                <div className="span_2">
                  <span className="detail-value font_small color_light">
                    Pincode
                  </span>

                  <span className="detail-value font_small">
                    {bike.address?.pincode || "-"}
                  </span>
                </div>

              </div>
              </div>


              {/* = */}
              {/* OWNER INFORMATION */}
              {/* = */}

              <div className="detail-section mt_sm border_top pt_sm">

                <h4 className="weight_medium">Owner Information</h4>

                <div className="detail-grid">

                  <div className="span_2">
                    <span className="detail-value font_small color_light">
                      Name
                    </span>

                    <span className="detail-value font_small">
                      {bike.owner?.name ||
                        "Unknown"}
                    </span>
                  </div>

       <div className="span_2">
                    <span className="detail-value font_small color_light">
                      Phone
                    </span>

                    <span className="detail-value font_small">
                      {bike.mobileNumber ||
                        "-"}
                    </span>
                  </div>

                  <div className="span_2">
                    <span className="detail-value font_small color_light">
                      Email
                    </span>

                    <span className="detail-value font_small">
                      {bike.owner?.email ||
                        "-"}
                    </span>
                  </div>


           

                </div>

              </div>


              {/* = */}
              {/* DOCUMENTS */}
              {/* = */}

              <div className="detail-section mt_sm border_top pt_sm">

                <h4 className="weight_medium">Documents</h4>


                {documents.length > 0 ? (

                  <div className="document-list">

                    {documents.map(
                      (document) => {

                        const documentUrl =
                          getFileUrl(
                            document.path
                          );


                        return (
                          <div
                            className="document-item flex align_center gap_sm space_between mt_xsm"
                            key={document.name}
                          >

                            <span className="detail-value font_small color_light">
                              {document.name}
                            </span>


                            {/* DOCUMENT IMAGE PREVIEW 
                          {isImageDocument(
                            document.path
                          ) && (
                            <img
                              src={
                                documentUrl
                              }
                              alt={
                                document.name
                              }
                              className="document-preview"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          )}
*/}


                            {/* OPEN DOCUMENT */}

                            <a
                              href={
                                documentUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="color_green border_bottom"
                            >
                              View Document
                            </a>

                          </div>
                        );
                      }
                    )}

                  </div>

                ) : (

                  <p className="color_light font_small">
                    No documents uploaded
                  </p>

                )}

              </div>


              {/* = */}
              {/* DESCRIPTION */}
              {/* = */}

              <div className="detail-section mt_sm border_top pt_sm">

                <h4 className="weight_medium">
                  Note / Additional Information
                </h4>

                {bike.description ? (

                  <p className="detail-description mt_xsm color_light font_small">
                    {bike.description}
                  </p>

                ) : (

                  <p className="color_light font_small">
                    No description provided
                  </p>

                )}

              </div>


              {/* = */}
              {/* ADMIN ACTIONS */}
              {/* = */}

              {bike.status === "pending" && (

                <div className="flex gap_sm justify_center modal_footer mt_sm">



                  <button
                    className="button button-reject btn_danger "
                    onClick={onReject}
                  >
                    Reject
                  </button>

                  <button
                    className="button button-approve"
                    onClick={onApprove}
                  >
                    Approve
                  </button>



                </div>

              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminBikeDetailsModal;
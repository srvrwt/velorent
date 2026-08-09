import { useEffect, useState } from "react";

import {
  getAllBikes,
  approveBike,
  rejectBike,
} from "../../services/adminService";

import AdminBikeDetailsModal from "../../components/AdminBikeDetailsModal"; // ^ adjust this path to wherever your modal component actually lives
// ^ adjust this path to wherever your modal component actually lives


function Bikes() {

  const [bikes, setBikes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedBike, setSelectedBike] =
    useState(null);

  const [showBikeModal, setShowBikeModal] =
    useState(false);


  // ==========================================
  // GET ALL BIKES
  // ==========================================

  const loadBikes = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await getAllBikes();

      console.log(
        "ALL BIKES RESPONSE:",
        response
      );

      // Make sure response is an array
      if (Array.isArray(response)) {

        setBikes(response);

      } else {

        console.error(
          "Expected array but received:",
          response
        );

        setBikes([]);

      }

    } catch (error) {

      console.error(
        "GET BIKES ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        "Failed to load bikes"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {

    loadBikes();

  }, []);


  // ==========================================
  // APPROVE BIKE
  // ==========================================

  const handleApprove = async (id) => {

    try {

      const response =
        await approveBike(id);

      console.log(
        "APPROVED BIKE:",
        response
      );


      // Update UI immediately

      setBikes((prevBikes) =>

        prevBikes.map((bike) =>

          bike._id === id

            ? {
              ...bike,
              status: "approved",
              rejectionReason: "",
            }

            : bike

        )

      );

    } catch (error) {

      console.error(
        "APPROVE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to approve bike"
      );

    }

  };


  // ==========================================
  // REJECT BIKE
  // ==========================================

  const handleReject = async (id) => {

    const reason =
      window.prompt(
        "Enter rejection reason:"
      );


    if (reason === null) {
      return;
    }


    try {

      const response =
        await rejectBike(
          id,
          reason
        );


      console.log(
        "REJECTED BIKE:",
        response
      );


      // Update UI immediately

      setBikes((prevBikes) =>

        prevBikes.map((bike) =>

          bike._id === id

            ? {
              ...bike,
              status: "rejected",
              rejectionReason:
                reason,
            }

            : bike

        )

      );

    } catch (error) {

      console.error(
        "REJECT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to reject bike"
      );

    }

  };

  // ==========================================
  // STATS FOR OVERVIEW CARDS
  // ==========================================

  const totalBikes = bikes.length;

  const pendingCount = bikes.filter(
    (bike) => bike.status === "pending"
  ).length;

  const approvedCount = bikes.filter(
    (bike) => bike.status === "approved"
  ).length;

  const rejectedCount = bikes.filter(
    (bike) => bike.status === "rejected"
  ).length;



  // ==========================================
  // SEARCH + STATUS FILTER
  // ==========================================

  const filteredBikes = bikes.filter(
    (bike) => {

      const searchText =
        search.toLowerCase();


      const matchesSearch =

        bike.bikeName
          ?.toLowerCase()
          .includes(searchText)

        ||

        bike.brand
          ?.toLowerCase()
          .includes(searchText)

        ||

        bike.model
          ?.toLowerCase()
          .includes(searchText)

        ||

        bike.owner?.name
          ?.toLowerCase()
          .includes(searchText)

        ||

        bike.owner?.email
          ?.toLowerCase()
          .includes(searchText);


      const matchesStatus =

        statusFilter === "all"

        ||

        bike.status ===
        statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    }
  );


  function handleViewBike(bike) {
    setSelectedBike(bike);

    setShowBikeModal(true);
  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="admin-page">

        <h2>
          Loading bikes...
        </h2>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="admin-page">

        <h2>
          {error}
        </h2>


        <button
          className="button"
          onClick={loadBikes}
        >
          Try Again
        </button>

      </div>

    );

  }


  return (

    <div className="admin-page">


      {/* PAGE HEADER */}

      <div className="admin-page-header flex align_bottom space_between gap_sm">

        <div>

          <h1 className="color_green">
            Bikes
          </h1>

          <p className="mt_exsm color_light font_small">
            Review and manage bike listings
          </p>

        </div>

      </div>

      {/* OVERVIEW CARDS */}

      <div className="stats-cards flex gap_sm mt_lg">

        <div className="stat_card pd_fixed radius_regular flex_1 bg_white">
          <div className="flex gap_xsm align_center space_between">
            <svg  className="icon_small bg_green" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-80q-83 0-141.5-58.5T0-280q0-83 58.5-141.5T200-480q83 0 141.5 58.5T400-280q0 83-58.5 141.5T200-80Zm85-115q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm155-5v-200L312-512q-12-11-18-25.5t-6-30.5q0-16 6.5-30.5T312-624l112-112q12-12 27.5-18t32.5-6q17 0 32.5 6t27.5 18l76 76q28 28 64 44t76 16v80q-57 0-108.5-22T560-604l-32-32-96 96 88 92v248h-80Zm123.5-563.5Q540-787 540-820t23.5-56.5Q587-900 620-900t56.5 23.5Q700-853 700-820t-23.5 56.5Q653-740 620-740t-56.5-23.5ZM760-80q-83 0-141.5-58.5T560-280q0-83 58.5-141.5T760-480q83 0 141.5 58.5T960-280q0 83-58.5 141.5T760-80Zm85-115q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Z"></path></svg>
            <h2>{totalBikes}</h2>
          </div>
          <p className="font_xsmall color_light mt_xsm">Total Bikes</p>

        </div>


        <div className="stat_card pd_fixed radius_regular flex_1 bg_white">
          <div className="flex gap_xsm align_center space_between">
   <svg  className="icon_small bg_approved" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-80q-83 0-141.5-58.5T0-280q0-83 58.5-141.5T200-480q83 0 141.5 58.5T400-280q0 83-58.5 141.5T200-80Zm85-115q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm155-5v-200L312-512q-12-11-18-25.5t-6-30.5q0-16 6.5-30.5T312-624l112-112q12-12 27.5-18t32.5-6q17 0 32.5 6t27.5 18l76 76q28 28 64 44t76 16v80q-57 0-108.5-22T560-604l-32-32-96 96 88 92v248h-80Zm123.5-563.5Q540-787 540-820t23.5-56.5Q587-900 620-900t56.5 23.5Q700-853 700-820t-23.5 56.5Q653-740 620-740t-56.5-23.5ZM760-80q-83 0-141.5-58.5T560-280q0-83 58.5-141.5T760-480q83 0 141.5 58.5T960-280q0 83-58.5 141.5T760-80Zm85-115q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Z"></path></svg>            <h2>{approvedCount}</h2>
          </div>
          <p className="font_xsmall color_light mt_xsm">Approved</p>
        </div>
        
        <div className="stat_card pd_fixed radius_regular flex_1 bg_white">
          <div className="flex gap_xsm align_center space_between">
   <svg  className="icon_small bg_pending" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-80q-83 0-141.5-58.5T0-280q0-83 58.5-141.5T200-480q83 0 141.5 58.5T400-280q0 83-58.5 141.5T200-80Zm85-115q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm155-5v-200L312-512q-12-11-18-25.5t-6-30.5q0-16 6.5-30.5T312-624l112-112q12-12 27.5-18t32.5-6q17 0 32.5 6t27.5 18l76 76q28 28 64 44t76 16v80q-57 0-108.5-22T560-604l-32-32-96 96 88 92v248h-80Zm123.5-563.5Q540-787 540-820t23.5-56.5Q587-900 620-900t56.5 23.5Q700-853 700-820t-23.5 56.5Q653-740 620-740t-56.5-23.5ZM760-80q-83 0-141.5-58.5T560-280q0-83 58.5-141.5T760-480q83 0 141.5 58.5T960-280q0 83-58.5 141.5T760-80Zm85-115q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Z"></path></svg>          <h2>{pendingCount}</h2>

          </div>
          <p className="font_xsmall color_light mt_xsm">Pending</p>
        </div>

        <div className="stat_card pd_fixed radius_regular flex_1 bg_white">
          <div className="flex gap_xsm align_center space_between">
   <svg  className="icon_small bg_rejected" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-80q-83 0-141.5-58.5T0-280q0-83 58.5-141.5T200-480q83 0 141.5 58.5T400-280q0 83-58.5 141.5T200-80Zm85-115q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm155-5v-200L312-512q-12-11-18-25.5t-6-30.5q0-16 6.5-30.5T312-624l112-112q12-12 27.5-18t32.5-6q17 0 32.5 6t27.5 18l76 76q28 28 64 44t76 16v80q-57 0-108.5-22T560-604l-32-32-96 96 88 92v248h-80Zm123.5-563.5Q540-787 540-820t23.5-56.5Q587-900 620-900t56.5 23.5Q700-853 700-820t-23.5 56.5Q653-740 620-740t-56.5-23.5ZM760-80q-83 0-141.5-58.5T560-280q0-83 58.5-141.5T760-480q83 0 141.5 58.5T960-280q0 83-58.5 141.5T760-80Zm85-115q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Z"></path></svg>            <h2>{rejectedCount}</h2>
          </div>
          <p className="font_xsmall color_light mt_xsm">Rejected</p>
        </div>

      </div>

      {/* FILTERS */}

      <div className="filters flex align_center space_between gap_sm mt_lg">


        {/* SEARCH */}

        <div className="search-box">

          <input
            type="search"
            placeholder="Search by bike or owner..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        {/* STATUS */}

        <div className="role-filter flex align_center gap_sm">

          <div className="user-count color_light font_small">

            Total Bikes:{" "}

            {bikes.length}

          </div>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
            </option>

          </select>

        </div>

      </div>


      {/* TABLE */}

      <div className="table-wrapper mt_xsm">

        <table>

          <thead>

            <tr>

              <th>
                #
              </th>

              <th width="140">
                Bike
              </th>

              <th>
                Owner
              </th>

              <th>
                Location
              </th>

              <th>
                Price / Day
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredBikes.length > 0 ? (

              filteredBikes.map(
                (bike, index) => (

                  <tr
                    key={
                      bike._id
                    }
                  >

                    {/* SERIAL NUMBER */}

                    <td>
                      {index + 1}
                    </td>


                    {/* BIKE */}

                    <td>

                      <strong>
                        {
                          bike.bikeName
                        }
                      </strong>

                      <br />

                      <small>

                        {
                          bike.brand
                        }{" "}

                        {
                          bike.model
                        }

                      </small>

                    </td>


                    {/* OWNER */}

                    <td>

                      <strong>

                        {
                          bike.owner?.name ||
                          "Unknown"
                        }

                      </strong>

                      <br />

                      <small>

                        {
                          bike.owner?.email ||
                          ""
                        }

                      </small>

                    </td>


                    {/* LOCATION */}

                    <td>

                      {bike.address?.city}, {bike.address?.state}

                    </td>


                    {/* PRICE */}

                    <td>

                      <div>
                        ₹{bike.pricePerHour} / hr
                      </div>

                      <div>
                        ₹{bike.pricePerDay} / day
                      </div>
                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          `badge ${bike.status}`
                        }
                      >

                        {
                          bike.status
                        }

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <button
                        className="button bg_white color_green hover_green"
                        onClick={() =>
                          handleViewBike(bike)
                        }
                      >
                        View Request
                      </button>
                    </td>

                  </tr>

                )

              )

            ) : (

              <tr>

                <td colSpan="7">

                  No bikes found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>
      {showBikeModal && (

        <AdminBikeDetailsModal

          bike={selectedBike}

          onClose={() => {
            setShowBikeModal(false);
            setSelectedBike(null);
          }}

          onApprove={async () => {

            await handleApprove(
              selectedBike._id
            );

            setShowBikeModal(false);

            setSelectedBike(null);

          }}

          onReject={async () => {

            await handleReject(
              selectedBike._id
            );

            setShowBikeModal(false);

            setSelectedBike(null);

          }}

        />

      )}

    </div>


  );

}


export default Bikes;
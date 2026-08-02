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

              <th>
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

                      {bike.address?.district}, {bike.address?.state}

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
                          `role-badge ${bike.status}`
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
                        className="button"
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

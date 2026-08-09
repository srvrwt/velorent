import { useEffect, useMemo, useState } from "react";
import { getApprovedBikes } from "../services/bikeService";
import IconMap from "../assets/icons/location.svg";

function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // FILTER STATES
  // ==========================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  // ==========================
  // LOAD BIKES
  // ==========================

  useEffect(() => {
    async function loadBikes() {
      try {
        const data = await getApprovedBikes();

        setBikes(data);
      } catch (error) {
        console.error(error);

        setError("Failed to load bikes");
      } finally {
        setLoading(false);
      }
    }

    loadBikes();
  }, []);

  // ==========================
  // CATEGORY OPTIONS
  // ==========================

  const categories = useMemo(() => {
    const values = bikes
      .map((bike) => bike.category)
      .filter(Boolean);

    return [...new Set(values)];
  }, [bikes]);

  // ==========================
  // CITY OPTIONS
  // ==========================

  const cities = useMemo(() => {
    const values = bikes
      .map((bike) => bike.address?.city)
      .filter(Boolean);

    return [...new Set(values)];
  }, [bikes]);

  // ==========================
  // MIN PRICE
  // ==========================

  const lowestPrice = useMemo(() => {
    if (!bikes.length) return 0;

    return Math.min(
      ...bikes.map((bike) =>
        Number(bike.pricePerDay) || 0
      )
    );
  }, [bikes]);

  // ==========================
  // MAX PRICE
  // ==========================

  const highestPrice = useMemo(() => {
    if (!bikes.length) return 1000;

    return Math.max(
      ...bikes.map((bike) =>
        Number(bike.pricePerDay) || 0
      )
    );
  }, [bikes]);

  // ==========================
  // FILTER BIKES
  // ==========================

  const filteredBikes = useMemo(() => {
    let result = [...bikes];

    // Search
    if (search.trim()) {
      const searchValue = search
        .toLowerCase()
        .trim();

      result = result.filter((bike) => {
        return (
          bike.bikeName
            ?.toLowerCase()
            .includes(searchValue) ||

          bike.brand
            ?.toLowerCase()
            .includes(searchValue) ||

          bike.model
            ?.toLowerCase()
            .includes(searchValue) ||

          bike.category
            ?.toLowerCase()
            .includes(searchValue) ||

          bike.address?.city
            ?.toLowerCase()
            .includes(searchValue)
        );
      });
    }

    // Category
    if (category) {
      result = result.filter(
        (bike) =>
          bike.category === category
      );
    }

    // City
    if (city) {
      result = result.filter(
        (bike) =>
          bike.address?.city === city
      );
    }

    // Price
    if (maxPrice) {
      result = result.filter(
        (bike) =>
          Number(bike.pricePerDay) <=
          Number(maxPrice)
      );
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.pricePerDay) -
          Number(b.pricePerDay)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.pricePerDay) -
          Number(a.pricePerDay)
      );
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    return result;
  }, [
    bikes,
    search,
    category,
    city,
    maxPrice,
    sortBy,
  ]);

  // ==========================
  // CLEAR FILTERS
  // ==========================

  function clearFilters() {
    setSearch("");
    setCategory("");
    setCity("");
    setMaxPrice("");
    setSortBy("");
  }

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div className="page_container">
        Loading bikes...
      </div>
    );
  }

  // ==========================
  // ERROR
  // ==========================

  if (error) {
    return (
      <div className="page_container">
        {error}
      </div>
    );
  }

  return (
    <div className="page_container">

      {/* ==========================
          HEADER
      ========================== */}

      <div className="page_header">

        <h1>
          Available Bikes
        </h1>

        <p>
          Choose a bike and book your ride.
        </p>

      </div>


      {/* ==========================
          MAIN CONTENT
      ========================== */}

      <div className="bikes-layout mt_sm">


        {/* ==========================
            SIDEBAR FILTER
        ========================== */}

        <aside className="bike-filters">

          <div className="filter-header">

            <h3>
              Filters
            </h3>

            <button
              type="button"
              onClick={clearFilters}
            >
              Clear All
            </button>

          </div>

          <div className="filter-group">

            <label>
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >

              <option value="">
                Recommended
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

            </select>

          </div>

          {/* CATEGORY */}

          <div className="filter-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="">
                All Categories
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>


          {/* CITY */}

          <div className="filter-group">

            <label>
              Location
            </label>

            <select
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
            >

              <option value="">
                All Locations
              </option>

              {cities.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>


          {/* PRICE */}

          <div className="filter-group">

            <label>
              Pricing (max) 
              <span className="max_price">    ₹
              {maxPrice ||
                highestPrice}</span>
            </label>



            <input
              type="range"
              min={lowestPrice}
              max={highestPrice}
              step="50"
              value={
                maxPrice ||
                highestPrice
              }
              onChange={(e) =>
                setMaxPrice(
                  e.target.value
                )
              }
            />

            <div className="price-range">

              <span>
               Min ₹{lowestPrice}
              </span>

              <span>
               Max ₹{highestPrice}
              </span>

            </div>

          </div>



        </aside>


        {/* ==========================
            BIKE RESULTS
        ========================== */}

        <div className="bike-results">



          <div className="bike-search flex gap_md align_center space_between width_full border radius">

            <input
              type="search"
              placeholder="Search by bike name, brand, model or city..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
            <p className="result_count">
              <strong>
                {filteredBikes.length}
              </strong>{" "}
              bikes available
            </p>

          </div>


          {filteredBikes.length === 0 ? (

            <div className="no-bikes mt_sm">

              <h3>
                No bikes found
              </h3>

              <p>
                Try changing your search
                or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <div className="bikes-grid mt_sm">

              {filteredBikes.map(
                (bike) => (

                  <div
                    className="bike-card"
                    key={bike._id}
                  >

                    {/* IMAGE */}

                    <div className="bike-image">

                      <img
                        src={`http://localhost:5000${bike.images?.front || ""
                          }`}
                        alt={
                          bike.bikeName ||
                          "Bike"
                        }
                      />


                      <p className="bike-category">
                        {bike.category}

                      </p>


                    </div>


                    {/* CONTENT */}

                    <div className="bike-content">

                      <h3>
                        {bike.bikeName}
                      </h3>

                      <p className="bike-model">

                        {bike.brand}{" "} / {bike.model} model

                      </p>



                      <p className="bike-location flex gap_xsm align_center mt_xsm">
                        <img src={IconMap} alt="Location" className="icon_xsmall" />

                        {bike.address?.city ||
                          "N/A"}

                        {bike.address?.state
                          ? `, ${bike.address.state}`
                          : ""}

                      </p>


                      {/* PRICE */}

                      <div className="bike-price flex space_between gap_sm align_center mt_xsm">

                        <div>

                          <strong>
                            ₹
                            {
                              bike.pricePerHour
                            }
                          </strong>

                          <span>
                            / hour
                          </span>

                        </div>


                        <div>

                          <strong>
                            ₹
                            {
                              bike.pricePerDay
                            }
                          </strong>

                          <span>
                            / day
                          </span>

                        </div>

                      </div>


                      {/* BOOK */}

                      <button
                        className="book-bike-btn button mt_xsm width_full"
                        onClick={() => {
                          console.log(
                            "Book bike:",
                            bike._id
                          );
                        }}
                      >
                        Book Now
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Bikes;
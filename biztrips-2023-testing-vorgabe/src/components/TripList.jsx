import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TripList({ addToWishlist }) {
  const [month, setMonth] = useState("");
  const [trips, setTrips] = useState([]); // Initialize trips as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = ["Idle", "Jan", "Feb", "March", "April", "Mai", "June"];

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:3001/trips");
        if (!response.ok) {
          throw new Error(`HTTP-Error: ${response.status}`);
        }
        const data = await response.json();
        setTrips(data); // Set the fetched trips
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []); // Empty dependency array means this runs once after the component mounts

  const tripsMapped = trips.map((trip) => (
    <Trip addToWishlist={addToWishlist} trip={trip} key={trip.id} />
  ));

  const empty = (
    <section>
      <p className="alert alert-info">Productlist is empty</p>
    </section>
  );

  const filteredTrips = month
    ? trips.filter((t) => t.startTrip[1] === parseInt(month))
    : trips;

  if (loading) {
    return <p>Loading trips...</p>;
  }

  if (error) {
    return <p className="alert alert-danger">Error: {error}</p>;
  }

  return (
    <div className="container">
      <section>
        <h2 className="h4">Triplist-Catalog</h2>
        <section id="filters">
          <label htmlFor="month">Filter by Month:</label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {months.slice(1).map((name, idx) => (
              <option key={idx} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>
          {month && (
            <h2>
              Found {filteredTrips.length}
              {filteredTrips.length === 1 ? " trip" : " trips"} for the month of{" "}
              {months[month]}
            </h2>
          )}
        </section>
        <div className="row">
          {filteredTrips.length > 0 ? tripsMapped : empty}
        </div>
      </section>
    </div>
  );
}

function Trip({ addToWishlist, trip }) {
  const { id, title, description, startTrip, endTrip } = trip;

  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <figure className="card card-product">
        <div className="img-wrap">
          <img src={`images/items/${id}.jpg`} alt={title} />
        </div>
        <figcaption className="info-wrap">
          <h6 className="title">
            {id} {title} {startTrip} {endTrip}
          </h6>
          <p className="card-text">{description}</p>
          <div className="info-wrap row">
            <button
              type="button"
              className="btn btn-link btn-outline"
              onClick={() => addToWishlist(trip)}
            >
              <i className="fa fa-shopping-cart" /> Add to Wishlist
            </button>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

export default TripList;

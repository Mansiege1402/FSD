import React from "react";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const fetchOpportunities = async () => {
    try {
      const res = await API.get("/opportunities");
      setOpportunities(res.data);
    } catch (error) {
      setMessage("Failed to load opportunities");
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const applyNow = async (opportunityId) => {
    try {
      await API.post("/applications", { opportunityId });
      setMessage("Applied successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not apply");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Volunteer Opportunities</h2>
      {message && <div className="alert alert-info mt-3">{message}</div>}
      <div className="row mt-3">
        {opportunities.map((item) => (
          <div className="col-md-6 mb-3" key={item._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5>{item.title}</h5>
                <p>{item.description}</p>
                <p className="mb-1">
                  <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
                </p>
                <p className="mb-2">
                  <strong>Location:</strong> {item.location}
                </p>
                <p className="text-muted small">Posted by: {item.createdBy?.name || "NGO"}</p>
                {user?.role === "User" && (
                  <button className="btn btn-primary btn-sm" onClick={() => applyNow(item._id)}>
                    Apply
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import { useEffect, useState } from "react";
import API from "../services/api";

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  const loadApplications = async () => {
    try {
      const res = await API.get("/applications/me");
      setApplications(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load applications");
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="container mt-4">
      <h2>User Dashboard</h2>
      <p>Your applied opportunities:</p>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row">
        {applications.map((app) => (
          <div key={app._id} className="col-md-6 mb-3">
            <div className="card p-3 h-100">
              <h5>{app.opportunityId?.title}</h5>
              <p>{app.opportunityId?.description}</p>
              <p className="mb-1">
                <strong>Date:</strong> {new Date(app.opportunityId?.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {app.opportunityId?.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;

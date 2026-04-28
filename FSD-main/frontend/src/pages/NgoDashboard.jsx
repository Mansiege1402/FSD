import React from "react";
import { useEffect, useState } from "react";
import API from "../services/api";

const emptyForm = { title: "", description: "", date: "", location: "" };

const NgoDashboard = () => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [message, setMessage] = useState("");

  const loadMyPosts = async () => {
    try {
      const res = await API.get("/opportunities/mine");
      setOpportunities(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load opportunities");
    }
  };

  useEffect(() => {
    loadMyPosts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingId) {
        await API.put(`/opportunities/${editingId}`, form);
        setMessage("Opportunity updated");
      } else {
        await API.post("/opportunities", form);
        setMessage("Opportunity created");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadMyPosts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Action failed");
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      description: item.description,
      date: item.date ? item.date.substring(0, 10) : "",
      location: item.location
    });
  };

  const onDelete = async (id) => {
    try {
      await API.delete(`/opportunities/${id}`);
      setMessage("Opportunity deleted");
      loadMyPosts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>NGO Dashboard</h2>
      {message && <div className="alert alert-info mt-2">{message}</div>}

      <form onSubmit={handleSubmit} className="card p-3 mt-3">
        <h5>{editingId ? "Update Opportunity" : "Create Opportunity"}</h5>
        <input
          name="title"
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          className="form-control mb-2"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          className="form-control mb-2"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary">{editingId ? "Update" : "Create"}</button>
      </form>

      <div className="row mt-3">
        {opportunities.map((item) => (
          <div className="col-md-6 mb-3" key={item._id}>
            <div className="card p-3 h-100">
              <h5>{item.title}</h5>
              <p>{item.description}</p>
              <p className="mb-1">
                <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {item.location}
              </p>
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(item)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(item._id)}>
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

export default NgoDashboard;

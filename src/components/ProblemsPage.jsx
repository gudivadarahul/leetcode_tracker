// src/components/ProblemsPage.jsx
import React, { useContext, useState, useCallback } from "react";
import { ProblemsContext } from "../context/ProblemsContext";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { Oval } from "react-loader-spinner";

const ProblemsPage = () => {
  const {
    problems,
    createProblem,
    updateProblem,
    deleteProblem,
    loading,
    error,
    filterProblems,
  } = useContext(ProblemsContext);
  const [newProblem, setNewProblem] = useState({
    title: "",
    description: "",
    difficulty: "",
    tags: "",
  });
  const [editingProblem, setEditingProblem] = useState(null);
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedFilterProblems = useCallback(debounce(filterProblems, 300), [
    filterProblems,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !newProblem.title ||
      !newProblem.description ||
      !newProblem.difficulty
    ) {
      setFormError("All fields are required");
      return;
    }
    setFormError("");
    const tagsArray = newProblem.tags.split(",").map((tag) => tag.trim());
    createProblem({ ...newProblem, tags: tagsArray });
    setNewProblem({ title: "", description: "", difficulty: "", tags: "" });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (
      !editingProblem.title ||
      !editingProblem.description ||
      !editingProblem.difficulty
    ) {
      setFormError("All fields are required");
      return;
    }
    setFormError("");
    const tagsArray = editingProblem.tags.split(",").map((tag) => tag.trim());
    updateProblem(editingProblem._id, { ...editingProblem, tags: tagsArray });
    setEditingProblem(null);
  };

  const handleEdit = (problem) => {
    setEditingProblem({ ...problem, tags: problem.tags.join(", ") });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    debouncedFilterProblems(e.target.value);
  };

  return (
    <div className="container">
      <h2>Problems</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      {loading ? (
        <div className="loading-spinner">
          <Oval height={80} width={80} color="#007bff" ariaLabel="loading" />
        </div>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="text"
            placeholder="Search problems by title..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginBottom: "20px", padding: "10px", width: "300px" }}
          />
          <form onSubmit={editingProblem ? handleUpdate : handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={editingProblem ? editingProblem.title : newProblem.title}
              onChange={(e) =>
                editingProblem
                  ? setEditingProblem({
                      ...editingProblem,
                      title: e.target.value,
                    })
                  : setNewProblem({ ...newProblem, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={
                editingProblem
                  ? editingProblem.description
                  : newProblem.description
              }
              onChange={(e) =>
                editingProblem
                  ? setEditingProblem({
                      ...editingProblem,
                      description: e.target.value,
                    })
                  : setNewProblem({
                      ...newProblem,
                      description: e.target.value,
                    })
              }
            />
            <input
              type="text"
              placeholder="Difficulty"
              value={
                editingProblem
                  ? editingProblem.difficulty
                  : newProblem.difficulty
              }
              onChange={(e) =>
                editingProblem
                  ? setEditingProblem({
                      ...editingProblem,
                      difficulty: e.target.value,
                    })
                  : setNewProblem({ ...newProblem, difficulty: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={editingProblem ? editingProblem.tags : newProblem.tags}
              onChange={(e) =>
                editingProblem
                  ? setEditingProblem({
                      ...editingProblem,
                      tags: e.target.value,
                    })
                  : setNewProblem({ ...newProblem, tags: e.target.value })
              }
            />
            <button type="submit">
              {editingProblem ? "Update Problem" : "Add Problem"}
            </button>
            {formError && <p style={{ color: "red" }}>{formError}</p>}
          </form>
          <ul>
            {problems.map((problem) => (
              <li key={problem._id}>
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
                <p>{problem.difficulty}</p>
                <p>{problem.tags.join(", ")}</p>
                <button onClick={() => handleEdit(problem)}>Edit</button>
                <button onClick={() => deleteProblem(problem._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ProblemsPage;

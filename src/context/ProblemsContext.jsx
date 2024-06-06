// src/context/ProblemsContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const ProblemsContext = createContext();

const ProblemsProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.token) {
      fetchProblems();
    }
  }, [auth.token]);

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8000/api/problems", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setProblems(response.data);
      setFilteredProblems(response.data);
    } catch (error) {
      setError("Error fetching problems");
      toast.error("Error fetching problems.");
    }
    setLoading(false);
  };

  const createProblem = async (problem) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/problems",
        problem,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      const updatedProblems = [...problems, response.data];
      setProblems(updatedProblems);
      setFilteredProblems(updatedProblems);
      toast.success("Problem created successfully.");
    } catch (error) {
      setError("Error creating problem");
      toast.error("Error creating problem.");
    }
    setLoading(false);
  };

  const updateProblem = async (id, updatedProblem) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/problems/${id}`,
        updatedProblem,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      const updatedProblems = problems.map((problem) =>
        problem._id === id ? response.data : problem
      );
      setProblems(updatedProblems);
      setFilteredProblems(updatedProblems);
      toast.success("Problem updated successfully.");
    } catch (error) {
      setError("Error updating problem");
      toast.error("Error updating problem.");
    }
    setLoading(false);
  };

  const deleteProblem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:8000/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const remainingProblems = problems.filter(
        (problem) => problem._id !== id
      );
      setProblems(remainingProblems);
      setFilteredProblems(remainingProblems);
      toast.success("Problem deleted successfully.");
    } catch (error) {
      setError("Error deleting problem");
      toast.error("Error deleting problem.");
    }
    setLoading(false);
  };

  const filterProblems = (searchTerm) => {
    const filtered = problems.filter((problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedFiltered = filtered.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      if (aTitle.startsWith(searchLower) && !bTitle.startsWith(searchLower)) {
        return -1;
      } else if (
        !aTitle.startsWith(searchLower) &&
        bTitle.startsWith(searchLower)
      ) {
        return 1;
      } else {
        return aTitle.indexOf(searchLower) - bTitle.indexOf(searchLower);
      }
    });

    setFilteredProblems(sortedFiltered);
  };

  return (
    <ProblemsContext.Provider
      value={{
        problems: filteredProblems,
        createProblem,
        updateProblem,
        deleteProblem,
        loading,
        error,
        filterProblems,
      }}
    >
      {children}
    </ProblemsContext.Provider>
  );
};

export { ProblemsProvider, ProblemsContext };

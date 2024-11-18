import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Employee.css"; // Import CSS file

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to toggle the modal visibility
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    designation: "", // Start with an empty designation
    contact: "",
    gender: "",
    qualification: "",
    joinDate: "",
  });
  const [currentEmployee, setCurrentEmployee] = useState(null); // For storing employee data to edit

  // Fetch employees from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("https://mern-machinetest.onrender.com/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchEmployees();
  }, []);

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentEmployee) {
      // Update existing employee
      try {
        const res = await axios.put(
          `https://mern-machinetest.onrender.com/employees/update/${currentEmployee._id}`,
          newEmployee
        );
        setEmployees(
          employees.map((emp) =>
            emp._id === currentEmployee._id ? res.data : emp
          )
        );
        setShowForm(false); // Hide form after submission
        setCurrentEmployee(null); // Clear edit state
      } catch (err) {
        console.error("Error updating employee:", err);
      }
    } else {
      // Add new employee
      try {
        const res = await axios.post(
          "https://mern-machinetest.onrender.com/employees/add",
          newEmployee
        );
        setEmployees([...employees, res.data]); // Update local state with the new employee
        setShowForm(false); // Hide form after submission
      } catch (err) {
        console.error("Error adding employee:", err);
      }
    }
    setNewEmployee({
      name: "",
      email: "",
      designation: "", // Reset designation field
      contact: "",
      gender: "",
      qualification: "",
      joinDate: "",
    }); // Reset form fields
  };

  // Handle edit button click
  const handleEdit = (emp) => {
    setCurrentEmployee(emp);
    setNewEmployee({
      ...emp,
      joinDate: emp.joinDate ? emp.joinDate.slice(0, 10) : "", // Ensure the date is in the proper format
    });
    setShowForm(true); // Show the form for editing
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://mern-machinetest.onrender.com/employees/delete/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  // Function to format the date properly
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString(); // Format it into a readable format (e.g., MM/DD/YYYY)
  };

  return (
    <div className="employee-container">
      <h1 className="employee-title">Employee List</h1>

      {/* Add Employee Button */}
      <button
        className="action-btn add-btn"
        onClick={() => setShowForm(true)} // Show the modal when clicked
      >
        Add Employee
      </button>

      {/* Modal for Add/Edit Employee */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{currentEmployee ? "Edit Employee" : "Add Employee"}</h2>
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Designation</label>
                <select
                  name="designation"
                  value={newEmployee.designation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <div className="form-field">
                <label>Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={newEmployee.contact}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Gender</label>
                <select
                  name="gender"
                  value={newEmployee.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-field">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={newEmployee.qualification}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label>Join Date</label>
                <input
                  type="date"
                  name="joinDate"
                  value={newEmployee.joinDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="action-btn submit-btn">
                Submit
              </button>
              <button
                type="button"
                className="action-btn close-btn"
                onClick={() => setShowForm(false)} // Close the modal without saving
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Employee Table */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Contact</th>
            <th>Gender</th>
            <th>Qualification</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={emp._id}>
              <td>{index + 1}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.designation}</td>
              <td>{emp.contact}</td>
              <td>{emp.gender}</td>
              <td>{emp.qualification}</td>
              <td>{formatDate(emp.joinDate)}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(emp)} // Open modal for editing
                >
                  Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(emp._id)} // Delete employee
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employee;

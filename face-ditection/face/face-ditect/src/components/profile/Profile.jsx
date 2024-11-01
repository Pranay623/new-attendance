import React, { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';

const Profile = () => {
  const [userName, setUserName] = useState(null);
  const [userID, setUserID] = useState(null); // State for userID
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    // Retrieve userID from local storage (or any other state management you use)
    const id = localStorage.getItem('userID'); // Replace with your method of retrieving the user ID
    setUserID(id);
  }, []);

  const markAttendance = async () => {
    if (!userID) {
      console.error("User ID is not available.");
      setError("User ID is not available.");
      return;
    }

    setLoading(true); // Set loading to true before the request
    setError(null); // Reset error state before making the request

    try {
      const response = await axios.post(`http://localhost:5000/user/attendance`, { userID });
      
      if (response.data && response.data.status === "SUCCESS") {
        setUserName(response.data.userName); // Display the user’s name on success
      } else {
        console.error("Attendance marking failed.");
        setError("Attendance marking failed.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError("Error marking attendance: " + error.response?.data?.message || "An unknown error occurred.");
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  return (
    <div className="profile">
      {/* Mark Attendance Button */}
      <button onClick={markAttendance} disabled={loading}>
        {loading ? 'Marking Attendance...' : 'Mark Attendance'}
      </button>

      {/* Display User Name */}
      {userName && (
        <div className="user-name">
          <p>Attendance marked for: {userName}</p>
        </div>
      )}

      {/* Display Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import GraphPage from './components/GraphPage';
import ProgressLogging from './components/ProgressLogging';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CustomNavbar from './components/Navbar';
import { auth } from './utilities/firebase';

function App() {
  const [user, setUser] = useState(null);
  const [runsData, setRunsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser || null);
    });

    return () => unsubscribe();
  }, []);

  const fetchRunsData = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        // Fetch from my AWS API Gateway endpoint
        const response = await fetch(`https://6z4n2v4wg6.execute-api.us-east-2.amazonaws.com/test_1/users/${user.uid}/runs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRunsData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    } else {
      setRunsData(null);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRunsData();
  }, [fetchRunsData]);

  const renderGraphPage = () => {
    if (!user) {
      return <Navigate to="/" />;
    }
    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error loading data: {error.message}</div>;
    }
    if (runsData) {
      console.log(runsData);
      return <GraphPage data={runsData} user={user} />;
    }
    return <div>You have no run data. Click "Log Run" in the navbar and enter a run (you have to enter more than one to see lines graphed).</div>;
  };

  return (
    <div className="App">
      <Router>
        <CustomNavbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Login user={user} />} />
            <Route path="/logrun" element={<ProgressLogging user={user} onRunAdded={fetchRunsData}/>} />
            <Route path="/stats" element={renderGraphPage()} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

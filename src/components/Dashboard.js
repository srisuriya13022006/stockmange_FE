import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [topStock, setTopStock] = useState('');
  const [portfolioDistribution, setPortfolioDistribution] = useState([]);

  useEffect(() => {
    // Function to fetch portfolio metrics
    const fetchMetrics = () => {
      axios.get('http://localhost:8080/api/portfolio/metrics')
        .then(response => {
          setTotalValue(response.data.totalValue);
          setTopStock(response.data.topStock);
          setPortfolioDistribution(response.data.portfolioDistribution);
        })
        .catch(error => {
          console.error('Error fetching portfolio metrics:', error);
        });
    };

    // Fetch the metrics initially
    fetchMetrics();

    // Set up the interval for periodic refresh (e.g., every 5 seconds)
    const intervalId = setInterval(fetchMetrics, 5000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <div className="bg-blue-200 p-10 flex flex-col justify-between rounded-3xl">
      <h1 className="text-4xl font-bold text-center mb-12 text-indigo-700">Portfolio Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Portfolio Summary Boxes */}
        <div className="bg-blue-900 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold text-white">Total Portfolio Value</h2>
          <p className="mt-4 text-3xl text-white font-bold">${totalValue}</p>
        </div>

        <div className="bg-green-900 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold text-white">Top Performing Stock</h2>
          <p className="mt-4 text-3xl text-white font-bold">{topStock}</p>
        </div>

        <div className="bg-purple-900 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold text-white">Portfolio Distribution</h2>
          <div className="mt-4 flex-1">
            <p className="text-lg text-white">Chart coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

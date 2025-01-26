import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [topStock, setTopStock] = useState('');
  const [portfolioDistribution, setPortfolioDistribution] = useState([]);

  // Expanded Colors for the chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF69B4', '#FFD700',
    '#87CEEB', '#32CD32', '#FF6347', '#BA55D3', '#4B0082', '#40E0D0', '#ADFF2F'
  ];

  useEffect(() => {
    // Function to fetch portfolio metrics
    const fetchMetrics = () => {
      axios.get('https://spring-capx.onrender.com/api/portfolio/metrics')
        .then(response => {
          setTotalValue(response.data.totalValue);
          setTopStock(response.data.topStock);
          // Prepare the data for recharts pie chart
          const distributionData = Object.keys(response.data.portfolioDistribution).map(ticker => ({
            name: ticker,
            value: response.data.portfolioDistribution[ticker]
          }));
          setPortfolioDistribution(distributionData);
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

      {/* Grid Layout for Total Value and Top Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        {/* Total Portfolio Value */}
        <div className="bg-blue-900 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold text-white">Total Portfolio Value</h2>
          <p className="mt-4 text-3xl text-white font-bold">${totalValue}</p>
        </div>

        {/* Top Performing Stock */}
        <div className="bg-green-900 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold text-white">Top Performing Stock</h2>
          <p className="mt-4 text-3xl text-white font-bold">{topStock}</p>
        </div>
      </div>

      {/* Portfolio Distribution */}
      <div className="bg-purple-900 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col justify-between">
        <h2 className="text-2xl font-semibold text-white text-center">Portfolio Distribution</h2>
        <div className="mt-4 w-full flex justify-center items-center"> {/* Flex container to center the chart */}
          <PieChart width={250} height={250}> {/* Dynamically sized pie chart */}
            <Pie
              data={portfolioDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {portfolioDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

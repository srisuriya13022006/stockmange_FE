import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockList = ({ onEditStock }) => {
  const [stocks, setStocks] = useState([]);
  const [updateStocks, setUpdateStocks] = useState([]);

  // Function to fetch stocks from the backend
  const fetchStocks = () => {
    axios.get('http://localhost:8080/api/stocks')
      .then(response => {
        setStocks(response.data);
        fetchRealTimePrices(response.data);  // Fetch real-time prices once stocks are loaded
      })
      .catch(error => {
        console.error('Error fetching stocks:', error);
      });
  };

  // Function to fetch real-time stock prices and calculate profit/loss
  const fetchRealTimePrices = (stocks) => {
    const updatedStockData = stocks.map(stock => {
      return axios.get(`http://localhost:8080/api/stocks/realtime/${stock.tickerSymbol}`)
        .then(response => {
          const currentPrice = response.data.currentPrice || stock.price; // Fallback to the original price if no current price is available
          const profitOrLoss = currentPrice - stock.price;
          return { ...stock, currentPrice, profitOrLoss };
        })
        .catch(error => {
          console.error('Error fetching real-time stock price:', error);
          return { ...stock, currentPrice: stock.price, profitOrLoss: 0 };  // Fallback values in case of error
        });
    });

    Promise.all(updatedStockData).then(updatedData => {
      setUpdateStocks(updatedData);  // Set the state once all real-time prices are fetched
    });
  };

  // Function to update stock price manually using backend API (if needed)
  const updateStockPrice = (ticker) => {
    console.log('Updating stock price for ticker:', ticker);  // Log ticker value for debugging
    axios.put(`http://localhost:8080/api/stocks/updatePrice/${ticker}`)
      .then(response => {
        console.log('Updated stock data:', response.data);  // Log response data for debugging
        // Update the stock list with the new price
        setStocks(stocks.map(stock =>
          stock.tickerSymbol === ticker ? response.data : stock
        ));
        fetchRealTimePrices(stocks);  // Re-fetch real-time prices after manual update
      })
      .catch(error => {
        console.error('Error updating stock price:', error);  // Log error if any
      });
  };

  // useEffect hook to trigger initial fetch and set interval for periodic refresh
  useEffect(() => {
    // Initial fetch when component loads
    fetchStocks();

    // Set interval to refresh the list every 30 seconds (30000 ms)
    const interval = setInterval(() => {
      fetchStocks();
    }, 30000); // Adjust the interval time as needed

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);  // Empty dependency array to run only once on mount

  // Handle deletion of a stock
  const handleDelete = (ticker) => {
    axios.delete(`http://localhost:8080/api/stocks/${ticker}`)
      .then(() => {
        // Remove the deleted stock from the UI without needing to re-fetch
        setStocks(stocks.filter(stock => stock.tickerSymbol !== ticker));
        setUpdateStocks(updateStocks.filter(stock => stock.tickerSymbol !== ticker));
      })
      .catch(error => {
        console.error('Error deleting stock:', error);
      });
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Current Holdings</h2>
      <table className="min-w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-sm uppercase">
            <th className="py-2 px-3 text-left">Stock</th>
            <th className="py-2 px-3 text-left">Ticker</th>
            <th className="py-2 px-3 text-left">Quantity</th>
            <th className="py-2 px-3 text-left">Buy Price</th>
            <th className="py-2 px-3 text-left">Current Price</th>
            <th className="py-2 px-3 text-left">Profit/Loss</th>
            <th className="py-2 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {updateStocks.map((stock, index) => (
            <tr key={index} className="hover:bg-gray-100 transition">
              <td className="py-2 px-3">{stock.companyName}</td>
              <td className="py-2 px-3">{stock.tickerSymbol}</td>
              <td className="py-2 px-3">{stock.quantity}</td>
              <td className="py-2 px-3">${stock.price.toFixed(2)}</td>
              <td className="py-2 px-3">
                ${stock.currentPrice ? stock.currentPrice.toFixed(2) : 'N/A'}
              </td>
              <td className="py-2 px-3" style={{ color: stock.profitOrLoss >= 0 ? 'green' : 'red' }}>
                {stock.profitOrLoss !== undefined ? 
                  (stock.profitOrLoss >= 0 ? `+${stock.profitOrLoss.toFixed(2)}` : stock.profitOrLoss.toFixed(2)) 
                  : 'N/A'}
              </td>
              <td className="py-2 px-3 text-right">
                <button
                  className="text-blue-500 hover:text-blue-700 transition"
                  onClick={() => onEditStock(stock)} // Trigger the edit function
                >
                  Edit
                </button>
                <button
                  className="text-green-500 hover:text-green-700 transition ml-4"
                  onClick={() => updateStockPrice(stock.tickerSymbol)} // Trigger the price update
                >
                  Update Price
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition ml-4"
                  onClick={() => handleDelete(stock.tickerSymbol)} // Delete stock based on ticker
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

export default StockList;

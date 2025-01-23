import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import StockForm from './components/StockForm';
import StockList from './components/StockList';
import { Container, Box } from '@mui/material';

function App() {
  const [stocks, setStocks] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [topStock, setTopStock] = useState('');
  const [portfolioDistribution, setPortfolioDistribution] = useState({});
  const [editingStock, setEditingStock] = useState(null); // State to track the stock being edited

  // Automatically recalculate metrics when stocks change
  useEffect(() => {
    calculatePortfolioMetrics(stocks);
  }, [stocks]);

  const calculatePortfolioMetrics = (stocksList) => {
    let total = stocksList.reduce((acc, stock) => acc + parseFloat(stock.buyPrice) * stock.quantity, 0);
    let top = stocksList.sort((a, b) => (parseFloat(b.buyPrice) * b.quantity) - (parseFloat(a.buyPrice) * a.quantity))[0]?.name || 'N/A';
    
    setTotalValue(total);
    setTopStock(top);
    setPortfolioDistribution(
      stocksList.reduce((dist, stock) => {
        dist[stock.name] = parseFloat(stock.buyPrice);
        return dist;
      }, {})
    );
  };

  const addStock = (stock) => {
    setStocks([...stocks, stock]);
  };

  const deleteStock = (ticker) => {
    setStocks(stocks.filter(stock => stock.ticker !== ticker));
  };

  const startEditing = (stock) => {
    setEditingStock(stock); // Set the stock to be edited
  };

  const updateStock = (updatedStock) => {
    setStocks(stocks.map(stock => 
      stock.ticker === updatedStock.ticker ? updatedStock : stock
    ));
    setEditingStock(null); // Reset editing state after updating
  };

  return (
    <Container>
      <Box mt={5}>
        <Dashboard 
          totalValue={totalValue} 
          topStock={topStock} 
          portfolioDistribution={portfolioDistribution} 
        />
        <StockForm 
          onAddStock={addStock} 
          editingStock={editingStock} 
          onUpdateStock={updateStock} 
        />
        <StockList 
          stocks={stocks} 
          onDeleteStock={deleteStock} 
          onEditStock={startEditing} 
        />
      </Box>
    </Container>
  );
}

export default App;

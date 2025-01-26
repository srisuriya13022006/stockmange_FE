import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Typography, Tooltip } from '@mui/material';
import { AddCircleOutline as AddIcon, Info as InfoIcon } from '@mui/icons-material';
import axios from 'axios';

const StockForm = ({ onAddStock, editingStock, onUpdateStock }) => {
  const [stock, setStock] = useState({
    companyName: '',
    tickerSymbol: '',
    price: '',
    quantity: '',
  });
  
  const [error, setError] = useState('');  // General error message
  const [validationErrors, setValidationErrors] = useState({});  // Validation errors

  useEffect(() => {
    if (editingStock) {
      setStock(editingStock);
    }
  }, [editingStock]);

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};

    // Company Name validation
    if (!stock.companyName) {
      errors.companyName = "Company name is required.";
    }

    // Ticker Symbol validation (must be uppercase and not empty)
    if (!stock.tickerSymbol) {
      errors.tickerSymbol = "Ticker symbol is required.";
    } else if (!/^[A-Z]+$/.test(stock.tickerSymbol)) {
      errors.tickerSymbol = "Ticker symbol must be uppercase letters.";
    }

    // Price validation (must be positive number)
    if (!stock.price || stock.price <= 0) {
      errors.price = "Price must be a positive number.";
    }

    // Quantity validation (must be a positive integer)
    if (!stock.quantity || stock.quantity <= 0 || !Number.isInteger(Number(stock.quantity))) {
      errors.quantity = "Quantity must be a positive integer.";
    }

    setValidationErrors(errors);

    // If there are no validation errors, return true
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset error state
    setValidationErrors({}); // Reset validation errors

    // Validate form inputs before submitting
    if (!validateForm()) {
      return;
    }

    if (editingStock) {
      axios.put(`https://spring-capx.onrender.com/api/stocks/ticker/${stock.tickerSymbol}`, stock)
        .then(response => {
          onUpdateStock(response.data);
        })
        .catch(error => {
          handleBackendError(error);
        });
    } else {
      axios.post('https://spring-capx.onrender.com/api/stocks', stock)
        .then(response => {
          onAddStock(response.data);
        })
        .catch(error => {
          handleBackendError(error);
        });
    }

    // Clear the form after submission
    setStock({ companyName: '', tickerSymbol: '', price: '', quantity: '' });
  };

  // Function to handle backend errors
  const handleBackendError = (error) => {
    if (error.response && error.response.status === 500) {
      if (error.response.data.message.includes('ticker_symbol')) {
        setError('A stock with this ticker symbol already exists.');
      } else {
        setError('An error occurred while adding the stock.');
      }
    } else {
      setError('An unknown error occurred.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 3,
        p: 3,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 3 }} textAlign="center">
        {editingStock ? 'Edit Stock' : 'Add New Stock'}
      </Typography>

      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Company Name"
            name="companyName"
            value={stock.companyName}
            onChange={handleChange}
            fullWidth
            required
            error={!!validationErrors.companyName}
            helperText={validationErrors.companyName}
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <Tooltip title="Enter the full name of the company" arrow>
                  <InfoIcon sx={{ fontSize: 20, color: 'gray' }} />
                </Tooltip>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Ticker Symbol"
            name="tickerSymbol"
            value={stock.tickerSymbol}
            onChange={handleChange}
            fullWidth
            required
            error={!!validationErrors.tickerSymbol}
            helperText={validationErrors.tickerSymbol}
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <Tooltip title="Enter the stock's ticker symbol" arrow>
                  <InfoIcon sx={{ fontSize: 20, color: 'gray' }} />
                </Tooltip>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Price"
            name="price"
            value={stock.price}
            onChange={handleChange}
            fullWidth
            required
            error={!!validationErrors.price}
            helperText={validationErrors.price}
            variant="outlined"
            size="small"
            type="number"
            InputProps={{
              endAdornment: (
                <Tooltip title="Enter the stock's price" arrow>
                  <InfoIcon sx={{ fontSize: 20, color: 'gray' }} />
                </Tooltip>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Quantity"
            name="quantity"
            value={stock.quantity}
            onChange={handleChange}
            fullWidth
            required
            error={!!validationErrors.quantity}
            helperText={validationErrors.quantity}
            variant="outlined"
            size="small"
            type="number"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ width: '100%' }}
          >
            {editingStock ? 'Update Stock' : 'Add Stock'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockForm;

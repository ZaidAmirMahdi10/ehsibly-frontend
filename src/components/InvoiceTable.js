import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
} from '@material-ui/core';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


import './InvoiceTable.scss';

const InvoiceTable = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({
    invoiceNumber: '',
    amountDinar: '',
    amountUS: '',
    amountRNB: '',
    customerNumber: '',
    notes: '',
    swift: '',
    date: '',
  });
  const [error, setError] = useState('');
  const [showInputFields, setShowInputFields] = useState(false);
  const [showAddRowButton, setShowAddRowButton] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [editableIndex, setEditableIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, []); // Fetch data when the component mounts

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/invoices');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  const handleDateChange = (date) => {
    setNewRow((prevRow) => ({ ...prevRow, date }));
  };

  const isInvoiceNumberUnique = (invoiceNumber) => {
    return !data.some((row) => row.invoiceNumber === invoiceNumber);
  };

  const handleAddRow = async () => {
    if (!newRow.invoiceNumber.trim()) {
      setError('Invoice number cannot be empty.');
      return;
    }

    if (!isInvoiceNumberUnique(newRow.invoiceNumber)) {
      setError('Invoice number must be unique.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/invoices', {
        ...newRow,
      });
  
      fetchData();
      setNewRow({
        invoiceNumber: '',
        amountDinar: '',
        amountUS: '',
        amountRNB: '',
        customerNumber: '',
        notes: '',
        swift: '',
        date: '',
      });
      setError('');
      setShowInputFields(false);
    } catch (error) {
      console.error('Error adding new invoice:', error);
      setError('Error adding new invoice.');
    }
  };

  const handleShowInputFields = () => {
    setShowInputFields(true);
  };

  const cancelEdit = () => {
    setShowAddRowButton(true);
    setShowInputFields(false);
    setNewRow({
      invoiceNumber: '',
      amountDinar: '',
      amountUS: '',
      amountRNB: '',
      customerNumber: '',
      notes: '',
      swift: '',
      date: '',
    });
    setEditableIndex(null);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return data;
    }

    const filteredData = data.filter((row) => {
      if (selectedTitle === '') {
        return Object.values(row)
          .some((value) => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase()));
      } else {
        const selectedValue = row[selectedTitle];
        const value = selectedValue ? selectedValue.toString().toLowerCase() : '';
        return value === searchQuery.toLowerCase();
      }
    });

    return filteredData;
  };

  const handleEdit = (index) => {
    setShowAddRowButton(false);
    setEditableIndex(index);
    setNewRow(data[index]);
  };

  const handleConfirmEdit = async () => {
    try {
      const updatedInvoice = await axios.put(`http://localhost:3001/invoices/${data[editableIndex].id}`, {
        ...newRow,
      });
  
      setData((prevData) => {
        const newData = [...prevData];
        newData[editableIndex] = updatedInvoice.data;
        return newData;
      });
  
      setNewRow({
        invoiceNumber: '',
        amountDinar: '',
        amountUS: '',
        amountRNB: '',
        customerNumber: '',
        notes: '',
        swift: '',
        date: '',
      });
  
      setShowAddRowButton(true);
      setShowInputFields(false);
      setEditableIndex(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
      setError('Error updating invoice.');
    }
  };
  

  return (
    <div className="invoice-table-container">
      <div className="search-bar">
        <label>Search: </label>
        <Input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <label>Title: </label>
        <Select
          value={selectedTitle}
          onChange={(e) => setSelectedTitle(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="invoiceNumber">Invoice Number</MenuItem>
          <MenuItem value="amountDinar">Amount Dinar</MenuItem>
          <MenuItem value="amountUS">Amount US</MenuItem>
          <MenuItem value="amountRNB">Amount RNB</MenuItem>
          <MenuItem value="customerNumber">Customer Number</MenuItem>
          <MenuItem value="notes">Notes</MenuItem>
          <MenuItem value="swift">SWIFT</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
        <Button type="button" variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Amount Dinar</TableCell>
              <TableCell>Amount US</TableCell>
              <TableCell>Amount RNB</TableCell>
              <TableCell>Customer Number</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>SWIFT</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {handleSearch().map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{editableIndex === index ? <Input type="text" name="invoiceNumber" value={newRow.invoiceNumber} onChange={handleInputChange} /> : row.invoiceNumber}</TableCell>
                <TableCell>{editableIndex === index ? <Input type="text" name="amountDinar" value={newRow.amountDinar} onChange={handleInputChange} /> : row.amountDinar}</TableCell>
                <TableCell>{editableIndex === index ? <Input type="text" name="amountUS" value={newRow.amountUS} onChange={handleInputChange} /> : row.amountUS}</TableCell>
                <TableCell>{editableIndex === index ? <Input type="text" name="amountRNB" value={newRow.amountRNB} onChange={handleInputChange} /> : row.amountRNB}</TableCell>
                <TableCell>{editableIndex === index ? <Input type="text" name="customerNumber" value={newRow.customerNumber} onChange={handleInputChange} /> : row.customerNumber}</TableCell>
                <TableCell>{editableIndex === index ? <Input type="text" name="notes" value={newRow.notes} onChange={handleInputChange} /> : row.notes}</TableCell>
                <TableCell>{editableIndex === index ? <Input type="text" name="swift" value={newRow.swift} onChange={handleInputChange} /> : row.swift}</TableCell>
                <TableCell>
                  {editableIndex === index ? (
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date"
                        value={newRow.date}
                        onChange={(date) => handleDateChange(date)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  ) : (
                    row.date ? new Date(row.date).toLocaleDateString() : ''
                  )}
                </TableCell>
                <TableCell className='edit-row-action-buttons'>
                  {editableIndex === index ? (
                    <>
                      <Button variant="contained" color="secondary" onClick={cancelEdit}>Cancel</Button>
                      <Button variant="contained" color="primary" onClick={handleConfirmEdit}>Confirm</Button>
                    </>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => handleEdit(index)}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {showInputFields && editableIndex === null && (
              <TableRow>
                <TableCell>{handleSearch().length + 1}</TableCell>
                <TableCell>
                  <Input type="text" name="invoiceNumber" value={newRow.invoiceNumber} onChange={handleInputChange} />
                </TableCell>
                <TableCell>
                  <Input type="text" name="amountDinar" value={newRow.amountDinar} onChange={handleInputChange} />
                </TableCell>
                <TableCell>
                  <Input type="text" name="amountUS" value={newRow.amountUS} onChange={handleInputChange} />
                </TableCell>
                <TableCell>
                  <Input type="text" name="amountRNB" value={newRow.amountRNB} onChange={handleInputChange} />
                </TableCell>
                <TableCell>
                  <Input type="text" name="customerNumber" value={newRow.customerNumber} onChange={handleInputChange} />
                </TableCell>
                <TableCell>
                  <Input type="text" name="notes" value={newRow.notes} onChange={handleInputChange} />
                </TableCell>
                <TableCell>
                  <Input type="text" name="swift" value={newRow.swift} onChange={handleInputChange} />
                </TableCell>
                <TableCell>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date"
                      value={newRow.date}
                      onChange={(date) => handleDateChange(date)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {error && <div className="error-message">{error}</div>}

      {showAddRowButton ? (
        <div className='add-row-action-buttons'>
            {showInputFields ? (
            <div className="action-buttons">
                <Button variant="contained" color="secondary" onClick={cancelEdit}>
                Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleAddRow}>
                Confirm
                </Button>
            </div>
            ) : (
            <Button type="button" variant="contained" color="primary" onClick={handleShowInputFields}>
                Add new row
            </Button>
            )}
        </div>
        ) : (
            <></>
        )}
    </div>
  );
};

export default InvoiceTable;

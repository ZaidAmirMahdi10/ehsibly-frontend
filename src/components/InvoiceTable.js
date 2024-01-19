// im-app/src/components/InoviceTable.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormControl,
  Select as MaterialSelect,
  Checkbox,
} from '@material-ui/core';

import ReactDOMServer from 'react-dom/server';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


import './InvoiceTable.scss';
import PrintTable from './PrintTable'; 

const InvoiceTable = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({
    invoiceNumber: '',
    companyName: '',
    customerName: '',
    containerNumber: '', 
    amountDinar: '',
    amountOtherCurrency: '',
    otherCurrency: '',
    bankName: '',
    received: '',
    left: '',
    swift: '',
    date: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [showInputFields, setShowInputFields] = useState(false);
  const [showAddRowButton, setShowAddRowButton] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [editableIndex, setEditableIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchData();
  }, [showInputFields]); // Fetch data when the component mounts

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token'); 
      // Ensure userId is stored as a number
      const userId = parseInt(localStorage.getItem('userId'), 10);
      
      //  This is for local testing
      // const response = await axios.get('http://localhost:3001/invoice', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'User-Id': userId,
      //   },
      // });

      //  This is for Netlify
      const response = await axios.get('https://im-app-backend.netlify.app/.netlify/functions/getInvoice', {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Id': userId,
        },
      });

      //  This is for local Netlify (use the comand: "netlify dev" in the backend terminal)
      // const response = await axios.get('http://localhost:8888/.netlify/functions/getInvoices', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'User-Id': userId,
      //   },
      // });


      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };
  
  
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
  };


  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  
    // Update the selected status for all rows in the data array
    setData((prevData) => {
      return prevData.map((row) => {
        return { ...row, selected: !selectAll };
      });
    });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prevRow) => {
      let updatedRow = { ...prevRow, [name]: value };
  
      // Calculate "left" only when "received" changes
      if (name === "received") {
        const amountDinar = parseFloat(updatedRow.amountDinar.replace(/[^\d.]/g, '').replace(/(\d)(?=(\d{3})+\.)/g, '$1,')) || 0;
        const received = parseFloat(value.replace(/[^\d.]/g, '').replace(/(\d)(?=(\d{3})+\.)/g, '$1,')) || 0;
        updatedRow.left = amountDinar - received; 
      }
  
      return updatedRow;
    });
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
      const token = localStorage.getItem('token');
      const userId = parseInt(localStorage.getItem('userId'), 10);

      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }

      //  This is for local testing
      // await axios.post('http://localhost:3001/invoice', { ...newRow, userId });

      
      // This is for Netlify
      await axios.post('https://im-app-backend.netlify.app/.netlify/functions/postInvoice', { ...newRow }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Id': userId,
        },
      });

      //  This is for local Netlify (use the comand: "netlify dev" in the backend terminal)
      // await axios.post('http://localhost:8888/.netlify/functions/postInvoice', { ...newRow });
      

      fetchData();
      setNewRow({
        invoiceNumber: '',
        companyName: '',
        customerName: '', 
        containerNumber: '',
        amountDinar: '',
        amountOtherCurrency: '',
        otherCurrency: '',
        bankName: '',
        received: '',
        left: '',
        swift: '',
        date: '',
        notes: '',
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
      companyName: '',
      customerName: '', 
      amountDinar: '',
      amountOtherCurrency: '',
      otherCurrency: '',
      bankName: '',
      received: '',
      left: '',
      swift: '',
      date: '',
      notes: '',
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
    const userId = localStorage.getItem('userId');
    const invoiceId = data[index].id;
    setShowAddRowButton(false);
    setEditableIndex(index);
    setNewRow(data[index]);
  };
  

  const handleConfirmEdit = async () => {
    try {
      //  This is for local testing
      // const updatedInvoice = await axios.put(`http://localhost:3001/invoices/${data[editableIndex].id}`, {...newRow,});
      
      //  This is for Netlify
      const updatedInvoice = await axios.put(`https://im-app-backend.netlify.app/.netlify/functions/updateInvoice/${data[editableIndex].id}`, { ...newRow });

      //  This is for local Netlify
      // const updatedInvoice = await axios.put(`http://localhost:8888/.netlify/functions/updateInvoice/${data[editableIndex].id}`, { ...newRow });

      setData((prevData) => {
        const newData = [...prevData];
        newData[editableIndex] = updatedInvoice.data;
        return newData;
      });
      
      console.log('Above setNewRow((prevRow)');
      setNewRow((prevRow) => {
        const { received } = newRow;
        const amountDinar = parseFloat(newRow.amountDinar) || 0;
        const receivedValue = parseFloat(received) || 0;
        const leftValue = (amountDinar - receivedValue).toFixed(2).toString();
        console.log('Type of leftValue:', typeof leftValue);

        return { ...updatedInvoice.data, received, left: leftValue };
      });
      
      setShowAddRowButton(true);
      setShowInputFields(false);
      setEditableIndex(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
      setError('Error updating invoice.');
    }
  };
  

  const handleRemove = async (index) => {
    const invoiceId = data[index].id;

    // Display a confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");

    if (confirmDelete) {
      try {
        // Send a DELETE request to your backend API
        // This is for local testing
        // await axios.delete(`http://localhost:3001/invoices/${invoiceId}`);
        
        // This is for Netlify
        await axios.delete(`https://im-app-backend.netlify.app/.netlify/functions/deleteInvoice/${invoiceId}`);

        // This is for local Netlify (use the comand: "netlify dev" in the backend terminal)
        // await axios.delete(`http://localhost:8888/.netlify/functions/deleteInvoice/${invoiceId}`);

        // Update the state to reflect the removal
        setData((prevData) => prevData.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error removing invoice:', error);
        setError('Error removing invoice.');
      }
    }
  };


  const handlePrint = () => {
    // Filter data based on selected rows
    const selectedRows = data.filter((row) => row.selected);
    
    // Open a new window with the print layout
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>');
    // Add your main styles for printing here
    printWindow.document.write(`
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
  
      .print-container {
        display: flex;
        flex-direction: column;
      }
  
      .invoice-block {
        background-color: #f5f5f5;
        border-bottom: 2px solid gray;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
      }
  
      .print-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
  
      /* Add more styles for individual elements as needed */
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<div id="print-content">');
    printWindow.document.write('<h1>Printable Table</h1>');
  
    // Render the PrintTable component as a string
    const printTableString = ReactDOMServer.renderToString(<PrintTable data={selectedRows} />);
    printWindow.document.write(printTableString);
  
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    printWindow.print();
  };
  

  
  
  return (
    <div className="invoice-table-container">
      <div className='invoice-banner'>Ehsibly</div>
      <div className='user-logout'>
        <div className='user'>
          {`USER: ${localStorage.getItem('username')}`} {/* Display the username or any other user info */}
        </div>
        <button className='c-button' onClick={handleLogout}>Logout</button> 
      </div>
      <div className="search-bar">
        <label>Search: </label>
        <Input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <label>Title: </label>
        <Select
          value={selectedTitle}
          onChange={(e) => setSelectedTitle(e.target.value)}
        >
          <MenuItem className="bold-text " value="">All</MenuItem>
          <MenuItem className="bold-text " value="invoiceNumber">Invoice Number</MenuItem>
          <MenuItem className="bold-text " value="customerName">Customer Name</MenuItem>
          <MenuItem className="bold-text " value="companyName">Company</MenuItem>
          <MenuItem className="bold-text " value="containerNumber">Container Number</MenuItem>
          <MenuItem className="bold-text " value="amountDinar">Amount Dinar</MenuItem>
          <MenuItem className="bold-text " value="amountOtherCurrency">Currency Rate</MenuItem>
          <MenuItem className="bold-text " value="otherCurrency">Currency</MenuItem>
          <MenuItem className="bold-text " value="bankName">Bank Name</MenuItem>
          <MenuItem className="bold-text " value="received">Received</MenuItem>
          <MenuItem className="bold-text " value="left">Left</MenuItem>
          <MenuItem className="bold-text " value="swift">SWIFT</MenuItem>
          <MenuItem className="bold-text " value="date">Date</MenuItem>
          <MenuItem className="bold-text " value="notes">Notes</MenuItem>
        </Select>
        <Button type="button" variant="contained" style={{backgroundColor: 'purple', color: 'white'}}onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div className='top-action-buttons'>
        {showAddRowButton ? (
            <div>
              {showInputFields ? (
                  <div className="sub-top-action-buttons">
                    <Button variant="contained" color="secondary" onClick={cancelEdit}>
                      Cancel
                    </Button>
                    <Button variant="contained" style={{backgroundColor: 'green', color: 'white'}} onClick={handleAddRow}>
                      Confirm
                    </Button>
                  </div>
                ) : (
                  <Button className='c-button' type="button" variant="contained" style={{backgroundColor: 'purple', color: 'white'}}onClick={handleShowInputFields}>
                      Add new row
                  </Button>
                )
              }
            </div>
          ) : (
              <></>
          )
        }  
        <Button className='c-button' variant="contained" onClick={handlePrint}>
          Print
        </Button>
      </div>

      {loading ? 
      (
        <>
          <div className="loader">
            <div className="loader-text">Loading...</div>
          </div>
        </>
      ) 
      : 
      (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                  <TableRow>
                    {!showInputFields && (
                      <TableCell className="bold-text">
                        {/* Select or deselect all */}
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                    )}
                    <TableCell className="bold-text">ID</TableCell>
                    <TableCell className="bold-text  cell-title">Invoice Number</TableCell>
                    <TableCell className="bold-text  cell-title">Customer Name</TableCell>
                    <TableCell className="bold-text  cell-title">Company</TableCell>
                    <TableCell className="bold-text  cell-title">Container No.</TableCell>
                    <TableCell className="bold-text  cell-title">Amount Dinar</TableCell>
                    <TableCell className="bold-text cell-title">Currency Rate</TableCell>
                    <TableCell className="bold-text cell-title">Currency</TableCell>
                    <TableCell className="bold-text  cell-title">Bank Name</TableCell>
                    <TableCell className="bold-text cell-title">Received</TableCell>
                    <TableCell className="bold-text cell-title">Left</TableCell>
                    <TableCell className="bold-text cell-title">SWIFT</TableCell>
                    <TableCell className="bold-text cell-title">Date</TableCell>
                    <TableCell className="bold-text cell-title">Notes</TableCell>
                    <TableCell className="bold-text ">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {/* Thie is for adding new row */}
                {showInputFields && editableIndex === null && (
                  <>
                    <TableRow>
                      <TableCell>{handleSearch().length + 1}</TableCell>
                      <TableCell>
                        <Input type="text" name="invoiceNumber" value={newRow.invoiceNumber} onChange={handleInputChange} />
                      </TableCell>
                      <TableCell>
                        <Input type="text" name="customerName" value={newRow.customerName} onChange={handleInputChange} />
                      </TableCell>
                      <TableCell>
                        <Input type="text" name="companyName" value={newRow.companyName} onChange={handleInputChange} />
                      </TableCell>
                      <TableCell>
                        <Input type="text" name="containerNumber" value={newRow.containerNumber} onChange={handleInputChange} />
                      </TableCell>
                      <TableCell>
                        <Input type="text" name="amountDinar" value={newRow.amountDinar} onChange={handleInputChange} />
                      </TableCell>
                      <TableCell>
                        <Input type="text" name="amountOtherCurrency" value={newRow.amountOtherCurrency} onChange={handleInputChange} />
                      </TableCell>

                      <TableCell>
                        <FormControl>
                          <MaterialSelect
                            name="otherCurrency"
                            value={newRow.otherCurrency}
                            onChange={handleInputChange}
                          >
                            <MenuItem value="US">US</MenuItem>
                            <MenuItem value="EURO">EURO</MenuItem>
                            <MenuItem value="RNB">RNB</MenuItem>
                            <MenuItem value="GBP">GBP</MenuItem>
                          </MaterialSelect>
                        </FormControl>
                      </TableCell>

                      <TableCell>
                        <Input type="text" name="bankName" value={newRow.bankName} onChange={handleInputChange} />
                      </TableCell>
                      <TableCell>
                        <Input type="text" name="received" value={newRow.received} onChange={handleInputChange} />
                      </TableCell>
                      <TableCell>
                        <Input type="text" name="left" value={newRow.left} onChange={handleInputChange} />
                      </TableCell>

                      <TableCell>
                        <FormControl>
                          {/* <InputLabel id={`currency-label-${index}`}>Currency</InputLabel> */}
                          <MaterialSelect
                            name="swift"
                            value={newRow.swift}
                            onChange={handleInputChange}
                          >
                            <MenuItem value="SWIFT">SWIFT</MenuItem>
                            <MenuItem value="NO SWIFT">NO SWIFT</MenuItem>
                          </MaterialSelect>
                        </FormControl>
                      </TableCell>
                      
                      <TableCell>
                        <div style={{ height: '50px' }} className='extra-padding-buttom'>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disableToolbar
                              variant="inline"
                              format="MM/dd/yyyy"
                              margin="normal"
                              id="date-picker-inline"
                              // label="Date"
                              value={newRow.date}
                              onChange={(date) => handleDateChange(date)}
                              KeyboardButtonProps={{
                                'aria-label': 'change date',
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Input type="text" name="notes" value={newRow.notes} onChange={handleInputChange} />
                      </TableCell>
                    </TableRow>
                    {error && <div className="error-message">{error}</div>}
                  </>
                )}

                {/* These are the existing rows */}
                {handleSearch().map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {!showInputFields && editableIndex !== index && (
                        <Checkbox
                          checked={row.selected || false}
                          onChange={(e) => {
                            const updatedRow = [...data];
                            updatedRow[index].selected = e.target.checked;
                            setData(updatedRow);
                          }}
                        />
                      )}
                    </TableCell>


                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{editableIndex === index ? <Input type="text" name="invoiceNumber" value={newRow.invoiceNumber} onChange={handleInputChange} /> : row.invoiceNumber}</TableCell>
                    <TableCell>{editableIndex === index ? <Input type="text" name="customerName" value={newRow.customerName} onChange={handleInputChange} /> : row.customerName}</TableCell>
                    <TableCell>{editableIndex === index ? <Input type="text" name="companyName" value={newRow.companyName} onChange={handleInputChange} /> : row.companyName}</TableCell>
                    <TableCell>{editableIndex === index ? <Input type="text" name="containerNumber" value={newRow.containerNumber} onChange={handleInputChange} /> : row.containerNumber}</TableCell>
                    <TableCell>{editableIndex === index ? <Input type="text" name="amountDinar" value={newRow.amountDinar} onChange={handleInputChange} /> : row.amountDinar}</TableCell>
                    <TableCell>{editableIndex === index ? <Input type="text" name="amountOtherCurrency" value={newRow.amountOtherCurrency} onChange={handleInputChange} /> : row.amountOtherCurrency}</TableCell>
                    
                    <TableCell>
                      {editableIndex === index ? (
                        <FormControl>
                          <MaterialSelect
                            labelId={`currency-label-${index}`}
                            id={`currency-select-${index}`}
                            name="otherCurrency"
                            value={newRow.otherCurrency}
                            onChange={handleInputChange}
                          >
                            <MenuItem value="US">US</MenuItem>
                            <MenuItem value="EURO">EURO</MenuItem>
                            <MenuItem value="RNB">RNB</MenuItem>
                            <MenuItem value="GBP">GBP</MenuItem>
                          </MaterialSelect>
                        </FormControl>
                      ) : (
                        row.otherCurrency
                      )}
                    </TableCell>

                    <TableCell>{editableIndex === index ? <Input type="text" name="bankName" value={newRow.bankName} onChange={handleInputChange} /> : row.bankName}</TableCell>
                    <TableCell>{editableIndex === index ? <Input type="text" name="received" value={newRow.received} onChange={handleInputChange} /> : row.received}</TableCell>
                    <TableCell>{editableIndex === index ? <Input type="text" name="left" value={newRow.left} onChange={handleInputChange} /> : row.left}</TableCell>
                    
                    <TableCell>
                      {editableIndex === index ? (
                        <FormControl>
                          <MaterialSelect
                            labelId={`swift-label-${index}`}
                            id={`swift-select-${index}`}
                            name="swift"
                            value={newRow.swift}
                            onChange={handleInputChange}
                          >
                            <MenuItem value="SWIFT">SWIFT</MenuItem>
                            <MenuItem value="NO SWIFT">NO SWIFT</MenuItem>
                          </MaterialSelect>
                        </FormControl>
                      ) : (
                        row.swift
                      )}
                    </TableCell>

                    <TableCell>
                      {editableIndex === index ? (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            // label="Date"
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
                    <TableCell>{editableIndex === index ? <Input type="text" name="notes" value={newRow.notes} onChange={handleInputChange} /> : row.notes}</TableCell>
                    <TableCell className='edit-row-action-buttons'>
                      {editableIndex === index ? (
                        <>
                          <Button className='c-button' variant="contained" color="secondary" onClick={cancelEdit}>Cancel</Button>
                          <Button className='c-button' variant="contained" style={{backgroundColor: 'purple', color: 'white'}}onClick={handleConfirmEdit}>Confirm</Button>
                        </>
                      ) : (
                        <>
                          <Button className='c-button' variant="contained" style={{backgroundColor: 'lightgray', color: 'white'}} onClick={() => handleEdit(index)}>Edit</Button>
                          <Button className='c-button' variant="contained" style={{backgroundColor: 'red', color: 'white'}} onClick={() => handleRemove(index)}>Remove</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {error && <div className="error-message">{error}</div>}

          {showAddRowButton ? (
            <div className='add-row-action-buttons'>
              {showInputFields ? (
                  <div className="action-buttons">
                    <Button className='c-button' variant="contained" color="secondary" onClick={cancelEdit}>
                      Cancel
                    </Button>
                    <Button className='c-button' variant="contained" style={{backgroundColor: 'green', color: 'white'}} onClick={handleAddRow}>
                      Confirm
                    </Button>
                  </div>
                ) : (
                  <Button className='c-button' type="button" variant="contained" style={{backgroundColor: 'purple', color: 'white'}}onClick={handleShowInputFields}>
                      Add new row
                  </Button>
                )
              }
              <Button className='c-button' variant="contained" style={{backgroundColor: 'lightgray', color: 'white'}} onClick={handlePrint}>
                Print
              </Button>
            </div>
            ) : (
                <></>
          )}
        </>
      )}
    </div>
  );
};

export default InvoiceTable;


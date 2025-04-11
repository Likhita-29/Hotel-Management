import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Search from "../Search/Search.js";
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import {Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon,} from '@mui/icons-material';

const Finance = () => {
  const [finances, setFinances] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedFinances, setSelectedFinances] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [filteredFinances, setFilteredFinances] = useState([]);

  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/finance";

  //Fetch Branches from API
  const fetchFinances = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-allfinance`);
      console.log("Fetching Finances - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.finance)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setFinances([]);
        return;
      } 

      const financeData = response.data.finance;
      console.log("Processed finance data:", financeData);

      if (financeData.length ===0) {
        console.log("No finances found in the response");
      }

      setFinances(financeData);
      setFilteredFinances(financeData);

    } catch (error) {
      console.error("Error fetching finance details:", error);
      toast.error(error.response?.data?.message || "Error loading finance details:");
      setFinances([]);
      setFilteredFinances([]);
    }
  };

  useEffect(() => {
     console.log("Initiating finances data fetch...");
     fetchFinances();
  }, []);

  //Add search effect
    useEffect(() => {
      if (!searchTerm) {
        setFilteredFinances(finances);
        return;
      }
    
      const filtered = finances.filter((finance) => {
        if (!finance[searchField]) return false; // Avoid undefined values
        return finance[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    
      setFilteredFinances(filtered);
    }, [searchTerm, searchField, finances]);

  const handleClose = () => {
    setViewOpen(false);
    setSelectedFinances(null);
    setOpen(false);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedFinances({
      name:'',
      amount:'',
      transactionType: '',
      category: '',
      paymentMode: '',
      transactionDate: '',
      status: 'Pending',
    });
    setOpen(true);
    setIsEditing(false);
  };

  const handleEdit = (finance) => {
    setSelectedFinances(finance);
    setIsEditing(true);
    setOpen(true);
  };

  const handleView = (finance) => {
    setSelectedFinances(finance);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-finance/${id}`)
    .then(() => {
       toast.success("Finance deleted successfully");
       fetchFinances();
    })
    .catch(error =>{
      console.error("Error deleting finance:", error);
      toast.error("Failed to delete finance");
    });
};

  const handleSave = () => {
    if (!selectedFinances) return;   //selectedFinance
    
        console.log("Saving Finance:", selectedFinances);
    
        if (isEditing) {
          if (!selectedFinances._id) {  //selectedFinance
            console.error("Finance ID is missing!");
            toast.error("Finance ID is missing!");
            return;
          }

          axios.put(`${API_BASE_URL}/update-finance/${selectedFinances._id}`, selectedFinances)
        .then(response =>{
           console.log("Updated Finance:", response.data);
           toast.success("Finance upadated successfully");
           handleClose();
           fetchFinances();
        })
        .catch(error => {
           console.error("Error updating finance:",error);
           toast.error("Failed to update finance");
        });

      } else {
        axios.post(`${API_BASE_URL}/add-finance`, selectedFinances)
          .then(response => {
             console.log("Added Finance:", response.data);
             toast.success("Finance added successfully");
             handleClose();
             fetchFinances();
          })
          .catch(error =>{
             console.error("Error adding finance:", error);
             toast.error("Failed to add finance");
          });
        }
    };

  const handleChange = (e) => {
    setSelectedFinances({
      ...selectedFinances,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box className="container">
    <ToastContainer position="top-center" autoClose={3000} />
    <Box display={'flex'} justifyContent={'space-between'} marginBottom={'10px'} >

<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
{/* Dropdown for Selecting Search Field */}
<TextField
  className="search"
  select
  value={searchField}
  onChange={(e) => setSearchField(e.target.value)}
  size="small"
  variant="outlined"
  label="Search By"
>
  <MenuItem value="name">Name</MenuItem>
  <MenuItem value="paymentMode">Payment Mode</MenuItem>
  <MenuItem value="transactionDate">Transaction Date</MenuItem>
  <MenuItem value="status">Status</MenuItem>
</TextField>

  {/* Search */}
  <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
  </div>

  {/* Add Button */}
  <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd} >
    Add New
  </Button>
</Box>

    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>      
        <Table stickyHeader>
          <TableHead>
            <TableRow>
            <TableCell align="center" ><b>Sl No</b></TableCell>
              <TableCell align="center" ><b>Name</b></TableCell>
              <TableCell align="center" ><b>Amount</b></TableCell>
              <TableCell align="center" ><b>Transaction Type</b></TableCell>
              <TableCell align="center" ><b>Category</b></TableCell>
              <TableCell align="center" ><b>Payment Mode</b></TableCell>
              <TableCell align="center" ><b>Transaction Date</b></TableCell>
              <TableCell align="center" ><b>Status</b></TableCell>
              <TableCell align="center" ><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFinances.map((finance, index) => (
              <TableRow key={finance._id}>
                <TableCell align="center" >{index + 1 }</TableCell>
                <TableCell align="center" >{finance.name}</TableCell>
                <TableCell align="center" >{finance.amount}</TableCell>
                <TableCell align="center" >{finance.transactionType}</TableCell>
                <TableCell align="center" >{finance.category}</TableCell>
                <TableCell align="center" >{finance.paymentMode}</TableCell>
                <TableCell align="center" >{finance.transactionDate}</TableCell>
                <TableCell align="center" >{finance.status}</TableCell>
                <TableCell>                        {/*sx={{ display:"flex", flexDirection:"column" }}*/}
                    <IconButton onClick={() => handleView(finance)} sx={{ color: 'rgb(91, 93, 97)' }} size='small'>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(finance)} sx={{ color: 'rgb(1, 1, 55)' }} size='small'>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(finance._id)} sx={{ color: 'rgb(174, 26, 26)' }} size='small'>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

       {/* Add/Edit Dialog */}
       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Finance' : 'Add New Finance'}
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{scrollbarWidth: 'none'}}>
          <Box className="form-fields">
            <TextField
              name="name"
              label="Name"
              value={selectedFinances?.name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="amount"
              label="Amount"
              value={selectedFinances?.amount || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="transactionType"
              label="Transaction Type"
              value={selectedFinances?.transactionType || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </TextField>
            <TextField
              name="category"
              label="Category"
              value={selectedFinances?.category || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Salary">Salary</MenuItem>
              <MenuItem value="Payment Rent">Payment Rent</MenuItem>
              <MenuItem value="Utilities">Utilities</MenuItem>
            </TextField>
            <TextField
              name="paymentMode"
              label="Payment Mode"
              value={selectedFinances?.paymentMode || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Debit Card">Debit Card</MenuItem>
            </TextField>
            <TextField
              name="transactionDate"
              label="Transaction Date"
              value={selectedFinances?.transactionDate || ''}
              onChange={handleChange}
              type='date'
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true, 
              }}
            />
            <TextField
              name="status"
              label="Status"
              value={selectedFinances?.status || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
       {/* View Dialog */}
       <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Finance Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedFinances && (
            <Box className="view-details">
              <div style={{marginBottom:'5px'}}><strong>Name:</strong> {selectedFinances.name}</div>
              <div style={{marginBottom:'5px'}}><strong>Amount:</strong> {selectedFinances.amount}</div>
              <div style={{marginBottom:'5px'}}><strong>Transaction Type:</strong> {selectedFinances.transactionType}</div>
              <div style={{marginBottom:'5px'}}><strong>Category:</strong> {selectedFinances.category}</div>
              <div style={{marginBottom:'5px'}}><strong>Payment Mode:</strong> {selectedFinances.paymentMode}</div>
              <div style={{marginBottom:'5px'}}><strong>Transaction Date:</strong> {selectedFinances.transactionDate}</div>
              <div style={{marginBottom:'5px'}}><strong>Status:</strong> {selectedFinances.status}</div>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  </Box>
  );
};

export default Finance;

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Search from '../Search/Search.js';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import {Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon,} from '@mui/icons-material';

const Discount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("discountCode");
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);

  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/discount";
  
  //Fetch Branches from API
  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-alldiscount`);
      console.log("Fetching Discounts - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.discount)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setDiscounts([]);
        return;
      } 

      const discountData = response.data.discount;
      console.log("Processed discount data:", discountData);

      if (discountData.length ===0) {
        console.log("No discounts found in the response");
      }

      const today = new Date().setHours(0, 0, 0, 0); // normalize today's date

      const updatedDiscounts = discountData.map((discount) => {
        const validFrom = new Date(discount.validFrom).setHours(0, 0, 0, 0);
        const validTo = new Date(discount.validTo).setHours(0, 0, 0, 0);
  
        // Automatically set status based on today's date
        if (validFrom <= today && today <= validTo) {
          return { ...discount, status: "Active" };
        } else if (today < validFrom) {
          return { ...discount, status: "Upcoming" };
        } else {
          return { ...discount, status: "Expired" };
        }
      });
  
      const activeDiscounts = updatedDiscounts.filter((discount) => discount.status === "Active");

      setDiscounts(updatedDiscounts);
      setFilteredDiscounts(activeDiscounts);
  
    } catch (error) {
      console.error("Error fetching discount details:", error);
      toast.error(error.response?.data?.message || "Error loading discount details:");
      setDiscounts([]);
      setFilteredDiscounts([]);
    }
  };

  useEffect(() => {
     console.log("Initiating discounts data fetch...");
     fetchDiscounts();
  }, []);

  //Add search effect
    useEffect(() => {
      if (!searchTerm) {
        setFilteredDiscounts(discounts);
        return;
      }
    
      const filtered = discounts.filter((discount) => {
        if (!discount[searchField]) return false; // Avoid undefined values
        return discount[searchField].toString().toLowerCase().startsWith(searchTerm.toLowerCase());
      });
    
      setFilteredDiscounts(filtered);
    }, [searchTerm, searchField, discounts]);

  const handleClose = () => {
    setViewOpen(false);
    setSelectedDiscounts(null);
    setOpen(false);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedDiscounts({
      discountCode:'',
      discountDescription:'',
      discountValue: '',
      validFrom: '',
      validTo: '',
      status: 'Expired',
    });
    setOpen(true);
    setIsEditing(false);
  };

  const handleEdit = (discount) => {
    setSelectedDiscounts(discount);
    setIsEditing(true);
    setOpen(true);
  };

  const handleView = (discount) => {
    setSelectedDiscounts(discount);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-discount/${id}`)
      .then(() => {
         toast.success("Discount deleted successfully");
         fetchDiscounts();
      })
      .catch(error =>{
        console.error("Error deleting discount:", error);
        toast.error("Failed to delete discount");
      });
  };

  const handleSave = () => {
    if (!selectedDiscounts) return;   //selectedDiscount

    console.log("Saving Discount:", selectedDiscounts);

    if (isEditing) {
      if (!selectedDiscounts._id) {  //selectedDiscount
        console.error("Discount ID is missing!");
        toast.error("Discount ID is missing!");
        return;
      }

      axios.put(`${API_BASE_URL}/update-discount/${selectedDiscounts._id}`, selectedDiscounts)
        .then(response =>{
           console.log("Updated Discount:", response.data);
           toast.success("Discount upadated successfully");
           handleClose();
           fetchDiscounts();
        })
        .catch(error => {
           console.error("Error updating discount:",error);
           toast.error("Failed to update discount");
        });

    } else {
      axios.post(`${API_BASE_URL}/add-discount`, selectedDiscounts)
        .then(response => {
           console.log("Added Discount:", response.data);
           toast.success("Discount added successfully");
           handleClose();
           fetchDiscounts();
        })
        .catch(error =>{
           console.error("Error adding discount:", error);
           toast.error("Failed to add discount");
        });
      }
  };

  const handleChange = (e) => {
    setSelectedDiscounts({
      ...selectedDiscounts,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box className="container">
      <ToastContainer position="top-center" autoClose={3000} />
      <Box display={'flex'} justifyContent={'space-between'} marginBottom={'15px'} >

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
        <MenuItem value="discountCode">Discount Code</MenuItem>
        <MenuItem value="discountValue">Discount Value</MenuItem>
        <MenuItem value="status">Status</MenuItem>
      </TextField>

        {/* Search */}
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </div>

        {/* Add Button */}
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} 
        sx={{ backgroundColor: 'rgb(1, 1, 55)','&:hover': {backgroundColor: 'rgb(1, 1, 90)'}, fontSize:"13px" }}>
        Add New Discount
        </Button>
      </Box>

    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>      
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" ><b>Sl No</b></TableCell>
              <TableCell align="center" ><b>Discount Code</b></TableCell>
              <TableCell align="center" ><b>Discount Description</b></TableCell>
              <TableCell align="center" ><b>Discount Value</b></TableCell>
              <TableCell align="center" ><b>Valid From</b></TableCell>
              <TableCell align="center" ><b>Valid To</b></TableCell>
              <TableCell align="center" ><b>Status</b></TableCell>
              <TableCell align="center" ><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDiscounts.map((discount, index) => (
              <TableRow key={discount._id}>
                <TableCell align="center" >{index + 1 }</TableCell>
                <TableCell align="center" >{discount.discountCode}</TableCell>
                <TableCell align="center" >{discount.discountDescription}</TableCell>
                <TableCell align="center" >{discount.discountValue}%</TableCell>
                <TableCell align="center" >{discount.validFrom}</TableCell>
                <TableCell align="center" >{discount.validTo}</TableCell>
                <TableCell align="center" >{discount.status}</TableCell>
                <TableCell>
                    <IconButton onClick={() => handleView(discount)} sx={{ color: 'rgb(1, 1, 55)' }} size='small'>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(discount)} sx={{ color: 'rgb(91, 93, 97)' }} size='small'>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(discount._id)} sx={{ color: 'rgb(174, 26, 26)' }} size='small'>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* If no discounts are found after search */}
            {filteredDiscounts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

       {/* Add/Edit Dialog */}
       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Discount' : 'Add New Discount'}
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
              name="discountCode"
              label="Discount Code"
              value={selectedDiscounts?.discountCode || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="discountDescription"
              label="Discount Description"
              value={selectedDiscounts?.discountDescription || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
               rows={1}
            />
            <TextField
              name="discountValue"
              label="Discount Value"
              value={selectedDiscounts?.discountValue || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="validFrom"
              label="Valid From"
              value={selectedDiscounts?.validFrom || ''}
              onChange={handleChange}
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true, 
              }}
            />
            <TextField
              name="validTo"
              label="Valid To"
              value={selectedDiscounts?.validTo || ''}
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
              value={selectedDiscounts?.status || ''}
              onChange={handleChange}
              // select
              fullWidth
              margin="normal"
            />
              {/* <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
              <MenuItem value="Upcoming">Upcoming</MenuItem>
            </TextField> */}
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
          Discount Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedDiscounts && (
            <Box className="view-details">
              <div style={{marginBottom:'5px'}}><strong>Discount Code:</strong> {selectedDiscounts.discountCode}</div>
              <div style={{marginBottom:'5px'}}><strong>Discount Description:</strong> {selectedDiscounts.discountDescription}</div>
              <div style={{marginBottom:'5px'}}><strong>Discount Value:</strong> {selectedDiscounts.discountValue}</div>
              <div style={{marginBottom:'5px'}}><strong>Valid From:</strong> {selectedDiscounts.validFrom}</div>
              <div style={{marginBottom:'5px'}}><strong>Valid To:</strong> {selectedDiscounts.validTo}</div>
              <div style={{marginBottom:'5px'}}><strong>Status:</strong> {selectedDiscounts.status}</div>
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

export default Discount;
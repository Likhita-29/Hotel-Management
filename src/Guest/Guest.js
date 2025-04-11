import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Search from '../Search/Search.js';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import {Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon,} from '@mui/icons-material';

const Guest = () => {
  const [guests, setGuests] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("guestName");
  const [filteredGuests, setFilteredGuests] = useState([]);

  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/guest";

  //Fetch Branches from API
  const fetchGuests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-allguest`);
      console.log("Fetching Guests - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.guest)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setGuests([]);
        return;
      } 

      const guestData = response.data.guest;
      console.log("Processed guest data:", guestData);

      if (guestData.length ===0) {
        console.log("No guests found in the response");
      }

      setGuests(guestData);
      setFilteredGuests(guestData);

    } catch (error) {
      console.error("Error fetching guest details:", error);
      toast.error(error.response?.data?.message || "Error loading guest details:");
      setGuests([]);
      setFilteredGuests([]);
    }
  };

  useEffect(() => {
     console.log("Initiating guests data fetch...");
     fetchGuests();
  }, []);

  //Add search effect
    useEffect(() => {
      if (!searchTerm) {
        setFilteredGuests(guests);
        return;
      }
    
      const filtered = guests.filter((guest) => {
        if (!guest[searchField]) return false; // Avoid undefined values
        return guest[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    
      setFilteredGuests(filtered);
    }, [searchTerm, searchField, guests]);

  const handleClose = () => {
    setViewOpen(false);
    setSelectedGuests(null);
    setOpen(false);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedGuests({
      bookingId:'',
      guestName:'',
      guestEmail: '',
      guestPhone: '',
      guestAddress: '',
      checkIn: '',
      checkOut: '',
      status: 'Checked-in',
    });
    setOpen(true);
    setIsEditing(false);
  };

  const handleEdit = (guest) => {
    setSelectedGuests(guest);
    setIsEditing(true);
    setOpen(true);
  };

  const handleView = (guest) => {
    setSelectedGuests(guest);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-guest/${id}`)
    .then(() => {
       toast.success("Guest deleted successfully");
       fetchGuests();
    })
    .catch(error =>{
      console.error("Error deleting guest:", error);
      toast.error("Failed to delete guest");
    });
};

  const handleSave = () => {
    if (!selectedGuests) return;   //selectedGuest
    
        console.log("Saving Guest:", selectedGuests);
    
        if (isEditing) {
          if (!selectedGuests._id) {  //selectedGuest
            console.error("Guest ID is missing!");
            toast.error("Guest ID is missing!");
            return;
          }

          axios.put(`${API_BASE_URL}/update-guest/${selectedGuests._id}`, selectedGuests)
        .then(response =>{
           console.log("Updated Guest:", response.data);
           toast.success("Guest upadated successfully");
           handleClose();
           fetchGuests();
        })
        .catch(error => {
           console.error("Error updating guest:",error);
           toast.error("Failed to update guest");
        });

      } else {
        axios.post(`${API_BASE_URL}/add-guest`, selectedGuests)
          .then(response => {
             console.log("Added Guest:", response.data);
             toast.success("Guest added successfully");
             handleClose();
             fetchGuests();
          })
          .catch(error =>{
             console.error("Error adding guest:", error);
             toast.error("Failed to add guest");
          });
        }
    };

  const handleChange = (e) => {
    setSelectedGuests({
      ...selectedGuests,
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
        <MenuItem value="guestName">Guest Name</MenuItem>
        <MenuItem value="guestPhone">Guest Phone Number</MenuItem>
        <MenuItem value="guestAddress">Guest Address</MenuItem>
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
              <TableCell align="center" ><b>Booking Id</b></TableCell>
              <TableCell align="center" ><b>Guest Name</b></TableCell>
              <TableCell align="center" ><b>Guest Email</b></TableCell>
              <TableCell align="center" ><b>Guest Phone</b></TableCell>
              <TableCell align="center" ><b>Guest Address</b></TableCell>
              <TableCell align="center" ><b>Check In</b></TableCell>
              <TableCell align="center" ><b>Check Out</b></TableCell>
              <TableCell align="center" ><b>Status</b></TableCell>
              <TableCell align="center" ><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGuests.map((guest, index) => (
              <TableRow key={guest._id}>
                <TableCell align="center" >{index + 1 }</TableCell>
                <TableCell align="center" >{guest.bookingId}</TableCell>
                <TableCell align="center" >{guest.guestName}</TableCell>
                <TableCell align="center" >{guest.guestEmail}</TableCell>
                <TableCell align="center" >{guest.guestPhone}</TableCell>
                <TableCell align="center" >{guest.guestAddress}</TableCell>
                <TableCell align="center" >{guest.checkIn}</TableCell>
                <TableCell align="center" >{guest.checkOut}</TableCell>
                <TableCell align="center" >{guest.status}</TableCell>
                <TableCell>                        {/*sx={{ display:"flex", flexDirection:"column" }}*/}
                    <IconButton onClick={() => handleView(guest)} sx={{ color: 'rgb(91, 93, 97)' }} size='small'>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(guest)} sx={{ color: 'rgb(1, 1, 55)' }} size='small'>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(guest._id)} sx={{ color: 'rgb(174, 26, 26)' }} size='small'>
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
          {isEditing ? 'Edit Guest' : 'Add New Guest'}
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
              name="bookingId"
              label="Booking Id"
              value={selectedGuests?.bookingId || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="guestName"
              label="Guest Name"
              value={selectedGuests?.guestName || ''}
              onChange={handleChange}
              type='text'
              fullWidth
              margin="normal"
            />
            <TextField
              name="guestEmail"
              label="Guest Email"
              value={selectedGuests?.guestEmail || ''}
              onChange={handleChange}
              type='email'
              fullWidth
              margin="normal"
            />
            <TextField
              name="guestPhone"
              label="Guest Phone"
              value={selectedGuests?.guestPhone || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="guestAddress"
              label="Guest Address"
              value={selectedGuests?.guestAddress || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="checkIn"
              label="Check In"
              value={selectedGuests?.checkIn || ''}
              onChange={handleChange}
              type='date'
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true, 
              }}
            />
            <TextField
              name="checkOut"
              label="Check Out"
              value={selectedGuests?.checkOut || ''}
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
              value={selectedGuests?.status || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Checked-in">Checked-in</MenuItem>
              <MenuItem value="Checked-out">Checked-out</MenuItem>
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
          Guest Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedGuests && (
            <Box className="view-details">
              <div style={{marginBottom:'5px'}}><strong>Booking ID:</strong> {selectedGuests.bookingId}</div>
              <div style={{marginBottom:'5px'}}><strong>Guest Name:</strong> {selectedGuests.guestName}</div>
              <div style={{marginBottom:'5px'}}><strong>Guest Email:</strong> {selectedGuests.guestEmail}</div>
              <div style={{marginBottom:'5px'}}><strong>Guest Phone:</strong> {selectedGuests.guestPhone}</div>
              <div style={{marginBottom:'5px'}}><strong>Guest Address:</strong> {selectedGuests.guestAddress}</div>
              <div style={{marginBottom:'5px'}}><strong>Check In:</strong> {selectedGuests.checkIn}</div>
              <div style={{marginBottom:'5px'}}><strong>Check Out:</strong> {selectedGuests.checkOut}</div>
              <div style={{marginBottom:'5px'}}><strong>Status:</strong> {selectedGuests.status}</div>
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

export default Guest;

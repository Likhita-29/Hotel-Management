import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Search from "../Search/Search.js";
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import {Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon,} from '@mui/icons-material';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("customerName");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  
  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/booking";
  const ROOM_BASE_URL ="http://localhost:4000/room";
  const DISCOUNT_BASE_URL ="http://localhost:4000/discount";

  //Fetch  Booking Branches from API
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-allbooking`);
      console.log("Fetching Bookings - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.booking)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setBookings([]);
        return;
      } 

      const bookingData = response.data.booking;
      console.log("Processed booking data:", bookingData);

      if (bookingData.length ===0) {
        console.log("No bookings found in the response");
      }

      setBookings(bookingData);
      setFilteredBookings(bookingData);

    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error(error.response?.data?.message || "Error loading booking details:");
      setBookings([]);
      setFilteredBookings([]);
    }
  };

  useEffect(() => {
    console.log("Initiating bookings data fetch...");
    fetchBookings();
 }, []);
  
  //Fetch API Rooms
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${ROOM_BASE_URL}/get-allroom`);
      console.log("Fetching Rooms - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.room)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setRooms([]);
        return;
      } 

      const roomData = response.data.room;
      console.log("Processed room data:", roomData);

      if (roomData.length ===0) {
        console.log("No rooms found in the response");
      }

      setRooms(roomData);
      setFilteredRooms(roomData);

    } catch (error) {
      console.error("Error fetching room details:", error);
      toast.error(error.response?.data?.message || "Error loading room details:");
      setRooms([]);
      setFilteredRooms([]);
    }
  };

  useEffect(() => {
    console.log("Initiating rooms data fetch...");
    fetchRooms();
 }, []);

 //Fetch API Discount
 const fetchDiscounts = async () => {
  try {
    const response = await axios.get(`${DISCOUNT_BASE_URL}/get-alldiscount`);
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

    setDiscounts(discountData);
    setFilteredDiscounts(discountData);

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
        setFilteredBookings(bookings);
        return;
      }
    
      const filtered = bookings.filter((booking) => {
        if (!booking[searchField]) return false; // Avoid undefined values
        return booking[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    
      setFilteredBookings(filtered);
    }, [searchTerm, searchField, bookings]);

  const handleClose = () => {
    setViewOpen(false);
    setSelectedBookings(null);
    setOpen(false);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedBookings({         
      customerName:'',
      roomNo: '',
      bookingDate: '',
      checkIn: '',
      checkOut: '',
      discountCode:'',
      totalPrice: '',
      paymentStatus: 'Pending'
    });
    setOpen(true);
    setIsEditing(false);
  };

  const handleEdit = (booking) => {
    setSelectedBookings(booking);
    setIsEditing(true);
    setOpen(true);
  };

  const handleView = (booking) => {
    setSelectedBookings(booking);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-booking/${id}`)
    .then(() => {
       toast.success("booking deleted successfully");
       fetchBookings();
    })
    .catch(error =>{
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    });
};

  const handleSave = () => {
    if (!selectedBookings) return;   //selectedBooking
    
        console.log("Saving Booking:", selectedBookings);
    
        if (isEditing) {
          if (!selectedBookings._id) {  //selectedBooking
            console.error("Booking ID is missing!");
            toast.error("Booking ID is missing!");
            return;
          }

          axios.put(`${API_BASE_URL}/update-booking/${selectedBookings._id}`, selectedBookings)
        .then(response =>{
           console.log("Updated Booking:", response.data);
           toast.success("Booking upadated successfully");
           handleClose();
           fetchBookings();
        })
        .catch(error => {
           console.error("Error updating booking:",error);
           toast.error("Failed to update booking");
        });

      } else {
        axios.post(`${API_BASE_URL}/add-booking`, selectedBookings)
          .then(response => {
             console.log("Added Booking:", response.data);
             toast.success("Booking added successfully");
             handleClose();
             fetchBookings();
          })
          .catch(error =>{
             console.error("Error adding booking:", error);
             toast.error("Failed to add booking");
          });
        }
    };

  const handleChange = (e) => {
    setSelectedBookings({
      ...selectedBookings,
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
  <MenuItem value="customerName">Customer Name</MenuItem>
  <MenuItem value="roomNo">Room Number</MenuItem>
  <MenuItem value="bookingDate">Booking Date</MenuItem>
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
              <TableCell align="center" ><b>Customer Name</b></TableCell>
              <TableCell align="center" ><b>Room Number</b></TableCell>
              <TableCell align="center" ><b>Booking Date</b></TableCell>
              <TableCell align="center" ><b>Check In</b></TableCell>
              <TableCell align="center" ><b>Check Out</b></TableCell>
              <TableCell align="center" ><b>Total Price</b></TableCell>
              <TableCell align="center" ><b>Payment Status</b></TableCell>
              <TableCell align="center" ><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking, index) => (
              <TableRow key={booking._id}>
                <TableCell align="center" >{index + 1 }</TableCell>
                <TableCell align="center" >{booking.customerName}</TableCell>
                <TableCell align="center" >{booking.roomNo}</TableCell>
                <TableCell align="center" >{booking.bookingDate}</TableCell>
                <TableCell align="center" >{booking.checkIn}</TableCell>
                <TableCell align="center" >{booking.checkOut}</TableCell>
                <TableCell align="center" >{booking.totalPrice}</TableCell>
                <TableCell align="center" >{booking.paymentStatus}</TableCell>
                <TableCell>                        {/*sx={{ display:"flex", flexDirection:"column" }}*/}
                    <IconButton onClick={() => handleView(booking)} sx={{ color: 'rgb(91, 93, 97)' }} size='small'>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(booking)} sx={{ color: 'rgb(1, 1, 55)' }} size='small'>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(booking._id)} sx={{ color: 'rgb(174, 26, 26)' }} size='small'>
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
          {isEditing ? 'Edit Booking' : 'Add New Booking'}
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
              name="customerName"
              label="Customer Name"
              value={selectedBookings?.customerName || ''}
              onChange={handleChange}
              type="text"
              fullWidth
              margin="normal"
            />
            <TextField
              name="roomNo"
              label="Room Number"
              value={selectedBookings?.roomNo || ''}
              onChange={handleChange}
              select
              type="number"
              fullWidth
              margin="normal"
            >
              {rooms.map((room) => (
                <MenuItem key={room._id} value={room.roomNo}>
                  {room.roomNo}  {/* You can customize the label */}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              name="bookingDate"
              label="Booking Date"
              value={selectedBookings?.bookingDate || ''}
              onChange={handleChange}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              name="checkIn"
              label="Check In"
              value={selectedBookings?.checkIn || ''}
              onChange={handleChange}
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="checkOut"
              label="Check Out"
              value={selectedBookings?.checkOut || ''}
              onChange={handleChange}
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true, 
              }}
            />
            <TextField
              name="discountCode"
              label="Discount Code"
              value={selectedBookings?.discountCode || ''}
              select
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {discounts.map((discount) => (
                <MenuItem key={discount._id} value={discount.discountCode}>
                  {discount.discountCode}  {/* You can customize the label */}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              name="totalPrice"
              label="Total Price"
              value={selectedBookings?.totalPrice || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="paymentStatus"
              label="PaymentStatus"
              value={selectedBookings?.paymentStatus || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Refunded">Refunded</MenuItem>
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
          Booking Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedBookings && (
            <Box className="view-details">
              <div style={{marginBottom:'5px'}}><strong>Customer Name:</strong> {selectedBookings.customerName}</div>
              <div style={{marginBottom:'5px'}}><strong>Room Number:</strong> {selectedBookings.roomNo}</div>
              <div style={{marginBottom:'5px'}}><strong>Booking Date:</strong> {selectedBookings.bookingDate}</div>
              <div style={{marginBottom:'5px'}}><strong>Check In:</strong> {selectedBookings.checkIn}</div>
              <div style={{marginBottom:'5px'}}><strong>Check Out:</strong> {selectedBookings.checkOut}</div>
              <div style={{marginBottom:'5px'}}><strong>Total Price:</strong> {selectedBookings.totalPrice}</div>
              <div style={{marginBottom:'5px'}}><strong>Payment Status:</strong> {selectedBookings.paymentStatus}</div>
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

export default Booking;

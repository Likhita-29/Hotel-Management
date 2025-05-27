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
        return booking[searchField].toString().toLowerCase().startsWith(searchTerm.toLowerCase());
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
      email: '',
      phoneNumber: '',
      address: '',
      bookingDate: '',
      totalPrice: '',
      checkIn: '',
      checkOut: '',
      discountCode:'',
      paymentStatus: 'Pending',
      status: '-',
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

    if (!selectedBookings.checkIn) {
      toast.error("Check-In date is required!");
      return;
    }
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
      const { name, value } = e.target;
    
      // Update selectedBookings with new value
      const updatedBooking = {
        ...selectedBookings,
        [name]: value,
      };
    
      // Parse check-in and check-out
      const checkInDate = new Date(updatedBooking.checkIn);
      const checkOutDate = new Date(updatedBooking.checkOut);
    
      // Strip time to just use calendar dates
      let numberOfNights = 0;
      if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
        const checkInOnlyDate = new Date(checkInDate.toDateString());
        const checkOutOnlyDate = new Date(checkOutDate.toDateString());
        const timeDiff = checkOutOnlyDate - checkInOnlyDate;
        numberOfNights = timeDiff / (1000 * 60 * 60 * 24);
      }
    
      updatedBooking.numberOfNights = numberOfNights;
    
      // Find selected room and discount
      const selectedRoom = rooms.find(room => room.roomNo === updatedBooking.roomNo);
      const selectedDiscount = discounts.find(discount => discount.discountCode === updatedBooking.discountCode);
    
      const basePrice = selectedRoom ? selectedRoom.pricePerNight : 0;
      const discountPercent = selectedDiscount ? selectedDiscount.discountValue : 0;
    
      const pricePerNight = discountPercent > 0 ? basePrice - (basePrice * discountPercent / 100) : basePrice;
    
      // Calculate total price only if nights are valid
      const totalPrice = numberOfNights > 0 ? pricePerNight * numberOfNights : pricePerNight;
    
      updatedBooking.totalPrice = totalPrice;

      // Auto-update status
      if (updatedBooking.checkIn && !updatedBooking.checkOut) {
        updatedBooking.status = 'CheckIn';
      } else if (updatedBooking.checkIn && updatedBooking.checkOut) {
        updatedBooking.status = 'CheckOut';
      } else {
        updatedBooking.status = '-';
      }
    
      setSelectedBookings(updatedBooking);
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
  <MenuItem value="customerName">Customer Name</MenuItem>
  <MenuItem value="roomNo">Room Number</MenuItem>
  <MenuItem value="bookingDate">Booking Date</MenuItem>
</TextField>

  {/* Search */}
  <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
  </div>

  {/* Add Button */}
  <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} 
  sx={{ backgroundColor: 'rgb(1, 1, 55)','&:hover': {backgroundColor: 'rgb(1, 1, 90)'}, fontSize:"13px" }}>
    Add New Booking
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
              <TableCell align="center" ><b>Total Price</b></TableCell>
              <TableCell align="center" ><b>Check In</b></TableCell>
              <TableCell align="center" ><b>Check Out</b></TableCell>
              <TableCell align="center" ><b>Payment Status</b></TableCell>
              <TableCell align="center" ><b>Status</b></TableCell>
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
                <TableCell align="center" >₹{booking.totalPrice}</TableCell>
                <TableCell align="center" >{booking.checkIn}</TableCell>
                <TableCell align="center" >{booking.checkOut}</TableCell>
                <TableCell align="center" >{booking.paymentStatus}</TableCell>
                <TableCell align="center" >{booking.status}</TableCell>
                <TableCell>                        {/*sx={{ display:"flex", flexDirection:"column" }}*/}
                    <IconButton onClick={() => handleView(booking)} sx={{ color: 'rgb(1, 1, 55)' }} size='small'>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(booking)} sx={{ color: 'rgb(91, 93, 97)' }} size='small'>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(booking._id)} sx={{ color: 'rgb(174, 26, 26)' }} size='small'>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredBookings.length === 0 && (
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
              disabled={isEditing}
              value={selectedBookings?.roomNo || ''}
              onChange={handleChange}
              select
              type="number"
              fullWidth
              margin="normal"
            >
              {rooms
              .filter((room) => room.status === "Available")
              .map((room) => (
                <MenuItem key={room._id} value={room.roomNo}>
                  {room.roomNo} 
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              name="email"
              label="Email"
              value={selectedBookings?.email || ''}
              onChange={handleChange}
              type="email"
              fullWidth
              margin="normal"
            />
            <TextField
              name="phoneNumber"
              label="Phone No"
              value={selectedBookings?.phoneNumber || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="address"
              label="Address"
              value={selectedBookings?.address || ''}
              onChange={handleChange}
              type="text"
              fullWidth
              margin="normal"
            />
            <TextField
              name="bookingDate"
              label="Booking Date"
              disabled={isEditing}
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
              name="totalPrice"
              label="Total Price"
              value={selectedBookings?.totalPrice || ''}
              type="number"
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
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
              {discounts
              .filter((discount) => discount.status === "Active")
              .map((discount) => (
                <MenuItem key={discount._id} value={discount.discountCode}>
                  {discount.discountCode}  
                  </MenuItem>
                ))}
            </TextField>
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
            <TextField
              name="status"
              label="Status"
              value={selectedBookings?.status || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
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
              <div style={{marginBottom:'5px'}}><strong>Total Price:</strong> {selectedBookings.totalPrice}</div>
              <div style={{marginBottom:'5px'}}><strong>Check In:</strong> {selectedBookings.checkIn}</div>
              <div style={{marginBottom:'5px'}}><strong>Check Out:</strong> {selectedBookings.checkOut}</div>
              <div style={{marginBottom:'5px'}}><strong>Payment Status:</strong> {selectedBookings.paymentStatus}</div>
              <div style={{marginBottom:'5px'}}><strong>Status:</strong> {selectedBookings.status}</div>
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

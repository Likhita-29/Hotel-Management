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
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/booking";
  const ROOM_BASE_URL ="http://localhost:4000/room";

  //Fetch Branches from API
  const fetchGuests = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-allbooking`);
      console.log("Fetching Guests - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.booking)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setGuests([]);
        return;
      } 

      const guestData = response.data.booking;
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

  //Add search effect
    useEffect(() => {
      if (!searchTerm) {
        setFilteredGuests(guests);
        return;
      }
    
      const filtered = guests.filter((guest) => {
        if (!guest[searchField]) return false; // Avoid undefined values
        return guest[searchField].toString().toLowerCase().startsWith(searchTerm.toLowerCase());
      });
    
      setFilteredGuests(filtered);
    }, [searchTerm, searchField, guests]);

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
        <MenuItem value="guestName">Name</MenuItem>
        <MenuItem value="guestPhone">Phone Number</MenuItem>
        <MenuItem value="guestAddress">Address</MenuItem>
      </TextField>

        {/* Search */}
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </div>

      </Box>

    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>      
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" ><b>Sl No</b></TableCell>
              <TableCell align="center" ><b>Room No</b></TableCell>
              <TableCell align="center" ><b>Name</b></TableCell>
              <TableCell align="center" ><b>Email</b></TableCell>
              <TableCell align="center" ><b>Phone No</b></TableCell>
              <TableCell align="center" ><b>Address</b></TableCell>
              <TableCell align="center" ><b>Status</b></TableCell>
              <TableCell align="center" ><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGuests.map((guest, index) => (
              <TableRow key={guest._id}>
                <TableCell align="center" >{index + 1 }</TableCell>
                <TableCell align="center" >{guest.roomNo}</TableCell>
                <TableCell align="center" >{guest.customerName}</TableCell>
                <TableCell align="center" >{guest.email}</TableCell>
                <TableCell align="center" >{guest.phoneNumber}</TableCell>
                <TableCell align="center" >{guest.address}</TableCell>
                <TableCell align="center" >{guest.status}</TableCell>
                <TableCell >                        {/*sx={{ display:"flex", flexDirection:"column" }}*/}
                  <IconButton onClick={() => handleDelete(guest._id)} sx={{ color: 'rgb(174, 26, 26)' }} size='small'>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* If no guests are found after search */}
            {filteredGuests.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </Box>
  );
};

export default Guest;

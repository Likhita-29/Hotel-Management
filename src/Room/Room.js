import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Search from "../Search/Search.js";
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import {Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon,} from '@mui/icons-material';

const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("roomNo");
  const [filteredRooms, setFilteredRooms] = useState([]);

  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/room";

  //Fetch Branches from API
  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-allroom`);
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
      setFilteredRooms(rooms);
      return;
    }
  
    const filtered = rooms.filter((room) => {
      if (!room[searchField]) return false; // Avoid undefined values
      return room[searchField].toString().toLowerCase().startsWith(searchTerm.toLowerCase());
    });
  
    setFilteredRooms(filtered);
  }, [searchTerm, searchField, rooms]);
  

  const handleClose = () => {
    setViewOpen(false);
    setSelectedRooms(null);
    setOpen(false);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedRooms({
      roomNo:'',
      roomType:'',
      bedType: '',
      pricePerNight: '',
      description: '',
      capacity: '',
      status: 'Available',
    });
    setOpen(true);
    setIsEditing(false);
  };

  const handleEdit = (room) => {
    setSelectedRooms(room);
    setIsEditing(true);
    setOpen(true);
  };

  const handleView = (room) => {
    setSelectedRooms(room);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-room/${id}`)
    .then(() => {
       toast.success("Room deleted successfully");
       fetchRooms();
    })
    .catch(error =>{
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room");
    });
};

  const handleSave = () => {
    if (!selectedRooms) return;   //selectedRoom
    
        console.log("Saving Room:", selectedRooms);
    
        if (isEditing) {
          if (!selectedRooms._id) {  //selectedRoom
            console.error("Room ID is missing!");
            toast.error("Room ID is missing!");
            return;
          }

          axios.put(`${API_BASE_URL}/update-room/${selectedRooms._id}`, selectedRooms)
        .then(response =>{
           console.log("Updated Room:", response.data);
           toast.success("Room upadated successfully");
           handleClose();
           fetchRooms();
        })
        .catch(error => {
           console.error("Error updating room:",error);
           toast.error("Failed to update room");
        });

      } else {
        axios.post(`${API_BASE_URL}/add-room`, selectedRooms)
          .then(response => {
             console.log("Added Room:", response.data);
             toast.success("Room added successfully");
             handleClose();
             fetchRooms();
          })
          .catch(error =>{
             console.error("Error adding room:", error);
             toast.error("Failed to add room");
          });
        }
    };

  const handleChange = (e) => {
    setSelectedRooms({
      ...selectedRooms,
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
        <MenuItem value="roomNo">Room No</MenuItem>
        <MenuItem value="roomType">Room Type</MenuItem>
        <MenuItem value="bedType">Bed Type</MenuItem>
      </TextField>

        {/* Search */}
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </div>

        {/* Add Button */}
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}
        sx={{ backgroundColor: 'rgb(1, 1, 55)','&:hover': {backgroundColor: 'rgb(1, 1, 90)'}, fontSize:"13px" }}>
        Add New Room
        </Button>
      </Box>

    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>      
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" ><b>Sl No</b></TableCell>
              <TableCell align="center" ><b>Room No</b></TableCell>
              <TableCell align="center" ><b>Room Type</b></TableCell>
              <TableCell align="center" ><b>Bed Type</b></TableCell>
              <TableCell align="center" ><b>Price/Day</b></TableCell>
              <TableCell align="center" ><b>Description</b></TableCell>
              <TableCell align="center" ><b>Capacity</b></TableCell>
              <TableCell align="center" ><b>Status</b></TableCell>
              <TableCell align="center" ><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms.map((room, index) => (
              <TableRow key={room._id}>
                <TableCell align="center" >{index + 1 }</TableCell>
                <TableCell align="center" >{room.roomNo}</TableCell>
                <TableCell align="center" >{room.roomType}</TableCell>
                <TableCell align="center" >{room.bedType}</TableCell>
                <TableCell align="center" >₹{room.pricePerNight}</TableCell>
                <TableCell align="center" >{room.description}</TableCell>
                <TableCell align="center" >{room.capacity}</TableCell>
                <TableCell align="center" >{room.status}</TableCell>
                <TableCell>                        {/*sx={{ display:"flex", flexDirection:"column" }}*/}
                    <IconButton onClick={() => handleView(room)} sx={{ color: 'rgb(1, 1, 55)' }} size='small'>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(room)} sx={{ color: 'rgb(91, 93, 97)' }} size='small'>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(room._id)} sx={{ color: 'rgb(174, 26, 26)' }} size='small'>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* If no rooms are found after search */}
            {filteredRooms.length === 0 && (
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
          {isEditing ? 'Edit Room' : 'Add New Room'}
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
              name="roomNo"
              label="Room No"
              value={selectedRooms?.roomNo || ''}
              type="number"
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="roomType"
              label="Room Type"
              value={selectedRooms?.roomType || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Double">Double</MenuItem>
              <MenuItem value="Suite">Suite</MenuItem>
            </TextField>
            <TextField
              name="bedType"
              label="Bed Type"
              value={selectedRooms?.bedType || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Double">Double</MenuItem>
              <MenuItem value="King">King</MenuItem>
            </TextField>
            <TextField
              name="pricePerNight"
              label="Price/Night"
              value={selectedRooms?.pricePerNight || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="description"
              label="Description"
              value={selectedRooms?.description || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              name="capacity"
              label="Capacity"
              value={selectedRooms?.capacity || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="status"
              label="Status"
              value={selectedRooms?.status || 'Available'}
              onChange={handleChange}
              fullWidth
              margin="normal"
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
          Room Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedRooms && (
            <Box className="view-details">
              <div style={{marginBottom:'5px'}}><strong>Room No:</strong> {selectedRooms.roomNo}</div>
              <div style={{marginBottom:'5px'}}><strong>Room Type:</strong> {selectedRooms.roomType}</div>
              <div style={{marginBottom:'5px'}}><strong>Bed Type:</strong> {selectedRooms.bedType}</div>
              <div style={{marginBottom:'5px'}}><strong>Price/Night:</strong> {selectedRooms.pricePerNight}</div>
              <div style={{marginBottom:'5px'}}><strong>Description:</strong> {selectedRooms.description}</div>
              <div style={{marginBottom:'5px'}}><strong>Capacity:</strong> {selectedRooms.capacity}</div>
              <div style={{marginBottom:'5px'}}><strong>Status:</strong> {selectedRooms.status}</div>
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

export default Room;

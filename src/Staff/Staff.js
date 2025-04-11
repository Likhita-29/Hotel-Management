import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Search from "../Search/Search.js";
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import {Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon,} from '@mui/icons-material';

const Staff = () => {
  const [staffs, setStaffs] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedStaffs, setSelectedStaffs] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [filteredStaffs, setFilteredStaffs] = useState([]);

  //Adding Base URL
  const API_BASE_URL = "http://localhost:4000/staff";

  //Fetch Branches from API
  const fetchStaffs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-allstaff`);
      console.log("Fetching Staffs - Full Response:", response);

      if (!response.data || !Array.isArray(response.data.staff)) {
        console.error("Unexpected response format:", response.data);
        toast.error("Error: No data received from server");
        setStaffs([]);
        return;
      } 

      const staffData = response.data.staff;
      console.log("Processed staff data:", staffData);

      if (staffData.length ===0) {
        console.log("No staffs found in the response");
      }

      setStaffs(staffData);
      setFilteredStaffs(staffData);

    } catch (error) {
      console.error("Error fetching staff details:", error);
      toast.error(error.response?.data?.message || "Error loading staff details:");
      setStaffs([]);
      setFilteredStaffs([]);
    }
  };

  useEffect(() => {
     console.log("Initiating staffs data fetch...");
     fetchStaffs();
  }, []);

  //Add search effect
    useEffect(() => {
      if (!searchTerm) {
        setFilteredStaffs(staffs);
        return;
      }
    
      const filtered = staffs.filter((staff) => {
        if (!staff[searchField]) return false; // Avoid undefined values
        return staff[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    
      setFilteredStaffs(filtered);
    }, [searchTerm, searchField, staffs]);

  const handleClose = () => {
    setViewOpen(false);
    setSelectedStaffs(null);
    setOpen(false);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setSelectedStaffs({
      name:'',
      email:'',
      mobileNo: '',
      address: '',
      role: '',
      salary: '',
      joiningDate: '',
      status: 'Active',
    });
    setOpen(true);
    setIsEditing(false);
  };

  const handleEdit = (staff) => {
    setSelectedStaffs(staff);
    setIsEditing(true);
    setOpen(true);
  };

  const handleView = (staff) => {
    setSelectedStaffs(staff);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete-staff/${id}`)
    .then(() => {
       toast.success("Staff deleted successfully");
       fetchStaffs();
    })
    .catch(error =>{
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff");
    });
};

  const handleSave = () => {
    if (!selectedStaffs) return;   //selectedStaff
    
        console.log("Saving Staff:", selectedStaffs);
    
        if (isEditing) {
          if (!selectedStaffs._id) {  //selectedStaff
            console.error("Staff ID is missing!");
            toast.error("Staff ID is missing!");
            return;
          }

          axios.put(`${API_BASE_URL}/update-staff/${selectedStaffs._id}`, selectedStaffs)
        .then(response =>{
           console.log("Updated Staff:", response.data);
           toast.success("Staff upadated successfully");
           handleClose();
           fetchStaffs();
        })
        .catch(error => {
           console.error("Error updating staff:",error);
           toast.error("Failed to update staff");
        });

      } else {
        axios.post(`${API_BASE_URL}/add-staff`, selectedStaffs)
          .then(response => {
             console.log("Added Staff:", response.data);
             toast.success("Staff added successfully");
             handleClose();
             fetchStaffs();
          })
          .catch(error =>{
             console.error("Error adding staff:", error);
             toast.error("Failed to add staff");
          });
        }
    };

  const handleChange = (e) => {
    setSelectedStaffs({
      ...selectedStaffs,
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
          <MenuItem value="mobileNo">Mobile Number</MenuItem>
          <MenuItem value="address">Address</MenuItem>
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
              <TableCell align="center" ><b>Email</b></TableCell>
              <TableCell align="center" ><b>Mobile No</b></TableCell>
              <TableCell align="center" ><b>Address</b></TableCell>
              <TableCell align="center" ><b>Role</b></TableCell>
              <TableCell align="center" ><b>Salary</b></TableCell>
              <TableCell align="center" ><b>Joining Date</b></TableCell>
              <TableCell align="center" ><b>Status</b></TableCell>
              <TableCell align="center" ><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaffs.map((staff, index) => (
              <TableRow key={staff._id}>
                <TableCell align="center" >{index + 1 }</TableCell>
                <TableCell align="center" >{staff.name}</TableCell>
                <TableCell align="center" >{staff.email}</TableCell>
                <TableCell align="center" >{staff.mobileNo}</TableCell>
                <TableCell align="center" >{staff.address}</TableCell>
                <TableCell align="center" >{staff.role}</TableCell>
                <TableCell align="center" >{staff.salary}</TableCell>
                <TableCell align="center" >{staff.joiningDate}</TableCell>
                <TableCell align="center" >{staff.status}</TableCell>
                <TableCell>                        {/*sx={{ display:"flex", flexDirection:"column" }}*/}
                    <IconButton onClick={() => handleView(staff)} sx={{ color: 'rgb(91, 93, 97)' }} size='small'>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(staff)} sx={{ color: 'rgb(1, 1, 55)' }} size='small'>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(staff._id)} sx={{ color: 'rgb(174, 26, 26)' }} size='small'>
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
          {isEditing ? 'Edit Staff' : 'Add New Staff'}
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
              value={selectedStaffs?.name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              value={selectedStaffs?.email || ''}
              onChange={handleChange}
              type="email"
              fullWidth
              margin="normal"
            />
            <TextField
              name="mobileNo"
              label="Mobile No"
              value={selectedStaffs?.mobileNo || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="address"
              label="Address"
              value={selectedStaffs?.address || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="role"
              label="Role"
              value={selectedStaffs?.role || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Receptionist">Receptionist</MenuItem>
            <MenuItem value="Housekeeping">Housekeeping</MenuItem>
            <MenuItem value="Chef">Chef</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Maintenance">Maintenance</MenuItem>
            </TextField>
            <TextField
              name="salary"
              label="Salary"
              value={selectedStaffs?.salary || ''}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="joiningDate"
              label="Joining Date"
              value={selectedStaffs?.joiningDate || ''}
              onChange={handleChange}
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true, 
              }}
            />
            <TextField
              name="status"
              label="Status"
              value={selectedStaffs?.status || ''}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="On Leave">On Leave</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
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
          Staff Details
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedStaffs && (
            <Box className="view-details">
              <div style={{marginBottom:'5px'}}><strong>Name:</strong> {selectedStaffs.name}</div>
              <div style={{marginBottom:'5px'}}><strong>Email:</strong> {selectedStaffs.email}</div>
              <div style={{marginBottom:'5px'}}><strong>Mobile No:</strong> {selectedStaffs.mobileNo}</div>
              <div style={{marginBottom:'5px'}}><strong>Address:</strong> {selectedStaffs.address}</div>
              <div style={{marginBottom:'5px'}}><strong>Role:</strong> {selectedStaffs.role}</div>
              <div style={{marginBottom:'5px'}}><strong>Salary:</strong> {selectedStaffs.salary}</div>
              <div style={{marginBottom:'5px'}}><strong>Joining Date:</strong> {selectedStaffs.joiningDate}</div>
              <div style={{marginBottom:'5px'}}><strong>Status:</strong> {selectedStaffs.status}</div>
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

export default Staff;

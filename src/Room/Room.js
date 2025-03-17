import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton, Stack, Box } from "@mui/material";
import Search from "../Search/Search";
import { Visibility, Edit, Delete } from "@mui/icons-material";

function createData(sl_No, room_no, room_type, bed_type, price_per_night, description, capacity, status) {
  return { sl_No, room_no, room_type, bed_type, price_per_night, description, capacity, status };
}

const rows = [
  createData(1, 101, "Single", "Single", 1200, "Cozy single room", 5, "Available"),
  createData(2, 102, "Double", "Double", 1300, "Spacious double room", 10, "Occupied"),
  createData(3, 103, "Suite", "Single", 1500, "Luxury suite", 8, "Available"),
  createData(4, 104, "Single", "Double", 1600, "Comfortable single", 10, "Under Maintenance"),
  createData(5, 105, "Suite", "King", 1700, "King-size suite", 12, "Occupied"),
  createData(6, 106, "Single", "Queen", 1700, "Queen-size room", 12, "Available"),
  createData(7, 107, "Deluxe", "Single", 1650, "Elegant deluxe room", 12, "Available"),
  createData(8, 108, "Deluxe", "Double", 1690, "Spacious deluxe room", 12, "Under Maintenance"),
  createData(9, 109, "Suite", "Queen", 1700, "Premium queen suite", 12, "Under Maintenance"),
  createData(10, 110, "Suite", "King", 1700, "Luxurious suite", 12, "Available"),
  createData(11, 111, "Suite", "Queen", 1700, "Elegant queen suite", 12, "Occupied"),
];

const Room = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [SearchQuery, setSearchQuery] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return (
    <Box className="container">
      
      {/* Search Component */}
      <Search  />

    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>Sl No</b></TableCell>
              <TableCell><b>Room No</b></TableCell>
              <TableCell><b>Room Type</b></TableCell>
              <TableCell><b>Bed Type</b></TableCell>
              <TableCell><b>Price/Night</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Capacity</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.sl_No}>
                <TableCell>{row.sl_No}</TableCell>
                <TableCell>{row.room_no}</TableCell>
                <TableCell>{row.room_type}</TableCell>
                <TableCell>{row.bed_type}</TableCell>
                <TableCell>{row.price_per_night}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.capacity}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" size="small"><Visibility />
                    </IconButton>
                    <IconButton color="secondary" size="small"><Edit />
                    </IconButton>
                    <IconButton color="error" size="small"><Delete />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  </Box>
  );
};

export default Room;

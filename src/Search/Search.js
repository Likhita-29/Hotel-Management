import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div>
      {/* Search Input Field */}
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        className="search"
      />
      </div>
  );
};

export default Search;

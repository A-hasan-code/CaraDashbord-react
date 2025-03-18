import React, { useState } from 'react';
import {
  Checkbox,
  Button,
  Box,
  TextField,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const customFields = [
  { key: 'field1', value: 'Field 1 Value' },
  { key: 'field2', value: 'Field 2 Value' },
  { key: 'field3', value: 'Field 3 Value' },
  { key: 'field4', value: 'Field 4 Value' },
  { key: 'field5', value: 'Field 5 Value' },
  { key: 'field6', value: 'Field 6 Value' },
  { key: 'field7', value: 'Field 7 Value' },
  { key: 'field8', value: 'Field 8 Value' },
  // Add more fields as needed
];

const CustomFieldsSelection = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSelection = (key) => {
    if (selectedFields.includes(key)) {
      setSelectedFields(selectedFields.filter(item => item !== key));
    } else if (selectedFields.length < 6) {
      setSelectedFields([...selectedFields, key]);
    }
  };

  const handleSave = () => {
    console.log('Saved Fields:', selectedFields);
    // Save selected fields to backend or localStorage
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page on search
  };

  const filteredFields = customFields.filter(({ key, value }) =>
    key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to first page on change of rows per page
  };

  // AG-Grid Setup
  const rowData = selectedFields.map(fieldKey => {
    const field = customFields.find(item => item.key === fieldKey);
    return { key: field.key, value: field.value };
  });

  const columnDefs = [
    { headerName: 'Field Key', field: 'key', sortable: true, filter: true, flex: 1 },
    { headerName: 'Field Value', field: 'value', sortable: true, filter: true, flex: 2 }
  ];

  const paginatedFields = filteredFields.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-6">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6"
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div className='flex items-center justify-between'>
            <Typography variant="h6" color="white" sx={{ flexGrow: 1 }}>
              Select Custom Fields
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TextField
                label="Search Fields"
                variant="outlined"
                size="small" // Make the search bar smaller
                value={searchQuery}
                onChange={handleSearch}
                InputLabelProps={{
                  style: { color: 'white' } // Make the label white
                }}
                InputProps={{ style: { color: 'white' } }}
                sx={{ backgroundColor: 'transparent', borderRadius: 1, border: '2px solid white' }} // Optional: to give the search bar a background color
              />
            </Box>


          </div>
        </CardHeader>


        <CardBody>
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Field</strong>
                    </TableCell>
                    <TableCell align="left">
                      <strong>Value</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Select</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedFields.map(({ key, value }) => (
                    <TableRow key={key} hover>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={selectedFields.includes(key)}
                          onChange={() => handleSelection(key)}
                          color="primary"
                          disabled={selectedFields.length === 6 && !selectedFields.includes(key)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredFields.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={selectedFields.length === 0}
            className="mt-6"
          >
            Save Selections
          </Button>
        </CardBody>
      </Card>

      <div className="mt-12">
        <Card style={{ height: '400px', width: '100%' }}>
          <CardHeader variant="gradient"
            color="gray"
            className="mb-8 p-6"
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>  <Typography variant="h6" color="white" sx={{ flexGrow: 1 }}>Selected Fields </Typography></CardHeader>
          <CardBody className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              pagination={true} // Optional: Enable pagination
              domLayout='autoHeight' // Optional: Adjust height based on the number of rows
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CustomFieldsSelection;

import React from 'react';
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import "ag-grid-community/styles/ag-grid.css";
import 'ag-grid-community/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';

export const UsersTable = () => {
  const navigate = useNavigate();
  // Static user data
  const users = [
    { id: 1, first_name: "John", last_name: "Doe", email: "john.doe@example.com", role: "Admin", status: "Active" },
    { id: 2, first_name: "Jane", last_name: "Smith", email: "jane.smith@example.com", role: "User", status: "non-Active" },
    { id: 3, first_name: "Emily", last_name: "Johnson", email: "emily.johnson@example.com", role: "Manager", status: "Active" },
    { id: 4, first_name: "Michael", last_name: "Brown", email: "michael.brown@example.com", role: "User", status: "non-Active" },
  ];

  const rowData = users.map(user => ({
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    role: user.role,
    status: user.status,
  }));

  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, filter: true, width: 60},
    { headerName: "Name", field: "name", sortable: true, filter: true, width: 580 },
    { headerName: "Email", field: "email", sortable: true, filter: true, width: 500 },
    { headerName: "Role", field: "role", sortable: true, filter: true, width: 250 },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: 'agSetColumnFilter',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Active', 'non-Active'],
      },
      cellRenderer: (params) => (
        <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-tight ${params.value === "Active" ? "text-green-800 bg-green-200 rounded-full" : "text-red-800 bg-red-200 rounded-full"}`}>
          {params.value}
        </span>
      )
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 280,
      cellRenderer: (params) => (
        <div className="flex   space-x-2">
          <span
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          >
            <FaEdit size={20} onClick={handleClick}/>
          </span>
          <span
            className="cursor-pointer text-red-600 hover:text-red-800"
          >
            <MdDeleteSweep size={20} />
          </span>
        </div>
      ),
    },
  ];

  function handleClick() {

    navigate('/auth/create-user');
  }

  return (
    <div className="mt-12 mb-8 flex flex-col items-center">
      <Card className="w-full">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">Users Table</Typography>
          <Button variant="h6" color="white" onClick={handleClick}>Create User</Button>
        </CardHeader>
        <CardBody className="overflow-x-auto p-0">
          <div className="ag-theme-material" style={{ height: 'fit-content', maxWidth: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              domLayout='autoHeight'
              animateRows={true}
              headerClass="bg-gray-800 text-white"
              enableSorting={true}
              enableFilter={true}
              defaultColDef={{
                filter: true,
                sortable: true,
                resizable: true,
              }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

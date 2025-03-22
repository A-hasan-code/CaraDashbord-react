import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import "ag-grid-community/styles/ag-grid.css";
import 'ag-grid-community/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import ModalComponent from '@/constant/Modal/ModalComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserSuperadmin, deleteUserSuperadmin ,register} from '@/Redux/slices/User.Slice'; 
import CircularProgress from '@mui/material/CircularProgress'; 

export const UsersTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users, loading, user, error } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); 
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
    location_id: '',
    password:''
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, users]);

  const rowData = users?.map(user => ({
    id: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    status: user?.status,
    location_id: user?.location_id
  }));

  const handleCreateUser = () => {
    setIsEditMode(false);
    setOpen(true);
  };

  const handleEditUser = (user) => {
    setUserId(user?.id);
    setUserData({
     name: user?.name,
      email: user?.email,
      role: user?.role,
      status: user?.status,
      location_id: user?.location_id
    });
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserId(user?.id);
    setDeleteConfirmOpen(true); 
  };

const confirmDelete = () => {
  if (userId) {
    
    dispatch(deleteUserSuperadmin(userId))
      .then(() => {
        toast.success('User deleted successfully!');
        setDeleteConfirmOpen(false);
        dispatch(fetchAllUsers()); 
      })
      .catch((error) => {
        toast.error(error?.message || 'Error while deleting user');
        setDeleteConfirmOpen(false);
        dispatch(fetchAllUsers()); 
      });
  }
};


  const handleClose = () => {
    setOpen(false);
    setUserData({
     name: '',
      email: '',
      role: '',
      status: '',
      password:''
    });
    setIsEditMode(false);
  };



const handleSubmit = async () => {
  try {
    if (isEditMode) {
      // Update user
      const resultAction = await dispatch(updateUserSuperadmin({ userId, updatedData: userData }));
      if (updateUserSuperadmin.fulfilled.match(resultAction)) {
        toast.success('User updated successfully!');
        dispatch(fetchAllUsers());  
      } else {
        toast.error('Update failed!');
      }
    } else {
      //Create new user
      const resultAction = await dispatch(register(userData));
      if (register.fulfilled.match(resultAction)) {
        toast.success('User registered successfully!');
        dispatch(fetchAllUsers());  
      } else {
        toast.error('Registration failed!');
      }
    }
  } catch (error) {
    toast.error('Error during submission!');
    console.error('Error during submit:', error);
  } finally {
    handleClose();
  }
};



  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, filter: true, width: 300 },
    { headerName: "Name", field: "name", sortable: true, filter: true, width: 300 },
    { headerName: "Email", field: "email", sortable: true, filter: true, width: 300 },
    { headerName: "Role", field: "role", sortable: true, filter: true, width: 200 },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: 'agSetColumnFilter',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['active', 'inactive'],
      },
      cellRenderer: (params) => (
        <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-tight ${params.value === "active" ? "text-green-800 bg-green-200 rounded-full" : "text-red-800 bg-red-200 rounded-full"}`}>
          {params.value}
        </span>
      )
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 200,
      cellRenderer: (params) => (
        <div className="flex items-center space-x-2 h-full">
          {user?.role === 'superadmin' && (
            <>
              <span
                className="cursor-pointer text-blue-600 hover:text-blue-800"
                onClick={() => handleEditUser(params.data)}
              >
                <FaEdit size={20} />
              </span>
              <span
                className="cursor-pointer text-red-600 hover:text-red-800"
                onClick={() => handleDeleteUser(params.data)}
              >
                <MdDeleteSweep size={20} />
              </span>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mt-12 mb-8 flex flex-col items-center">
      <Card className="w-full">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">Users</Typography>
          {user?.role === 'superadmin' && (
            <Button variant="h6" color="white" onClick={handleCreateUser}>Create User</Button>
          )}
        </CardHeader>
        <CardBody className="overflow-x-auto p-0">
          <div className="ag-theme-material" style={{ height: 'fit-content', maxWidth: "100%" }}>
            {loading ? (
              <div className="flex justify-center items-center h-60">
                <CircularProgress className="text-blue-600" />
              </div>
            ) : (
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={40}
                domLayout='autoHeight'
                animateRows={true}
                enableSorting={true}
                enableFilter={true}
                defaultColDef={{
                  filter: true,
                  sortable: true,
                  resizable: true,
                }}
              />
            )}
          </div>
        </CardBody>
      </Card>

      {/* Modal for Creating/Editing User */}
      <ModalComponent
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        userData={userData}
        setUserData={setUserData}
        handleChange={handleChange}
        isEditMode={isEditMode}
      />

      {/* Confirmation Modal for Deleting User */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg">Are you sure you want to delete this user?</p>
            <div className="mt-4 flex space-x-4">
              <Button color="red" onClick={() => setDeleteConfirmOpen(false)}>No</Button>
              <Button color="green" onClick={confirmDelete}>Yes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

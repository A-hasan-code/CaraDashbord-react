import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "@/Redux/slices/Contact.slice";  // Import the fetchContacts action
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import 'ag-grid-community/styles/ag-theme-material.css';

export function Tables() {
  const dispatch = useDispatch();
  
  // Getting the contacts state from Redux store
  const { contacts, loading, error } = useSelector((state) => state.contacts);

  // Fetch contacts on component mount
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  // Row data for the table
  const rowData = contacts.map((contact) => ({
    id: contact.contact_id,
    name: (contact.name === null ||contact.name === 'null null' || contact.name=== undefined )?"NO Name":contact.name,
    email: contact.email,
    location_id: contact.location_id,
    country: contact.country,
    phone: contact.phone,
  }));

  // Column definitions for the Ag-Grid table
  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, filter: false  ,width:300},
    { headerName: "Name", field: "name", sortable: true, filter: false,width:300 },
    { headerName: "Email", field: "email", sortable: true, filter: false,width:300 },
    { headerName: "location_id", field: "location_id", sortable: true, filter: false,width:300 },
    { headerName: "country", field: "country", sortable: true, filter: false,width:300 },
    { headerName: "phone", field: "phone", sortable: true, filter: false ,width:300},
  ];

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Contacts Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {/* Show loading spinner while loading */}
          {loading ? (
            <div className="flex justify-center items-center h-56">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
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
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;

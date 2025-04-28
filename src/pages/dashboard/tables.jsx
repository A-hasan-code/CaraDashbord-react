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
console.log("contacts", contacts)
  // Fetch contacts on component mount
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  // Row data for the table
const rowData = contacts.map((contact) => ({
  id: contact.contact_id,
  name:
    !contact.name || contact.name === 'null null'
      ? 'NO Name'
      : contact.name,
  email: contact.email,
  project_date: contact.Project_date
    ? new Date(contact.Project_date).toLocaleDateString("en-AU")
    : "No Date",
  tags: contact.tags || [],
  phone: contact.phone,
}));


  // Column definitions for the Ag-Grid table
const columnDefs = [
  { headerName: "ID", field: "id", sortable: true, width: 300 },
  { headerName: "Name", field: "name", sortable: true, width: 300 },
  { headerName: "Email", field: "email", sortable: true, width: 300 },
  {
    headerName: "Project Date",
    field: "project_date",
    sortable: true,
    width: 350,
  },
  { headerName: "Phone", field: "phone", sortable: true, width: 300 },
  {
  headerName: "Tags",
  field: "tags",
  width: 300,
  Height:200,
  cellStyle: { lineHeight: "1.4", padding: "6px 8px" , overflow:'auto'},
  cellRenderer: ({ value }) => (
    <div className="flex flex-wrap gap-2 ">
      {value
        ?.flatMap(tagGroup => tagGroup.split(","))
        .map((tag, index) => (
          <span
            key={index}
            className="text-xs px-3 py-1 rounded-full border font-medium"
            style={{
              backgroundColor: index % 2 === 0 ? "#accdfa" : "#e9eafb",
              color: "#5742e3",
              borderColor: "#d9d9d9",
            }}
          >
            {tag.trim()}
          </span>
        ))}
    </div>
  ),
}
,
];


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader   className="mb-8 p-6 bg-[#accdfa] ">
          <Typography variant="h6" className="text-[#5742e3] font-bold">
            Contacts Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {/* Show loading spinner while loading */}
          {loading ? (
            <div className="flex justify-center items-center h-56">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-[#5742e3] text-center font-semibold text-base">No Data found</div>
          ) : (
            <div className="ag-theme-material" style={{ height: 'fit-content', maxWidth: "100%" }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={20}
                domLayout='autoHeight'
                animateRows={true}
                headerClass="bg-[#accdfa] text-[#5742e3]"
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

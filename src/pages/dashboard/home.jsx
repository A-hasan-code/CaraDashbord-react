import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  Avatar,
  Button,
  Input,
} from "@material-tailwind/react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { FaCalendarDays } from "react-icons/fa6";
import { FaGears } from "react-icons/fa6";
// Sample project data (Ensure the projectDate is in a valid format like YYYY-MM-DD)
const projectData = [
  {
    "id": 1,
    "name": "John Doe",
    "projectDate": "2025-03-24",
    "startTime": "10:00 AM",
    "finishTime": "04:00 PM",
    "location": "New York City",
    "vendor": "ABC Weddings",
    "imagePath": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png",
    "customFields": [
      
      { "label": "Custom Field 3", "value": "Custom Value 3",  },
      { "label": "Custom Field 3", "value": "Custom Value 3",  },
      { "label": "Custom Field 3", "value": "Custom Value 3",  },
      { "label": "Custom Field 3", "value": "Custom Value 3",  },
  
            { "label": "Custom Field 1", "value": "Custom Value 4", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "456", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
    , { "label": "Custom Field 1", "value": "Custom Value 14", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "5678", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" }, { "label": "Custom Field 1", "value": "Custom Value 14", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "5678", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" }, { "label": "Custom Field 1", "value": "Custom Value 14", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "5678", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" }, { "label": "Custom Field 1", "value": "Custom Value 14", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "5678", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },],
    "tags": ["wedding", "event", "art"],
    "age": 25
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "projectDate": "2025-03-24",
    "startTime": "11:00 AM",
    "finishTime": "05:00 PM",
    "location": "Los Angeles",
    "vendor": "XYZ Weddings",
    "imagePath": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png",
    "customFields": [
      { "label": "Custom Field 1", "value": "Custom Value 4", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "456", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 3", "value": "Custom Value 5", "image": "" }
    ],
    "tags": ["birthday", "celebration", "art"],
    "age": 28
  },
  {
    "id": 3,
    "name": "Michael Brown",
    "projectDate": "2025-05-15",
    "startTime": "09:00 AM",
    "finishTime": "03:00 PM",
    "location": "Chicago",
    "vendor": "LMN Events",
    "imagePath": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png",
    "customFields": [
      { "label": "Custom Field 1", "value": "Custom Value 6", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "789", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 3", "value": "Custom Value 7", "image": "" }
    ],
    "tags": ["corporate", "event", "business"],
    "age": 30
  },
  {
    "id": 4,
    "name": "Sarah Miller",
    "projectDate": "2025-06-21",
    "startTime": "02:00 PM",
    "finishTime": "06:00 PM",
    "location": "San Francisco",
    "vendor": "GHI Weddings",
    "imagePath": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png",
    "customFields": [
      { "label": "Custom Field 1", "value": "Custom Value 8", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "987", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 3", "value": "Custom Value 9", "image": "" }
    ],
    "tags": ["wedding", "art"],
    "age": 26
  },
  {
    "id": 5,
    "name": "David Wilson",
    "projectDate": "2025-07-05",
    "startTime": "08:00 AM",
    "finishTime": "04:00 PM",
    "location": "Miami",
    "vendor": "JKL Weddings",
    "imagePath": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png",
    "customFields": [
      { "label": "Custom Field 1", "value": "Custom Value 10", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "1234", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 3", "value": "Custom Value 11", "image": "" }
    ],
    "tags": ["party", "event", "celebration"],
    "age": 32
  },
  {
    "id": 6,
    "name": "Olivia Taylor",
    "projectDate": "2025-08-11",
    "startTime": "01:00 PM",
    "finishTime": "07:00 PM",
    "location": "Austin",
    "vendor": "LMN Events",
    "imagePath": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png",
    "customFields": [
      { "label": "Custom Field 1", "value": "Custom Value 12", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "4567", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 3", "value": "Custom Value 13", "image": "" }
    ],
    "tags": ["fashion", "event", "art"],
    "age": 29
  },
  {
    "id": 7,
    "name": "Anna Lee",
    "projectDate": "2025-09-05",
    "startTime": "11:00 AM",
    "finishTime": "04:00 PM",
    "location": "Seattle",
    "vendor": "XYZ Events",
    "imagePath": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png",
    "customFields": [
      { "label": "Custom Field 1", "value": "Custom Value 14", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "5678", "image": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 3", "value": "Custom Value 15", "image": "" }
    ],
    "tags": ["event", "conference"],
    "age": 31
  },
  {
    "id": 8,
    "name": "James White",
    "projectDate": "2025-10-12",
    "startTime": "01:00 PM",
    "finishTime": "05:00 PM",
    "location": "Dallas",
    "vendor": "LMN Events",
    "imagePath": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png",
    "customFields": [
      { "label": "Custom Field 1", "value": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png" },
      { "label": "Custom Field 2", "value": "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png"},
      { "label": "Custom Field 3", "value": "Custom Value 17", }
    ],
    "tags": ["product launch", "conference"],
    "age": 27
  }
];


export function Home() {
  const [filterTags, setFilterTags] = useState([]); // Filters for tags
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardSize, setCardSize] = useState("small"); // Default card size
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY"); // Default date format
  const [dateBold, setDateBold] = useState(false); // Default date not bold
  const [showSettings, setShowSettings] = useState(false); // State for toggling settings dropdown
  const [isFiltered, setIsFiltered] = useState(false); // Tracks if filters are applied

  const projectsPerPage = 8;

  const settingsRef = useRef(null); // Ref for settings dropdown
 const dateFilterRef = useRef(null);
  // Function to handle the filtering of the data
  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
    setIsFiltered(true); // Mark as filtered
  };
  const tagSuggestions = ["wedding", "event", "party", "celebration", "corporate", "birthday", "conference", "fashion", "business", "product launch", "art"];

const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  const handleTagFilter = () => {
    if (tagInput.trim() !== "") {
      setFilterTags([tagInput.toLowerCase()]);
    }
    setShowTagFilter(false);
    setIsFiltered(true); // Mark as filtered
  };

const handleTagSearch = () => {
    if (tagInput.trim() !== "") {
      setFilterTags([tagInput.toLowerCase()]);
      setIsFiltered(true); // Mark as filtered
    } else {
      setFilterTags([]);
      setIsFiltered(false); // Reset filter
    }
  };

const handleCloseDateFilter = () => {
    setShowDateFilter(false);
  };
  const handleClearFilters = () => {
    setFilterTags([]);
    setDateRange([
      { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]);
    setIsFiltered(false); // Reset filtered state
  };
useEffect(() => {
  const handleClickOutside = (event) => {
    // Agar settings dropdown ka click outside ho, toh settings band karo
    if (
      settingsRef.current &&
      !settingsRef.current.contains(event.target)
    ) {
      setShowSettings(false);
    }

    // Agar date filter dropdown ka click outside ho, toh date filter band karo
    if (
      dateFilterRef.current &&
      !dateFilterRef.current.contains(event.target)
    ) {
      setShowDateFilter(false);
    }
  };

  // Event listener add karo
  document.addEventListener("mousedown", handleClickOutside);

  // Cleanup function taake memory leak na ho
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showSettings, showDateFilter]); // Dependency array add ki takay effect update hota rahe


  // Function to format dates based on selected format
 const formatDate = (date) => {
    const dayOptions = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
    const dddOptions = { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" };
    const monthDayYearOptions = { weekday: "long", month: "2-digit", day: "2-digit", year: "numeric" };

    switch (dateFormat) {
      case "Day, DD Month YYYY":
        return new Date(date).toLocaleDateString("en-GB", dayOptions);
      case "ddd/DD/MM/YYYY":
        return new Date(date).toLocaleDateString("en-GB", dddOptions);
      case "Day, MM/DD/YYYY":
        return new Date(date).toLocaleDateString("en-US", monthDayYearOptions);
      default:
        return new Date(date).toLocaleDateString("en-US", dayOptions);
    }
  };


  // Function to filter the projects based on tags and date range
  const filterProjects = () => {
    return projectData.filter((project) => {
      if (!isFiltered) return true;

      const tagMatch =
        filterTags.length > 0
          ? filterTags.every((tag) => project.tags.includes(tag))
          : true;

      const projectDate = new Date(project.projectDate);
      const dateMatch =
        projectDate >= new Date(dateRange[0].startDate) &&
        projectDate <= new Date(dateRange[0].endDate);

      return tagMatch && dateMatch;
    });
  };

  const filteredProjects = filterProjects();
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
const getGridColumns = () => {
    switch (cardSize) {
      case 'small':
        return 'grid-cols-5'; // Show 4 cards in a row for small size
      case 'medium':
        return 'grid-cols-4'; // Show 3 cards in a row for medium size
      case 'large':
        return 'grid-cols-3'; // Show 2 cards in a row for large size
      default:
        return 'grid-cols-2'; // Default to 2 cards in a row
    }
  };
  return (
    <div className="mt-12   relative">
      <div className="relative bg-gradient-to-r from-gray-600 to-gray-900 text-white p-6 rounded-lg mb-6">
        <Typography variant="h3" className="font-extrabold text-3xl text-center">
          Project Gallery
        </Typography>
        <Typography variant="body1" className="mt-4 text-lg text-center">
          Discover amazing projects filtered by tags or date range.
        </Typography>
      </div>
    <div className="mt-6 bg-gray p-6 rounded-xl shadow-lg">
  <div className="flex justify-between items-center mb-4">
<div className="flex space-x-2"> {/* Reduced space between items */}
  {/* Date Filter Icon (replacing button with calendar icon) */}
   <div className="relative">
      {/* Date Filter Icon */}
      <div
        onClick={() => setShowDateFilter(!showDateFilter)}
        className="w-12 h-12 flex justify-center items-center border border-gray-600 rounded-lg cursor-pointer hover:bg-blue-100"
      >
        <FaCalendarDays size={20} />
      </div>

      {/* Date Range Picker - Show/Hide */}
      {showDateFilter && (
        <div
          ref={dateFilterRef} // Use ref to detect clicks outside this component
          className="absolute mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <DateRangePicker
            ranges={dateRange}
            onChange={handleDateChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            rangeColors={["#3b82f6"]}
          />
          <Button
            onClick={handleCloseDateFilter}
            className="mt-4"
            variant="outlined"
            color="red"
          >
            Close
          </Button>
        </div>
      )}
    </div>

  {/* Settings Dropdown with Icon */}
  <div className="relative">
    {/* Settings Button with Icon */}
    <div
      onClick={() => setShowSettings(!showSettings)}
      className="w-12 h-12 flex justify-center items-center border border-gray-600 rounded-lg cursor-pointer hover:bg-blue-100"
    >
      <FaGears size={20} />
    </div>

    {/* Settings Dropdown Menu */}
    {showSettings && (
      <div
        ref={settingsRef}
        className="absolute  w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      >
        <div className="p-4">
          <Typography variant="h6" className="text-lg font-medium mb-4">
            Card Settings
          </Typography>

          {/* Card Size Options */}
          <div className="space-y-2 mb-4">
            <div
              onClick={() => setCardSize("small")}
              className="cursor-pointer hover:bg-blue-100 p-2 rounded-md"
            >
              Small
            </div>
            <div
              onClick={() => setCardSize("medium")}
              className="cursor-pointer hover:bg-blue-100 p-2 rounded-md"
            >
              Medium
            </div>
            <div
              onClick={() => setCardSize("large")}
              className="cursor-pointer hover:bg-blue-100 p-2 rounded-md"
            >
              Large
            </div>
          </div>

          {/* Date Format Options */}
          <div className="space-y-2">
            <Typography variant="h6" className="text-lg mb-2">
              Date Format
            </Typography>
            <Button
              onClick={() => setDateFormat("Day, DD Month YYYY")}
              className="w-full text-left"
            >
              Day, DD Month YYYY
            </Button>
            <Button
              onClick={() => setDateFormat("ddd/DD/MM/YYYY")}
              className="w-full text-left"
            >
              ddd/DD/MM/YYYY
            </Button>
            <Button
              onClick={() => setDateFormat("Day, MM/DD/YYYY")}
              className="w-full text-left"
            >
              Day, MM/DD/YYYY
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>



  {/* Clear Filters Button */}
  {isFiltered && (
    <div className="mt-4 flex justify-center">
      <Button
        onClick={handleClearFilters}
        variant="outlined"
        color="red"
        className="w-36 hover:bg-red-100"
      >
        Clear Filters
      </Button>
    </div>
  )}
    {/* Tag Search Section */}
  <div className="flex items-center space-x-4 w-1/2">
  <div className="w-full relative">
    <Input
      type="text"
      value={tagInput}
      onChange={handleTagInputChange}
      placeholder="Search by tag"
      className="w-full border border-gray-900 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-sm hover:border-gray-400 transition-all"
    />

    {/* Show suggestions when tag input exists */}
    {tagInput && (
      <div className="absolute bg-white shadow-lg rounded-lg mt-2 p-2 w-full z-30 max-h-60 overflow-y-auto">
        <ul>
          {tagSuggestions
            .filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()))
            .map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer hover:bg-blue-100 p-2 transition-all"
                onClick={() => setTagInput(suggestion)}
              >
                {suggestion}
              </li>
            ))}
        </ul>
      </div>
    )}
  </div>

  {/* Search Button with Icon */}
  <div
    onClick={handleTagSearch}
    className="w-12 h-10 flex justify-center items-center bg-white hover:bg-gray-100 rounded-lg shadow-md cursor-pointer transition-all duration-300 ease-in-out"
  >
    <FaSearch size={20} className="text-black" />
  </div>
</div>

  </div>

 


</div>
      {/* Display All Cards */}
<div className={`grid gap-2 mt-6 ${getGridColumns()}`}>
  {currentProjects.map((project) => (
    <Card
      key={project.id}
     className={`w-full max-w-sm shadow-xl rounded-lg overflow-hidden bg-white hover:shadow-2xl transition duration-300 ${
    cardSize === "medium" ? "sm:max-w-md" : cardSize === "large" ? "sm:max-w-lg" : ""
  }`}
    >
      {/* First Part: Image and Title */}
      <div className="relative">
        <div className="w-full h-3/5 sm:h-3/5 md:h-64 overflow-hidden">
          <img
            src={project.imagePath}
            alt={project.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
          <Typography
            variant="h5"
            className={`text-white font-semibold ${dateBold ? "font-bold" : ""}`}
          >
            {project.name}
          </Typography>
        </div>
      </div>

      {/* Second Part: Project Details and Custom Fields */}
    <CardBody className="p-6 flex flex-col justify-between">
  <div className="flex flex-col flex-1">
    {/* Date and Time */}
    <Typography variant="h6" className="text-sm font-semibold text-gray-700 mb-2">
      {formatDate(project.projectDate)}
    </Typography>
    <div className="flex justify-between text-sm text-gray-600 mb-2">
      <Typography variant="small">Start: {project.startTime}</Typography>
      <Typography variant="small">Finish: {project.finishTime}</Typography>
    </div>

    {/* Custom Fields with Just Value */}
    <div className="flex flex-col mt-4  overflow-y-auto max-h-64 custom-scrollbar">
      {project.customFields
        .filter((field) => !field.image) // Only fields with no image
        .map((field, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mb-1">
            <Typography variant="body2" className="text-gray-700 font-semibold w-full">
              {field.label} {/* Display the label */}
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-600 max-w-sm break-words overflow-hidden text-ellipsis"
            >
              {field.value} {/* Display the value */}
            </Typography>
          </div>
        ))}
    </div>

    {/* Custom Fields with Image Links */}
    <div className="flex flex-wrap mt-4 space-x-2">
      {project.customFields
        .filter((field) => field.image) // Only fields with an image
        .slice(0, 10) // Limit to 10 images
        .map((field, index) => (
          <div key={index} className="flex items-center mb-2">
            <Avatar
              src={field.image}
              alt={field.label}
              size="sm"
              className="border-2 border-gray-300"
            />
          </div>
        ))}
    </div>
  </div>
</CardBody>

    </Card>
  ))}
</div>


      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="hover:bg-blue-100"
        >
          Previous
        </Button>
        <Typography className="mx-4">{currentPage}</Typography>
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * projectsPerPage >= filteredProjects.length}
          className="hover:bg-blue-100"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Home;

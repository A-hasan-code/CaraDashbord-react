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
import {FaSearch } from 'react-icons/fa';
import { FaCalendarDays } from "react-icons/fa6";
import { FaGears } from "react-icons/fa6";
import { AiOutlineEdit } from 'react-icons/ai'
import { BiDotsVerticalRounded } from "react-icons/bi";
import EasyCrop from "react-easy-crop";
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
  const tagSuggestions = ["wedding", "event", "party", "celebration", "corporate", "birthday", "conference", "fashion", "business", "product launch", "art"];

export function Home() {

   const [coverImage, setCoverImage] = useState(null);
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
    const [croppedImage, setCroppedImage] = useState(null); // State for cropped image
  const [cropArea, setCropArea] = useState({ x: 0, y: 0 }); // Crop area coordinates
  const [zoom, setZoom] = useState(1); // Zoom level
  const [isCropping, setIsCropping] = useState(false); 
  const [croppedImages, setCroppedImages] = useState({});// Flag to toggle cropping mode
 const handleCropClick = (projectId) => {
  console.log('Crop Clicked for Project ID:', projectId); // Debugging line
  setIsCropping((prev) => {
    console.log('Previous state:', prev); // Check the previous state
    return { ...prev, [projectId]: true }; // Set the specific project to true
  });
};

const handleSaveCrop = (projectId) => {
  setIsCropping((prev) => {
    const newState = { ...prev };
    delete newState[projectId]; // Remove the project ID from the state to stop cropping
    return newState;
  });
  setCroppedImages((prev) => ({
    ...prev,
    [projectId]: projectId, // Replace this with the actual cropped image data
  }));
};

const handleCancelCrop = (projectId) => {
  setIsCropping((prev) => {
    const newState = { ...prev };
    delete newState[projectId]; // Remove the project ID from the state to stop cropping
    return newState;
  });
};

  // Handle Crop Completion
  const onCropComplete = (crop, area, projectId) => {
    setCropArea((prev) => ({
      ...prev,
      [projectId]: area,
    }));
  };
useEffect(() => {
  console.log('Updated isCropping:', isCropping);
}, [isCropping]);



 
  const projectsPerPage = 8;

  const settingsRef = useRef(null); // Ref for settings dropdown
 const dateFilterRef = useRef(null);
const getLastYearRange = () => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear - 1, 0, 1); // January 1st of last year
  const endDate = new Date(currentYear - 1, 11, 31); // December 31st of last year
  return {
    startDate,
    endDate,
    key: 'lastYear',
  };
};

const getThisYearRange = () => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1); // January 1st of current year
  const endDate = new Date(currentYear, 11, 31); // December 31st of current year
  return {
    startDate,
    endDate,
    key: 'thisYear',
  };
};

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
   
 


const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

    
   // Function to handle the filtering of the data
  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
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
 const currentYear = new Date().getFullYear();
  const lastYearStart = new Date(currentYear - 1, 0, 1); // Jan 1 of Last Year
  const lastYearEnd = new Date(currentYear - 1, 11, 31); // Dec 31 of Last Year
  const thisYearStart = new Date(currentYear, 0, 1); // Jan 1 of This Year
  const thisYearEnd = new Date(currentYear, 11, 31); // Dec 31 of This Year
 const staticRanges = [
    {
      label: `Last Year (${currentYear - 1})`,
      range: () => ({
        startDate: lastYearStart,
        endDate: lastYearEnd,
      }),
      key: 'lastYear',
      isSelected: (range) => range.startDate.getTime() === lastYearStart.getTime() && range.endDate.getTime() === lastYearEnd.getTime(),
    },
    {
      label: `This Year (${currentYear})`,
      range: () => ({
        startDate: thisYearStart,
        endDate: thisYearEnd,
      }),
      key: 'thisYear',
      isSelected: (range) => range.startDate.getTime() === thisYearStart.getTime() && range.endDate.getTime() === thisYearEnd.getTime(),
    },
  ];

  // Function to handle the date range changes
 
 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
const getGridColumns = () => {
    switch (cardSize) {
      case 'small':
        return 'grid-cols-5'; 
      case 'medium':
        return 'grid-cols-4'; 
      case 'large':
        return 'grid-cols-3'; 
      default:
        return 'grid-cols-2'; 
    }
  };
  return (
    <div className="mt-12   relative">
      {/* Cover Image Section */}
   
  <div className="relative bg-gradient-to-r from-gray-600 to-gray-900 text-white p-6 rounded-lg mb-6 h-full min-h-[400px] flex flex-col justify-center items-center">
  {/* Cover Image Section */}
  <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
    <img
      src={coverImage || 'default-cover-image.jpg'} // Replace with your default image path
      alt="Cover"
      className="object-cover w-full h-full"
    />
  </div>

  {/* Pencil Icon Button */}
  <div className="absolute top-4 left-4 z-10">
    <label htmlFor="file-upload" className="cursor-pointer">
      <AiOutlineEdit className="text-white text-2xl" />
    </label>
  </div>

  {/* File Upload Input (hidden) */}
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />

  {/* Content */}
  <div className="relative z-10 text-center">
    <Typography variant="h3" className="font-extrabold text-3xl">
      Project Gallery
    </Typography>
    <Typography variant="body1" className="mt-4 text-lg">
      Discover amazing projects filtered by tags or date range.
    </Typography>
  </div>
</div>

    <div className="mt-6 bg-gray p-6 rounded-xl shadow-lg">
  <div className="flex justify-between items-center mb-4">
<div className="flex space-x-2"> </div>




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

  <div className="flex items-center space-x-4 w-1/2">
  <div className="w-full"></div>
  <div className="relative">
    
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
    className="w-20 h-10 flex justify-center items-center bg-white hover:bg-gray-100 rounded-lg shadow-md cursor-pointer transition-all duration-300 ease-in-out"
  >
    <FaSearch size={20} className="text-black" />
  </div>
  <div className="flex space-x-2"> 

   <div className="relative">

      <div
        onClick={() => setShowDateFilter(!showDateFilter)}
        className="w-12 h-12 flex justify-center items-center border border-gray-600 rounded-lg cursor-pointer hover:bg-blue-100 "
      >
        <FaCalendarDays size={20} />
      </div>

   
      {showDateFilter && (
        <div
          ref={dateFilterRef} // Use ref to detect clicks outside this component
          className="absolute mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 right-20 " 
        >
     
              <DateRangePicker
                   ranges={[getLastYearRange(), getThisYearRange()]} // Add custom range here
                  onChange={handleDateChange}
                  rangeColors={["#3b82f6"]}
                  showSelectionPreview={false}
                  moveRangeOnFirstSelection={false} // Set to true as requested
                  showCustomRangeLabel={true}
                staticRanges={staticRanges}
                  alwaysShowCalendars={true}
                />
{/* <div className="flex flex-col">
  <Button
    onClick={handleLastYearSelection}
    className="bg-transparent text-black border-none mb-2  border border-gray-900"
  >
    Last Year
  </Button>

  <Button
    onClick={handleThisYearSelection}
    className="bg-transparent text-black border-none mb-2"
  >
    This Year
  </Button>


</div> */}


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


  <div className="relative">
    
    <div
      onClick={() => setShowSettings(!showSettings)}
      className="w-12 h-12 flex justify-center items-center border border-gray-600 rounded-lg cursor-pointer hover:bg-blue-100"
    >
      <FaGears size={20} />
    </div>


    {showSettings && (
      <div
        ref={settingsRef}
        className="absolute  w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 right-0"
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
</div>

  </div>

 


</div>

<div className={`grid gap-2 mt-6 ${getGridColumns()}`}>
  {currentProjects.map((project) => {
      const croppedImage = croppedImages[project.id] || project.imagePath;
    return (
    <Card
      key={project.id}
     className={`w-full max-w-sm shadow-xl rounded-lg overflow-hidden bg-white hover:shadow-2xl transition duration-300 ${
    cardSize === "medium" ? "sm:max-w-md" : cardSize === "large" ? "sm:max-w-lg" : ""
  }`}
    >
      {/* First Part: Image and Title */}
      <div className="relative">
             <div className="absolute top-2 right-2 z-10">
        <button onClick={() => handleCropClick(project.id)}>
          <BiDotsVerticalRounded className="text-white cursor-pointer text-2xl" />
        </button>
      </div> 
      <div className="w-full h-80 overflow-hidden">
        
      <img
      src={croppedImage}
        alt={project.name}
        className="object-cover w-full h-full aspect-[3/4]" 
      />
{isCropping[project.id] && (
            <div className="absolute inset-0 flex justify-center items-center">
              <EasyCrop
                image={project.imagePath}
  crop={cropArea[project.id] || { x: 0, y: 0, width: 100, height: 100 }} // Default fallback
  zoom={zoom}
  aspect={3 / 4}
 onCropChange={(area) => onCropComplete(area, area, project.id)}
                      onZoomChange={setZoom}
              />
            </div>
          )}
         {isCropping[project.id]&& (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black via-transparent to-transparent p-4 flex justify-between">
              <button
                className="bg-red-500 text-white p-2 rounded"
                 onClick={() => handleCancelCrop(project.id)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white p-2 rounded"
                onClick={() => handleSaveCrop(project.id)}
              >
                Save
              </button>
            </div>
          )}
             
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
    <Typography variant="h1" className=" flex justify-center text-lg font-semibold text-gray-700 mb-2">
      {formatDate(project.projectDate)}
    </Typography>
  <div className="flex justify-center items-center text-lg text-gray-600 mb-2">
  <span>{project.startTime}</span>
  <span className="mx-2 text-xl">→</span> {/* Arrow between the times */}
  <span>{project.finishTime}</span>
</div>

{/* Custom Fields with Just Value */}
<div className="flex flex-col justify-center items-center mt-4 overflow-y-auto max-h-64 custom-scrollbar">
  {project.customFields
    .filter((field) => !field.image) // Only fields with no image
    .map((field, index) => (
      <div key={index} className="mb-4 flex items-center justify-center space-x-2">
        {/* Label (use CustomField if the value is a link) */}
        <Typography variant="body2" className="text-gray-700 font-semibold">
          {field.value.includes('http') ? 'CustomField:' : field.label + ':'}
        </Typography>

        {/* Value */}
        <Typography variant="body2" className="text-gray-600 break-words">
          {field.value.includes('http') ? (
            <a
              href={field.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
             {field.label}
            </a>
          ) : (
            field.value
          )}
        </Typography>
      </div>
    ))}
</div>




    {/* Custom Fields with Image Links */}
<div className="flex flex-wrap mt-4 relative">
  {project.customFields
    .filter((field) => field.image) // Only fields with an image
    .slice(0, 10) // Limit to 10 images
    .map((field, index) => (
      <div key={index} className="flex items-center mb-4 space-x-4 group relative">
        <img
          src={field.image}
          alt={field.label}
          size="sm"
          sx={{}}
          className="border-2 border-gray-300 rounded-md w-6 h-6 object-cover transition-all duration-300 transform group-hover:scale-110"
        />
        {/* <div className="hidden group-hover:block absolute bg-white p-3 rounded-md shadow-lg z-20 w-32 h-32 transform translate-z-40 -translate-y-90">
          <img
            src={field.image}
            alt={field.label}
            className="w-full h-full object-cover"
          />
        </div> */}
      </div>
    ))}
</div>


  </div>
</CardBody>

    </Card>
  )})}
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

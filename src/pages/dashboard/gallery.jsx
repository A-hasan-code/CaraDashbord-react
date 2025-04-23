import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  Avatar,
  Button,
  Input,
} from "@material-tailwind/react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from "react-router-dom";
import { FaGears } from "react-icons/fa6";
import { FaCheckCircle,FaGreaterThan,FaChevronRight } from "react-icons/fa";
import { GrInbox } from "react-icons/gr";

import { BiDotsVerticalRounded } from "react-icons/bi";
import SelectComponent from "@/constant/Select/Select";
import { useGallery } from "@/Redux/hooks/usegallery";
import { useDispatch, useSelector } from 'react-redux';
import { getGallery,setPage,setSortName, setSortDate,setLimit ,setStartDate, setEndDate  } from '@/Redux/slices/Gallery.slice'
;
import { getSearchSuggestions } from "@/Api/contactapi";

import Cropper from "react-easy-crop";
import {getImageSettings } from '@/Redux/slices/secretIdSlice'; 
 import { Tooltip } from "@mui/material";
import {Configurator}  from "@/widgets/layout";
import {DateRangePicker}from '@/widgets/layout/daterange'
import { MdBrowserUpdated } from "react-icons/md";
import { SiCustomink } from "react-icons/si";
import { FaSortAlphaDown, FaSortAlphaUp, FaCalendarAlt, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { GiEmptyHourglass } from "react-icons/gi";
import { LuSettings, LuFileText } from "react-icons/lu";
import { BiSort,BiSolidSortAlt } from "react-icons/bi";
import { SlCalender } from "react-icons/sl";
import { FaTimes } from "react-icons/fa";
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: '250px',
    border: '1px solid #f2f0f0',  // Custom border
    padding: '2px',
    borderRadius: '0.5rem',
    outline: 'none',
    backgroundColor: state.isFocused ? '#f0f0f0 !important' : '#f2f0f0',  
    boxShadow: 'none',  // Remove default blue glow
    borderColor: state.isFocused ? '#00000' : '#f2f0f0', // Change border color on focus
    transition: 'all 0.3s ease-in-out', 
    cursor: 'pointer',
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#d1d1d1 !important '  // Light grey for selected
      : state.isFocused 
        ? '#e6e6e6 !important '  // Light grey for hover
        : 'white !important ',  
    color: state.isSelected ? 'black' : 'black', 
    padding: '10px 12px',
    transition: 'background 0.2s ease-in-out', 
    cursor: 'pointer',
  }),

  placeholder: (provided) => ({
    ...provided,
    fontSize: '14px',
    fontStyle: 'italic',
    color: '#888',
  }),

  singleValue: (provided) => ({
    ...provided,
    fontWeight: 'bold',
    color: '#333',
  }),
};




export function Gallery() {
 

  const dispatch = useDispatch();
  const {  loading, error, page, limit, totalContacts,sortName, sortDate,startDate, endDate } = useSelector((state) => state.gallery);
 const { gallery, isLoading } = useGallery({
    page,
    limit,
   
    sortName,
    sortDate
  });
  console.log('galleryData', gallery);
    const [tags, setTags] = useState('');
   
  const [Loading, setLoading] = useState(false);
const settingsRef = useRef(null); 

const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
const [showDateFilter, setShowDateFilter] = useState(false);
const [cardSize, setCardSize] = useState("medium");
;
const [isFiltered, setIsFiltered] = useState(false);
const [activeProjectId, setActiveProjectId] = useState(null);
const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [selectedOptions, setSelectedOptions] = useState([]);
const [inputValue, setInputValue] = useState("");
const [options, setOptions] = useState([]);
;
  const [dateFormat, setDateFormat] = useState("Day, DD Month YYYY"); // Default date format
  const [showSettings, setShowSettings] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
const [atags, setaTags] = useState('');
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
 const { cover: imagelogo } = useSelector((state) => state.clientIdsSet);
    const [selectedDateRange, setSelectedDateRange] = useState({ startDate: null, endDate: null });

  const [activeSort, setActiveSort] = useState("");

//gallerypreview
  const [previewImage, setPreviewImage] = useState(null);
  const openPreview = (url) => setPreviewImage(url);
  const closePreview = () => setPreviewImage(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
    const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);



  const configuratorRef = useRef(null);
  // const toggleConfigurator = () => {
  //   setIsConfiguratorOpen(!isConfiguratorOpen); 
  // }
  const { user,  } = useSelector((state) => state.user);
// Handle image crop click
  const handleCropClick = (project) => {
    setActiveProjectId(project?.basicContactData?.id);
    setIsCropping(true);
    setImageSrc(project.cardCoverImage);
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setImageSrc(null);
  };
 const dateFilterRef = useRef(null); // For the dropdown date filter
  const calendarRef = useRef(null); // For the calendar dropdown
  // Handle crop completion
  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

const getCroppedImg = (imageSrc, crop, zoom, rotation) => {
  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = "anonymous"; // This allows cross-origin loading without credentials.

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      const croppedImage = canvas.toDataURL(); // This should now work if the image is fetched with proper CORS headers
      resolve(croppedImage);
    };

    image.onerror = (err) => reject(err);
  });
};


  // Save the cropped image
const handleSaveCrop = async () => {
  if (imageSrc && croppedAreaPixels) {
    try {
      setLoading(true);  // Set loading to true when crop operation starts

      // Get the cropped image as base64
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels, zoom, rotation);
      
      // Save the cropped image in localStorage or state
      localStorage.setItem(`croppedImage_${imageSrc}`, croppedImg);
      
      // Optionally, set the state to show the cropped image immediately
      setCroppedImage(croppedImg);

      // Hide the cropping UI by setting isCropping to false
      setIsCropping(false);
      
      // Optional: reset crop settings (if needed)
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);

    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setLoading(false);  // Set loading to false when crop operation finishes
    }
  }
};

const toggleConfigurator = () => {
    setIsConfiguratorOpen(!isConfiguratorOpen);
  };




  const handleCalendarToggle = () => {
    setCalendarVisible(!calendarVisible);
    setActiveSort("calendar");
  };


  //fillter 
   // console.log('options', options);

 
  // Handle input change (on search box change)
const handleInputChange = (value) => {
    setInputValue(value);
  };

  // Handle multi-select change (on selection)
  const handleMultiSelectChange = (selected) => {
    setSelectedOptions(selected || []); // Set selected options (multi-select)
  };
// useEffect(() => {
//   if (selectedOptions.length === 0 && inputValue === '') {
    
//     setIsFiltered(false); // Reset the filter state
//     setOptions([]); // Clear options list
//     dispatch(getGallery({ page, limit ,tags,sortName, sortDate}))
//     ; // Fetch the gallery without filters
    
//   }
// }, [selectedOptions, inputValue, dispatch, page, tags, limit,sortName, sortDate]);
  // Fetch search suggestions based on inputValue
  useEffect(() => {
    const fetchData = async () => {
      if (inputValue) { // Only fetch if there's an input value
        try {
          const data = await getSearchSuggestions(inputValue); // API call
          const formattedOptions = data?.suggestions?.map(item => ({
            label: item,  // Label for displaying
            value: item   // Value for selection
          })) || [];

          setOptions(formattedOptions); // Set new options
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        setOptions([]); // Clear options if inputValue is empty
      }
    };

    fetchData();
  }, [inputValue]);
   useEffect(() => {
    if (selectedOptions.length === 0) {
      // Reset filter if no options are selected
      setOptions([]);
      setaTags('');
    }
  }, [selectedOptions,setaTags]);
 useEffect(()=>{
    dispatch(getImageSettings());
  },[dispatch])

useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsRef.current && !settingsRef.current.contains(event.target) &&
        configuratorRef.current && !configuratorRef.current.contains(event.target)
      ) {
        // Close configurator and open settings dropdown
        setIsConfiguratorOpen(false);
        setShowSettings(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
   useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the configurator and open settings dropdown
      if (
        settingsRef.current && !settingsRef.current.contains(event.target) &&
        configuratorRef.current && !configuratorRef.current.contains(event.target)
      ) {
        setIsConfiguratorOpen(false);
        setShowSettings(true);
      }

      // Close date filter and calendar if clicked outside
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target) && showDateFilter) {
        setShowDateFilter(false);
      }

      if (calendarRef.current && !calendarRef.current.contains(event.target) && calendarVisible) {
        setCalendarVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateFilter, calendarVisible]);
  // Function to format dates based on selected format
  const formatDate = (date) => {
    const dayOptions = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
    const dddOptions = { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" };
    const monthDayYearOptions = { weekday: "long", month: "2-digit", day: "2-digit", year: "numeric" };
    const monthDashDayYearOptions = { weekday: "long", month: "2-digit", day: "2-digit", year: "numeric" };

    switch (dateFormat) {
      case "Day, DD Month YYYY":
        return new Date(date).toLocaleDateString("en-GB", dayOptions);
      case "ddd/DD/MM/YYYY":
        return new Date(date).toLocaleDateString("en-GB", dddOptions);
      case "Day, MM/DD/YYYY":
        return new Date(date).toLocaleDateString("en-US", monthDayYearOptions);
      case "Day, MM-DD-YYYY":
        return new Date(date).toLocaleDateString("en-US", monthDashDayYearOptions).replace(/\//g, "-");
      default:
        return new Date(date).toLocaleDateString("en-US", dayOptions);
    }
  };


 useEffect(() => {
    const handleClickOutside = (event) => {
      // Close settings if clicked outside
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component is unmounted or updated
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

// useEffect(() => {
//   // Fetch data again whenever specific filters change
//   dispatch(getGallery({ 
//     page, 
//     limit, 
//     tags: atags, 
//     sortName, 
//     sortDate 
//   }));
// }, [dispatch, page, limit, atags, sortName, sortDate]); // Trigger on changes in filters or other conditions

 const getGridColumns = () => {
  switch (cardSize) {
    case "small":
      return "grid-cols-2 sm:grid-cols-2 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-8";
    case "medium":
      return "grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6";
    case "large":
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5";
    default:
      return "grid-cols-1";
  }
};
 const getTextSize = () => {
  switch (cardSize) {
    case "small":
      return "text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm 2xl:text-sm";
    case "medium":
      return "text-sm sm:text-base md:text-base lg:text-base xl:text-base 2xl:text-base";
    case "large":
      return "text-sm sm:text-base md:text-base lg:text-base xl:text-base 2xl:text-base";
    default:
      return "text-base";
  }
};
const labelTextSize = () => {
  switch (cardSize) {
    case "small":
      return "text-[10px] sm:text-[12px] md:text-[12px] lg:text-[12x] xl:text-[10px] 2xl:text-[11.5px] leading-[0.8]";
    case "medium":
      return "text-[14px] sm:text-[14px] md:text-[14px] lg:text-[14px] xl:text-[14px] 2xl:text-[14px] leading-[0.8]";
    case "large":
      return "text-[16px] sm:text-[16px] md:text-[16px] lg:text-[16px] xl:text-[16px] 2xl:text-[16px] leading-[0.9]";
    default:
      return "text-sm leading-[0.6]";
  }
};

const getTimeSize = () => {
  switch (cardSize) {
    case "small":
      return "text-[12px] sm:text-[14px] md:text-[14px] lg:text-[14px] xl:text-[12px] 2xl:text-[12px] leading-[1.1]";
    case "medium":
      return "text-[13px] sm:text-[13px] md:text-[13px] lg:text-[13px] xl:text-[13px] 2xl:text-[13px] leading-[0.99]";
    case "large":
      return "text-[15px] sm:text-[15px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] leading-[0.99]";
    default:
      return "text-sm";
  }
};
 const ProjectTextSize = () => {
  switch (cardSize) {
     case "small":
      return "text-[13px] sm:text-[10.5px] md:text-[10.5px] lg:text-[10.5px] xl:text-[10.5px] 2xl:text-[13px] leading-[.99]";
    case "medium":
      return "text-[15px] sm:text-[15px] md:text-[15px] lg:text-[15px] xl:text-[15px] 2xl:text-[17px] leading-[0.99]";
    case "large":
      return "text-[18px] sm:text-[18px] md:text-[18px] lg:text-[18px] xl:text-[18px] 2xl:text-[19px] leading-[0.99]";
    default:
      return "text-sm";
  }
};
   useEffect(() => {
    const filters = selectedDateRange.startDate && selectedDateRange.endDate
      ? { startDate: selectedDateRange.startDate, endDate: selectedDateRange.endDate }
      : {};

    dispatch(getGallery({ page, limit, ...filters, tags: atags, sortName, sortDate }));
  }, [dispatch, page, limit, selectedDateRange, atags, sortName, sortDate]);



    const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(getGallery({ page: newPage, limit, tags: atags, sortName, sortDate,startDate,
    endDate  }));
    window.scrollTo(0, 0);
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    dispatch(setLimit(newLimit));
    dispatch(setPage(1));
    dispatch(getGallery({ page: 1, limit: newLimit, tags: atags, sortName, sortDate,startDate,
    endDate  }));
    window.scrollTo(0, 0);
  };

  const formatName = (name) => {
    if (!name) return ""; 

    return name
      .split(" ")
      .filter((part) => part.toLowerCase() !== "null") 
      .map((part) => part.toUpperCase()) 
      .join(" ");
  };

   // Handle the filter for tags and dates
  const handleTagSearch = () => {
    if (selectedOptions.length > 0) {
      setIsFiltered(true);
      const selectedTags = selectedOptions.map(option => option.label).join(',');
      setaTags(selectedTags);
      dispatch(getGallery({ page: 1,  tags: selectedTags,sortName, sortDate,  startDate,
    endDate }));
    }
  };console.log(selectedDateRange)
    const handleSortByName = (order) => {
      setActiveSort(`name-${order}`);
// console.log("Sorting by name in order:", order); 
console.log("Sorting by name in order:", order);
 dispatch(getGallery({ 
    page, 
    limit, 
    tags:atags,
    sortName: order, 
    sortDate ,
      startDate,
    endDate
    
  }));
 };

  const handleSortByDate = (order) => {
  //  console.log("Sorting by date in order:", atags);
   setActiveSort(`date-${order}`);
     dispatch(getGallery({ page, limit ,tags:atags,sortName,sortDate:order, startDate,
    endDate}))
   
  };
 const handleDateRangeChange = (range) => {
  setIsFiltered(true);
  const start = range.startDate;
  const end = range.endDate;

  dispatch(setPage(1)); // Reset to first page
  dispatch(setStartDate(start));
  dispatch(setEndDate(end));
  dispatch(getGallery({
    page: 1,
    limit,
    tags: atags,
    sortName,
    sortDate,
    startDate: start,
    endDate: end,
  }));
};


 const handleClearFilters = () => {
  setDateRange([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
  setSelectedOptions([]);
  setInputValue('');
  dispatch(setStartDate(null));
  dispatch(setEndDate(null));
  dispatch(setSortName(''));
  dispatch(setSortDate(''));
  dispatch(getGallery({ page, limit }));
  setIsFiltered(false);
  setOptions([]);
};






  const Loader = () => (
   <div className="flex flex-col justify-center items-center w-full h-full fixed top-0 left-0 bg-white bg-opacity-50 z-10">
  {/* Spinner */}
  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>

  {/* Loading Text */}
  <div className="text-[#5742e3] font-medium text-lg">Loading fresh data ...</div>
</div>

);
            const imageSrca = imagelogo 
  ? `https://caradashboard-backend-production.up.railway.app${imagelogo}` 
  : 'https://storage.googleapis.com/msgsndr/8gm7q9rR8M1dcm9kMsiq/media/67e32fef1870f408b83d0d0d.png';
  return (<div >

  {user?.role==='superadmin' &&(
    <div className="mt-1 flex justify-center ">
  <h1 className="text-3xl font-bold ">Welcome to Admin Panel</h1>
</div>

  )}
    {user?.role === 'company' && (
    <div className="relative">
     
<div className="mt-1 bg-white p-2 rounded-xl shadow-lg border border-gray-200">
  <div className="flex flex-col lg:flex-row md:flex-row justify-between items-center mb-3 mt-3">
    <div className="flex items-center space-x-4 ">
      <div className="relative flex-grow">
        <SelectComponent
          options={options}
          value={selectedOptions}
          onChange={handleMultiSelectChange}
          placeholder="Search by tag,custom fields,name"
          onInputChange={handleInputChange}
          styles={customStyles}
        />
      </div>
      <div
        onClick={handleTagSearch}
        className="w-10 h-10 flex justify-center items-center bg-white border border-gray-300 hover:bg-gray-100 rounded-lg shadow-sm cursor-pointer transition-all duration-300 ease-in-out mt-2 lg:mt-0"
      >
        <FaSearch size={20} className="text-gray-700" />
      </div>
    </div>

<div className="flex items-center space-x-4 w-full lg:w-auto mt-4 lg:mt-0 flex-col sm:flex-row sm:space-x-4">
  {isFiltered && (
    <div className="w-full sm:w-auto mb-2 sm:mb-0">
      <Button
        onClick={handleClearFilters}
        variant="outlined"
         className="w-full sm:w-40 lg:w-40 h-10 flex justify-center items-center border border-gray-600 text-center rounded-lg cursor-pointer bg-white  text-black hover:bg-[#e9eafb] hover:text-[#5742e3] space-x-2 transition-colors duration-200"

      >
        Clear Filters
      </Button>
    </div>
  )}

  <div className="flex flex-col sm:flex-row sm:space-x-2 w-full sm:w-auto">
   <div className="relative w-full sm:w-auto mb-2 sm:mb-0">
  {/* More Filter Toggle Button */}
  <div
    onClick={() => setShowDateFilter(!showDateFilter)}
    className="w-full sm:w-40 lg:w-40 h-10 flex justify-center items-center border border-gray-600 text-center rounded-lg cursor-pointer bg-white  text-black hover:bg-[#e9eafb] hover:text-[#5742e3] space-x-2 transition-colors duration-200"
>
  
    <MdOutlineDashboardCustomize size={20} />
    <h5 className="text-sm md:text-base">More Filter</h5>
  </div>

  {/* Filter Dropdown */}
  {showDateFilter && (
   <aside
  ref={dateFilterRef}
  className="absolute mt-2 w-full lg:w-56 bg-white shadow-lg rounded-lg border border-gray-600 z-50"
>
  <div className="flex flex-col space-y-2 p-4 text-sm">
    {/* Project Date Heading */}
    <div className="cursor-pointer flex items-center space-x-2">
      <BiSort size={18} className="text-black" />
      <Typography variant="h8"className="text-lg font-medium">Project Date</Typography>
    </div>

    {/* Sort by Project Date */}
    <div
      onClick={() => handleSortByDate("asc")}
      className={`cursor-pointer py-2 pl-4 pr-2 rounded-md flex items-center hover:bg-[#e9eafb] ${
        activeSort === "date-asc" ? "bg-[#e9eafb]" : ""
      }`}
    >
      <FaSortAmountDown size={16} className="mr-2" />
      <span className="flex-grow">Ascending</span>
    </div>

    <div
      onClick={() => handleSortByDate("desc")}
      className={`cursor-pointer py-2 pl-4 pr-2 rounded-md flex items-center hover:bg-[#e9eafb] ${
        activeSort === "date-desc" ? "bg-[#e9eafb]" : ""
      }`}
    >
      <FaSortAmountUp size={16} className="mr-2" />
      <span className="flex-grow">Descending</span>
    </div>

    {/* Client Name Heading */}
    <div className="cursor-pointer flex items-center space-x-2 mt-1">
      <BiSolidSortAlt size={18} className="text-black" />
      <Typography variant="h8"className="text-lg font-medium">Client Name</Typography>
    </div>

    {/* Sort by Client Name */}
    <div
      onClick={() => handleSortByName("asc")}
      className={`cursor-pointer py-2 pl-4 pr-2 rounded-md flex items-center hover:bg-[#e9eafb] ${
        activeSort === "name-asc" ? "bg-[#e9eafb]" : ""
      }`}
    >
       <FaSortAlphaDown size={16} className="mr-2" />
      <span>A - Z</span>
    </div>

    <div
      onClick={() => handleSortByName("desc")}
      className={`cursor-pointer py-2 pl-4 pr-2 rounded-md flex items-center hover:bg-[#e9eafb] ${
        activeSort === "name-desc" ? "bg-[#e9eafb]" : ""
      }`}
    ><FaSortAlphaUp size={16} className="mr-2" />
     
      <span>Z - A</span>
    </div>

    {/* Show Calendar Heading */}
    <div className="cursor-pointer flex items-center space-x-2 mt-1">
      <SlCalender size={18} className="text-black" />
      <Typography variant="h8"className="text-lg font-medium">Show Calendar</Typography>
    </div>

    <div
      onClick={handleCalendarToggle}
      className={`cursor-pointer py-2 pl-4 pr-2 rounded-md flex items-center hover:bg-[#e9eafb] ${
        activeSort === "calendar" ? "bg-[#e9eafb]" : ""
      }`}
    >
      <FaCalendarAlt size={16} className="mr-2" />
      <span>Calendar</span>
    </div>
  </div>
</aside>

  )}

  {/* Calendar Component */}
  {calendarVisible && (
    <div
      ref={calendarRef}
      className="absolute mt-2 w-full sm:w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 right-0"
    >
      <DateRangePicker onDateRangeChange={handleDateRangeChange} />
    </div>
  )}
</div>

    <div className="relative w-full sm:w-auto mb-2 sm:mb-0">
      <div
        onClick={() => setShowSettings(!showSettings)}
       className="w-full sm:w-40 lg:w-40 h-10 flex justify-center items-center border border-gray-600 text-center rounded-lg cursor-pointer bg-white text-black hover:bg-[#e9eafb] hover:text-[#5742e3] space-x-2 transition-colors duration-200"
      >
        <FaGears size={20} /> <h5 className="text-sm md:text-base">Customize View</h5>
      </div>

      {showSettings && (
<aside
  ref={settingsRef}
  className="absolute w-full lg:w-72 bg-white border px-4 py-4 border-gray-200 rounded-lg shadow-lg z-50 right-1 overflow-y-auto max-h-[80vh] text-sm"
>
  <div>
    {/* Card Settings Header */}
    <div className="flex items-center space-x-2 mb-2">
      <LuSettings size={18} />
      <Typography variant="h8" className="text-lg font-medium">
        Card Settings
      </Typography>
    </div>

    {/* Card Size Options */}
    {["small", "medium", "large"].map((size) => (
      <div
        key={size}
        onClick={() => setCardSize(size)}
        className={`cursor-pointer hover:bg-[#e9eafb] py-2 pl-4 pr-2 rounded-md flex items-center ${
          cardSize === size ? "bg-[#e9eafb]" : ""
        }`}
      >
        <FaCheckCircle
          size={16}
          className={`mr-2 ${
            cardSize === size ? "text-[#5742e3]" : "text-transparent"
          }`}
        />
        {size.charAt(0).toUpperCase() + size.slice(1)}
      </div>
    ))}

    {/* Date Format Header */}
    <div className="flex items-center space-x-2 mt-4 mb-2">
      <MdBrowserUpdated size={18} />
      <Typography variant="h8" className="text-lg font-medium">
        Date Format
      </Typography>
    </div>

    {/* Date Format Options */}
    {[
      "Day, DD Month YYYY",
      "ddd/DD/MM/YYYY",
      "Day, MM/DD/YYYY",
      "Day, MM-DD-YYYY",
    ].map((format) => (
      <div
        key={format}
        onClick={() => setDateFormat(format)}
        className={`cursor-pointer hover:bg-[#e9eafb] py-2 pl-4 pr-2 rounded-md flex items-center ${
          dateFormat === format ? "bg-[#e9eafb]" : ""
        }`}
      >
        {dateFormat === format ? (
          <FaCheckCircle size={16} className="mr-2 text-[#5742e3]" />
        ) : (
          <div className="w-4 mr-2" /> // keeps spacing consistent when check icon is hidden
        )}
        <div className="flex-grow">{format}</div>
        <FaGreaterThan size={12} className="ml-auto" />
      </div>
    ))}

    {/* Custom Fields Header */}
    <div className="flex items-center space-x-2 mt-4 mb-2">
      <LuFileText size={18} />
      <Typography variant="h8" className="text-lg font-medium">
        Custom Fields Settings
      </Typography>
    </div>

    {/* Configurator Toggle */}
    <div className="space-y-2">
      <div
        onClick={toggleConfigurator}
        className="cursor-pointer py-2 pl-4 pr-2 flex justify-between items-center hover:bg-[#e9eafb] rounded-md text-sm"
      >
        <div className="flex-grow pl-6">Display fields</div>
        <FaChevronRight size={16}  />
      </div>

      {isConfiguratorOpen && (
        <div ref={configuratorRef}>
          <Configurator />
        </div>
      )}
    </div>
  </div>
</aside>

      )}
    </div>
  </div>
</div>


  </div>
</div>






   <>
  <div className={`grid ${getGridColumns()} gap-4 p-4 flex justify-center items-center min-h-[300px]`}>
  {loading ? (
  <Loader />
) : gallery && gallery.length > 0 ? (
  gallery.map((project) => {
    const displayImage = localStorage.getItem(`croppedImage_${project?.cardCoverImage}`);
    const croppedImage = displayImage || project?.cardCoverImage;

    const handleCardClick = (contactId, location) => {
      const messageData = { contactId, location };
      window.parent.postMessage(messageData, "*");
      console.log("Sent to parent:", messageData);
    };

    const contactId = project?.basicContactData?.contact_id;
    const location = project?.basicContactData?.location_id;

    return (
      <Card
        key={project?.basicContactData?.id}
        className={`w-full max-w-sm shadow-xl rounded-lg overflow-hidden bg-white border border-[#d9d9d9] hover:shadow-2xl transition duration-300 ${
          cardSize === "medium"
            ? "sm:max-w-md"
            : cardSize === "large"
            ? "sm:max-w-lg"
            : ""
        } flex flex-col h-fit cursor-pointer`}
      >
        <div className="relative flex-shrink-0 h-[65%] overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            {croppedImage && (
              <button onClick={() => handleCropClick(project)}>
                <BiDotsVerticalRounded className="text-white cursor-pointer text-2xl" />
              </button>
            )}
          </div>

          {croppedImage ? (
            <img
              src={croppedImage}
              alt={project?.basicContactData?.name}
              className="object-cover w-full h-full aspect-[3/4]"
            />
          ) : (
            <div className="w-full h-full aspect-[3/4] bg-white flex items-center justify-center" />
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/10 via-transparent to-transparent p-2 flex justify-center">
            <h2
              className={`text-center font-bold text-black text-${getTextSize()} truncate`}
              style={{ textShadow: "0px 0px 2px white, 1px 1px 1px white" }}
            >
              {formatName(project.basicContactData?.name) || "No Name"}
            </h2>
          </div>

          {isCropping && activeProjectId === project?.basicContactData?.id && (
            <div className="crop-container">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-10">
                  <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              )}
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={handleSaveCrop}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelCrop}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <CardBody
          className="p-2 flex-grow flex-col justify-between h-[35%]"
          onClick={() => handleCardClick(contactId, location)}
        >
          <div className="flex flex-col flex-1">
            <Typography
              variant="h1"
              className={`flex justify-center ${ProjectTextSize()} font-bold text-black mb-1`}
            >
              {project.standardCustomFields["projectDate"]
                ? formatDate(project.standardCustomFields["projectDate"])
                : "No Project Date Available"}
            </Typography>

            <div className={`flex justify-center items-center ${labelTextSize()} text-gray-600 mb-1`}>
              <span>{project.standardCustomFields.startTime || "00.00"}</span>
              <span className="mx-2">→</span>
              <span>{project.standardCustomFields.finishTime || "00.00"}</span>
            </div>

            <div className={`flex justify-center items-center ${getTextSize()} text-gray-600 mb-1`}>
              <Tooltip title={project?.basicContactData?.address}>
                <Typography variant="body2" className={`truncate font-medium text-${labelTextSize()}`}>
                  {project?.basicContactData?.address || "No Address"}
                </Typography>
              </Tooltip>
            </div>

            {project?.customCustomFields.map((field, index) => (
              <div key={index} className={`mb-1 flex items-start gap-x-2 ${labelTextSize()}`}>
                <Tooltip title={field.label} arrow>
                  <div className="text-black font-normal truncate w-[45%] overflow-hidden">
                    <Typography variant="body2" className={`truncate font-normal text-${labelTextSize()} linesettings`}>
                      {field?.value?.includes("http") ? "CustomField" : field?.label}:
                    </Typography>
                  </div>
                </Tooltip>
                <Tooltip title={field.value} arrow>
                  <div className={`text-gray-800 truncate w-[55%] overflow-hidden text-${labelTextSize()}`}>
                    {field?.value?.includes("http") ? (
                      <a
                        href={field?.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {field?.label}
                      </a>
                    ) : (
                      field?.value || "null"
                    )}
                  </div>
                </Tooltip>
              </div>
            ))}

            <div className="flex flex-wrap mt-1 relative min-h-[25px]">
              {project.relatedImages.slice(0, 10).map((imageUrl, index) => (
                <div key={index} className="flex items-center space-x-2 group relative cursor-pointer">
                  <img
                    src={imageUrl}
                    alt={`Related Image ${index + 1}`}
                    className="border-2 border-gray-300 rounded-md w-[15.5px] h-6 object-cover transition-transform duration-300 transform group-hover:scale-110"
                  />
                </div>
              ))}
            </div>

            {previewImage && (
              <div
                className="fixed inset-0 z-50 bg-black/10 backdrop-blur-md bg-opacity-70 flex items-center justify-center transition-opacity duration-300"
                onClick={closePreview}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-2xl w-[90%] scale-95 animate-zoomIn"
                >
                  <button
                    onClick={closePreview}
                    className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-300"
                  >
                    <FaTimes className="text-[#5742e3]" />
                  </button>

                  <img
                    src={previewImage}
                    alt="Preview"
                    className="rounded-xl border border-[#d9d9d9] shadow-2xl w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    );
  })
) : (
  <div className="col-span-full text-center text-gray-500 py-12">
    {isFiltered ? "No matching records found for the applied filters." : "No data available yet."}
  </div>
)}


  
  </div>

 




       
 </>
  </div> 
  )}
  <></>
     {gallery && gallery.length > 0 && (
          <footer className=" py-2">
             
          
            {/* Pagination */}
      <div className="flex justify-center items-center">
  <Button
    onClick={() => handlePageChange(page - 1)}
    disabled={page === 1}
    className="bg-[#accdfa] hover:bg-[#5742e3] text-white px-4 py-2 rounded-full disabled:opacity-90 disabled:cursor-not-allowed"
  >
    Previous
  </Button>

  <Typography className="mx-4">Page {page} of {limit > 0 ? Math.ceil(totalContacts / limit) : 1}</Typography>

  <Button
    onClick={() => handlePageChange(page + 1)}
    disabled={limit === 0 || page * limit >= totalContacts}
    className="bg-[#accdfa] hover:bg-[#5742e3] text-white px-4 py-2 rounded-full disabled:opacity-90 disabled:cursor-not-allowed"
  >
    Next
  </Button>
</div>
 <div className="flex justify-between items-center mt-4">
  {/* Left Side */}
  <div className="flex items-center space-x-2">
     <label
    htmlFor="limit-left"
    className="text-sm font-medium text-gray-700"
  >
    Total Contacts:
  </label>
  <span className="text-sm text-gray-900 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    {totalContacts}
  </span>

  </div>

  {/* Right Side */}
  <div className="flex items-center space-x-2">
    <label
      htmlFor="limit-right"
      className="text-sm font-medium text-gray-700"
    >
      Items per page:
    </label>
    <select
      id="limit-right"
      value={limit}
      onChange={handleLimitChange}
      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value={48}>48</option>
      <option value={72}>72</option>
      <option value={0}>Show All</option>
    </select>
  </div>
</div>


          </footer>
        )} 
  </div>
  );
}

// export default Gallery;

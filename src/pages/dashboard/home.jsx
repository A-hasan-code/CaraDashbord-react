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
import { FaCalendarDays } from "react-icons/fa6";
import { FaGears } from "react-icons/fa6";
import { AiOutlineEdit } from 'react-icons/ai'
import { BiDotsVerticalRounded } from "react-icons/bi";
import SelectComponent from "@/constant/Select/Select";
import RangeCalender from "@/constant/range calender/RangeCalender";
import CachedIcon from '@mui/icons-material/Cached';
import Axios from '@/Api/Axios'
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getGallery, setPage } from '@/Redux/slices/Gallery.slice'
import { useDebounce } from 'use-debounce';
import { getSearchSuggestions } from "@/Api/contactapi";
// Sample project data (Ensure the projectDate is in a valid format like YYYY-MM-DD)

//cropper
import Cropper from "react-easy-crop";
//cropper



const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: '1px solidrgb(61, 68, 83)',
    padding: '4px',
    borderRadius: '0.5rem',
    outline: 'none',
    boxShadow: state.isFocused ? '0 0 0 2px white' : '0 1px 2px rgba(0, 0, 0, 0.05)',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};


export function Home() {
  const dispatch = useDispatch();
  const { gallery, page, limit, totalContacts, setIsLoading } = useSelector((state) => state.gallery);
  // console.log('gallery', gallery);
  const settingsRef = useRef(null); // Ref for settings dropdown
  const dateFilterRef = useRef(null);

  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1)
  const [cardSize, setCardSize] = useState("small");
  const [dateBold, setDateBold] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);



  ///////////////////// select and input value
  const [selectedOptions, setSelectedOptions] = useState([]);
  // console.log('selectedOptions', selectedOptions);
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounce(inputValue, 500);
  const [options, setOptions] = useState([]);
  // console.log('options', options);

  const handleMultiSelectChange = (selected) => {
    setSelectedOptions(selected || []);
  };
  const handleInputChange = (value) => {
    setInputValue(value);
  };
  // Use debounced value for any logic
  useEffect(() => {
    const fetchData = async () => {
      if (debouncedValue) {
        try {
          const data = await getSearchSuggestions(debouncedValue);
          const formattedOptions = data?.suggestions?.map(item => ({
            label: item,
          })) || [];
          setOptions(formattedOptions);
        } catch (error) {
          toast.error("Error on fetching data");
        }
      }
    };
    fetchData();
  }, [debouncedValue]);

  // Handle the filter for tags and dates
  const handleTagSearch = () => {
    if (selectedOptions.length > 0) {
      setIsFiltered(true);
      const selectedTags = selectedOptions.map(option => option.label).join(',');
      dispatch(getGallery({ page: 1, limit: 10, tags: selectedTags }));
    }
  };
  const handleClearFilters = () => {
    setDateRange([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
    setSelectedOptions([]);
    dispatch(getGallery({ page, limit }));
    setIsFiltered(false);
  };



  // State for image cropping
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);

  // State for uploading images
  const [logo, setLogo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY"); // Default date format
  const [showSettings, setShowSettings] = useState(false);

  const { clientId, clientSecret, isEditing, cover: imagelogo } = useSelector((state) => state.clientIdsSet);

  const handleCropClick = (project) => {
    setImageSrc(project?.imagePath);
    setIsCropping(true);
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setImageSrc(null);
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImageFinal = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      setCoverImage(croppedImageFinal);  // Store cropped image
      setIsCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  const getCroppedImg = (imageSrc, pixelCrop, rotation = 0) => {
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxSize = Math.max(image.width, image.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        ctx.translate(maxSize / 2, maxSize / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-maxSize / 2, -maxSize / 2);
        ctx.drawImage(image, 0, 0);
        const data = ctx.getImageData(0, 0, maxSize, maxSize);
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        ctx.putImageData(data, Math.round(0 - pixelCrop.x), Math.round(0 - pixelCrop.y));
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob);
            resolve(croppedImageUrl);
          } else {
            reject(new Error("Canvas is empty"));
          }
        });
      };

      image.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleCloseDateFilter = () => {
    setShowDateFilter(false);
  };
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

  const filterProjects = () => {
    return gallery.filter((project) => {
      if (!isFiltered) return;
      const tagMatch = selectedOptions.every((option) => project?.basicContactData?.tags.includes(option?.value));
      const projectDate = new Date(project.projectDate);
      const dateMatch = projectDate >= new Date(dateRange[0].startDate) && projectDate <= new Date(dateRange[0].endDate);
      return tagMatch || dateMatch;
    });
  };

  const filteredProjects = filterProjects();
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

  const paginate = (pageNumber) => {
    dispatch(setPage(pageNumber)); // Dispatch action to update page
  };
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

  const handleCover = async (e) => {
    const file = e.target.files[0];
    setLogo(file);
    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", "cover");

    try {
      setLoading(true);
      const response = await Axios.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && response.data.setting) {
        toast.success("Cover image uploaded successfully!");
        setCoverImage(response.data.setting.imageUrl);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload cover image");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getGallery({ page, limit }));
  }, [dispatch, page, limit]);

  //function to change name upper case
  const formatName = (name) => {
    if (!name) return ""; // Handle undefined or empty names

    return name
      .split(" ")
      .filter((part) => part.toLowerCase() !== "null") // Remove "null" values
      .map((part) => part.toUpperCase()) // Convert to uppercase
      .join(" ");
  };

  return (
    <div className="mt-12   relative">
      {/* Cover Image Section */}

      <div className="relative bg-gradient-to-r from-gray-600 to-gray-900 text-white p-6 rounded-lg mb-6 h-full min-h-[400px] flex flex-col justify-center items-center">
        {/* Cover Image Section */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
          <img
            src={`https://caradashboard-backend-production.up.railway.app${imagelogo}` || imagePreview}
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
          onChange={handleCover}
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
            <CachedIcon className={`cursor-pointer ${loading ? 'animate-spin' : ''}`} style={{ fontSize: 25, transition: 'transform 0.3s ease' }} />
            <div className="relative w-full">
              <SelectComponent
                options={options}
                value={selectedOptions}
                onChange={handleMultiSelectChange}
                placeholder="Search by tag"
                onInputChange={handleInputChange}
                styles={customStyles}
              />
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
                    <RangeCalender />


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
                        <Button
                          onClick={() => setDateFormat("Day, MM-DD-YYYY")}
                          className="w-full text-left"
                        >
                          Day, MM-DD-YYYY
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

      <div className={`grid gap-2 mt-5 ${getGridColumns()}`}>
        {gallery.map((project) => {
          // const croppedImage = croppedImages[project.id] || project.imagePath;
          const croppedImage = project.cardCoverImage || '';
          return (
            <Card
              key={project?.basicContactData?.id}
              className={`w-full max-w-sm shadow-xl rounded-lg overflow-hidden bg-white hover:shadow-2xl transition duration-300 ${cardSize === "medium" ? "sm:max-w-md" : cardSize === "large" ? "sm:max-w-lg" : ""
                }`}
            >
              {/* First Part: Image and Title */}
              <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <button onClick={() => handleCropClick(project)}>
                    <BiDotsVerticalRounded className="text-white cursor-pointer text-2xl" />
                  </button>
                </div>
                <div className="w-full h-90 overflow-hidden">
                  <img
                    src={croppedImage || 'https://cdn.vectorstock.com/i/500p/54/17/person-gray-photo-placeholder-man-vector-24005417.jpg'}
                    alt={project?.basicContactData?.name}
                    className="object-cover w-full h-full aspect-[3/4]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
                    <Typography variant="h5" className={`text-white font-semibold ${dateBold ? "font-bold" : ""}`}>
                      {/* {project.basicContactData?.name || 'No Name'} */}
                      {formatName(project.basicContactData?.name) || "No Name"}
                    </Typography>
                  </div>
                </div>

                {/* cropper */}
                {isCropping && activeProjectId === project?.basicContactData?.id && (
                  <div className="crop-container">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation}
                      aspect={1} // Aspect ratio (1:1 for square)
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onRotationChange={setRotation}
                      onCropComplete={onCropComplete}
                    />
                    {/* Save and Cancel Buttons */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                      <button
                        onClick={handleSaveCrop}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
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
              {/* cropper */}

              {/* Second Part: Project Details and Custom Fields */}
              <CardBody className="p-6 flex flex-col justify-between">
                <div className="flex flex-col flex-1">
                  <Typography variant="h1" className="flex justify-center text-lg font-semibold text-gray-700 mb-2">
                    {project.standardCustomFields.projectDate}
                    {formatDate(project.standardCustomFields.projectDate)}
                  </Typography>
                  <div className="flex justify-center items-center text-lg text-gray-600 mb-2">
                    <span>{project.standardCustomFields.startTime || '00.00'}</span>
                    <span className="mx-2 text-xl">→</span>
                    <span>{project.standardCustomFields.finishTime || '00.00'}</span>
                  </div>

                  {/* Custom Fields */}
                  <div className="flex flex-col  mt-1 overflow-y-auto max-h-68 custom-scrollbar">
                    {project?.customCustomFields.map((field, index) => (
                      <div key={index} className="mb-2 flex items-center justify-center space-x-2 text-sm">
                        <div variant="body2" className="text-gray-700 font-semibold text-sm " >
                          {field?.value?.includes('http') ? 'CustomField:' : field.label + ':'}
                        </div>
                        <div variant="body2" className="text-gray-600 break-words   text-" >
                          {field?.value?.includes('http') ? (
                            <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">
                              {field.label}
                            </a>
                          ) : (
                            field.value || 'null'
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Fields with Images */}
                  <div className="flex flex-wrap mt-1 relative">
                    {project.relatedImages
                      .filter((field) => field.image)
                      .slice(0, 10)
                      .map((field, index) => (
                        <div key={index} className="flex items-center mb-4 space-x-4 group relative">
                          <img
                            src={field.image}
                            alt={field.label}
                            className="border-2 border-gray-300 rounded-md w-5 h-8 object-cover transition-all duration-300 transform group-hover:scale-110"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>



      {/* Pagination */}
      <div className="flex justify-center items-center  mt-6">
        <Button
          onClick={() => paginate(page - 1)}
          disabled={page === 1}
          className="hover:bg-blue-100"
        >
          Previous
        </Button>
        <Typography className="mx-4">{page}</Typography>
        <Button
          onClick={() => paginate(page + 1)}
          // disabled={page >= filteredProjects}
          className="hover:bg-blue-100"
        >
          Next
        </Button>
        <Typography className="mx-4">Total Contacts: {totalContacts}</Typography>
      </div>
    </div >
  );
}

export default Home;

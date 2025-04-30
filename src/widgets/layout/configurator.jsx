import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaGripVertical } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomFields, updateDisplaySettings } from '@/Redux/slices/customfieldslice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress, Button, TextField } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { sync } from '@/Api/Settingsapi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getGallery } from '@/Redux/slices/Gallery.slice';

export function Configurator() {
  const dispatch = useDispatch();
  const { customFields, loading, error } = useSelector(state => state.displaycfields);
  const { displaycf } = useSelector(state => state.clientIdsSet);
  const [selectedFields, setSelectedFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const { gallery, page, limit, totalContacts, sortName, sortDate } = useSelector((state) => state.gallery);

  useEffect(() => {
    dispatch(fetchCustomFields());
  }, [dispatch]);

  useEffect(() => {
    if (displaycf) {
      const initiallySelectedFields = displaycf.filter(field => field?.visible);
      setSelectedFields(initiallySelectedFields);
    }
  }, [displaycf]);

  const handleVisibilityToggle = (cf_id, cf_name) => {
    const fieldExists = selectedFields.some(field => field?.cf_id === cf_id);
    if (fieldExists) {
      setSelectedFields(prev => prev.filter(field => field?.cf_id !== cf_id));
    } else if (selectedFields.length < 5) {
      setSelectedFields(prev => [...prev, { cf_id, cf_name, visible: true }]);
    } else {
      toast.warning('You can only select up to 5 fields.');
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    const fieldsToSave = selectedFields.map(field => ({
      cf_id: field?.cf_id,
      cf_name: field?.cf_name,
      visible: field?.visible,
    }));

    dispatch(updateDisplaySettings({ displaySetting: fieldsToSave }))
      .then(() => {
        toast.success('Selections saved successfully!');
        dispatch(fetchCustomFields());
        dispatch(getGallery({
          page,
          limit,
          sortName,
          sortDate,
        }));
        setIsSaving(false);
      })
      .catch(() => {
        toast.error('Error saving selections!');
        setIsSaving(false);
      });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const data = await sync();
      toast.success(data.message || "Sync complete!");
      dispatch(fetchCustomFields());
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred while syncing.");
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredFields = (customFields || [])
    .filter(field => field && field.cf_id && field.cf_name && field.cf_key)
    .filter(({ cf_id, cf_key, cf_name }) =>
      cf_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cf_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cf_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(({ cf_name }) => {
      const lowerName = cf_name.toLowerCase();
      return lowerName !== 'related images' && lowerName !== 'cover image';
    });

  const prioritizedFields = [
    ...selectedFields,
    ...filteredFields.filter(
      (field) =>
        field?.cf_id &&
        !selectedFields.some(
          (selected) => selected?.cf_id === field.cf_id
        )
    ),
  ];

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;

    const reorderedFields = Array.from(selectedFields);
    const [removed] = reorderedFields.splice(source.index, 1);
    reorderedFields.splice(destination.index, 0, removed);

    setSelectedFields(reorderedFields);
  };

  return (
    <div className="flex">
      <aside className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white shadow-lg transition-transform duration-300 overflow-y-auto ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mb-6 sticky top-0 z-50 bg-white px-4 py-1">
          <h2 className="text-xl font-bold mb-4">Custom Fields Panel</h2>

          <div>
            <TextField
              label="Search Fields"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              sx={{ marginBottom: '1rem', width: '100%' }}
            />
            <Button
              variant="contained"
              onClick={handleSync}
              disabled={isSyncing}
              sx={{
                marginBottom: '1rem',
                width: '100%',
                backgroundColor: '#e9eafb',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#e9eafb',
                  color: '#5742e3',
                },
              }}
            >
              {isSyncing ? <CircularProgress size={20} /> : <CachedIcon />}
            </Button>
          </div>
        </div>

        <div className="space-y-3 max-h-90 overflow-y-auto">
          <li className="text-sm font-semibold text-gray-800 no-underline list-none p-2">
            visible fields
          </li>

       <DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="droppable-fields">
    {(provided) => (
      <ul
        className="space-y-3"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {prioritizedFields.map((field, index) => {
          if (!field || !field.cf_id || !field.cf_name) return null;
          const { cf_id, cf_name } = field;
          const isSelected = selectedFields.some(sel => sel?.cf_id === cf_id);

          return (
            <Draggable key={cf_id} draggableId={cf_id} index={index}>
              {(provided) => (
                <li
                  className="flex justify-start items-center p-2 bg-gray-100 rounded-md"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <FaGripVertical className="mr-2 text-gray-500 cursor-move" />
                  <span className="text-left">{cf_name}</span>
                  <button
                    onClick={() => handleVisibilityToggle(cf_id, cf_name)}
                    className="text-gray-600 hover:text-black ml-auto"
                  >
                    {isSelected ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
                  </button>
                </li>
              )}
            </Draggable>
          );
        })}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
</DragDropContext>

        </div>

        <div className="mt-auto sticky bottom-0 z-50">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={selectedFields.length === 0 || selectedFields.length > 5 || isSaving}
            sx={{
              width: '100%',
              backgroundColor: '#e9eafb',
              color: '#000',
              '&:hover': {
                backgroundColor: '#e9eafb',
                color: '#5742e3',
              },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Selections'}
          </Button>
        </div>
      </aside>

      <div
        className={`fixed top-0 left-0 z-40 w-full h-full bg-black opacity-50 sm:hidden ${isPanelOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsPanelOpen(false)}
      ></div>
    </div>
  );
}

export default Configurator;

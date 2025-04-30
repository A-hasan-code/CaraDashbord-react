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
  const { customFields } = useSelector(state => state.displaycfields);
  const { displaycf } = useSelector(state => state.clientIdsSet);
  const { page, limit, sortName, sortDate } = useSelector((state) => state.gallery);

  const [allFields, setAllFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchCustomFields());
  }, [dispatch]);

  useEffect(() => {
    if (customFields && displaycf) {
      const validFields = customFields
        .filter(field => field && field.cf_id && field.cf_key && field.cf_name)
        .filter(({ cf_name }) => !['cover image', 'related images'].includes(cf_name.toLowerCase()));

      const initiallySelected = displaycf.filter(field => field?.visible);
      const unselected = validFields.filter(
        f => !initiallySelected.some(sel => sel.cf_id === f.cf_id)
      );

      setSelectedFields(initiallySelected);
      setAllFields([...initiallySelected, ...unselected]);
    }
  }, [customFields, displaycf]);

  const handleVisibilityToggle = (cf_id, cf_name) => {
    const isVisible = selectedFields.some(f => f.cf_id === cf_id);
    if (isVisible) {
      setSelectedFields(prev => prev.filter(f => f.cf_id !== cf_id));
    } else if (selectedFields.length < 5) {
      setSelectedFields(prev => [...prev, { cf_id, cf_name, visible: true }]);
    } else {
      toast.warning("Only 5 fields can be selected.");
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    const dataToSave = selectedFields.map(field => ({
      cf_id: field.cf_id,
      cf_name: field.cf_name,
      visible: true,
    }));

    dispatch(updateDisplaySettings({ displaySetting: dataToSave }))
      .then(() => {
        dispatch(fetchCustomFields());toast.success("Selections saved!");
        dispatch(getGallery({ page, limit, sortName, sortDate }));
   
        setIsSaving(false);
      })
      .catch(() => {
        toast.error("Error saving selections.");
        setIsSaving(false);
      });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await sync();
      toast.success(res.message || "Synced!");
      dispatch(fetchCustomFields());
    } catch (err) {
      toast.error(err?.response?.data?.error || "Sync error.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const reordered = [...allFields];
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setAllFields(reordered);

    // Maintain updated order for selectedFields too
    const updatedSelected = reordered.filter(field =>
      selectedFields.some(f => f.cf_id === field.cf_id)
    );
    setSelectedFields(updatedSelected);
  };

  const filteredFields = allFields.filter(field => {
    const query = searchQuery.toLowerCase();
    return (
      field.cf_id.toLowerCase().includes(query) ||
      field.cf_key.toLowerCase().includes(query) ||
      field.cf_name.toLowerCase().includes(query)
    );
  });

  const isSaveDisabled = isSaving || selectedFields.length < 1 || selectedFields.length > 5;

  return (
    <div className="flex">
      <aside className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white shadow-lg transition-transform duration-300 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mb-6 sticky top-0 z-50 bg-white px-4 py-1">
          <h2 className="text-xl font-bold mb-4">Custom Fields Panel</h2>

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

        <div className="space-y-3 max-h-[70vh] overflow-y-auto px-4 pb-4">
          <li className="text-sm font-semibold text-gray-800 list-none">Sortable Fields</li>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-fields">
              {(provided) => (
                <ul
                  className="space-y-3"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {filteredFields.map((field, index) => {
                    const isSelected = selectedFields.some(f => f.cf_id === field.cf_id);
                    return (
                      <Draggable key={field.cf_id} draggableId={field.cf_id} index={index}>
                        {(provided, snapshot) => (
                          <li
                            className={`flex items-center p-2 rounded-md bg-gray-100 ${snapshot.isDragging ? 'shadow-md bg-blue-100' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <FaGripVertical className="mr-2 text-gray-500 cursor-move" />
                            <span>{field.cf_name}</span>
                            <button
                              onClick={() => handleVisibilityToggle(field.cf_id, field.cf_name)}
                              className="ml-auto text-gray-600 hover:text-black"
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

        <div className="sticky bottom-0 bg-white p-4 shadow-inner">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaveDisabled}
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

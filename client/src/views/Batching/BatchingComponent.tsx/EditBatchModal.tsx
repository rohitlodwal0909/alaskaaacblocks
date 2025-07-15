import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Label, TextInput,  } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateBatching, GetBatching } from "src/features/batching/BatchingSlice"; // adjust path
import { AppDispatch } from "src/store";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
const EditBatchModal = ({ open, setOpen, batchingData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({});

  const required = ['shift', 'operator_name', 'mould_no', 'cement_qty'];
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (batchingData) {
      setFormData(batchingData);
    }
  }, [batchingData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
     await dispatch(updateBatching(formData)).unwrap();
      toast.success("Batch updated successfully");
      dispatch(GetBatching());
      setOpen(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const fields = [
    { id: 'mould_no', label: 'Mould No', type: 'number', placeholder: 'Enter mould no' },
    { id: 'operator_name', label: 'Operator Name', placeholder: 'Enter operator name' },
    { id: 'shift', label: 'Shift', type: 'select', options: ['Day', 'Night'] },
    { id: 'entry_time', label: 'Entry Time', type: 'time', placeholder: 'Enter time' },
    { id: 'mould_oil_qty', label: 'Mould Oil Qty', type: 'number' },
    { id: 'slurry_waste', label: 'Slurry Waste (kg)', type: 'number' },
    { id: 'slurry_fresh', label: 'Slurry Fresh (kg)', type: 'number' },
    { id: 'cement_qty', label: 'Cement Qty (kg)', type: 'number' },
    { id: 'lime_qty', label: 'Lime Qty (kg)', type: 'number' },
    { id: 'gypsum_qty', label: 'Gypsum Qty (kg)', type: 'number' },
    { id: 'soluble_oil_qty', label: 'Soluble Oil Qty (kg)', type: 'number' },
    { id: 'aluminium_qty', label: 'Aluminium Powder (gm)', type: 'number' },
    { id: 'density', label: 'Density (kg/m3)', type: 'number' },
    { id: 'flow_value', label: 'Flow Value', type: 'number' },
    { id: 'temperature', label: 'Temperature (°C)', type: 'number' },
    { id: 'hardener_qty', label: 'Hardener Qty', placeholder: 'NIL or qty' },
    { id: 'remark', label: 'Remark', placeholder: 'Remarks or notes' },
    
];
  return (
    <Modal show={open} onClose={() => setOpen(false)} size="4xl">
      <ModalHeader>Edit Batching Entry</ModalHeader>
      <ModalBody>
        <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
           {fields.map(({ id, label, type = 'text', options = [], placeholder }) => {
  const isTextarea = id === 'remark';
  const isHalfWidth = id === 'remark' || id === 'hardener_qty';
  const isTime = id === 'entry_time';
  const colSpan = isHalfWidth ? 'col-span-6' : 'col-span-4';

  return (
    <div className={colSpan} key={id}>
      <Label htmlFor={id} value={label} />

      {type === 'select' ? (
        <select
          id={id}
          value={formData[id] || ''}
          onChange={(e) => handleChange(id, e.target.value)}
          className={`w-full p-2 border rounded ${errors[id] ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : isTime ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            value={formData[id] ? dayjs(formData[id], 'HH:mm:ss') : null}
            onChange={(value) => {
              const formatted = value ? dayjs(value).format('HH:mm:ss') : '';
              handleChange(id, formatted);
            }}
            slotProps={{
              textField: {
                id,
                fullWidth: true,
                error: !!errors[id],
                helperText: errors[id],
                sx: {
                  '& .MuiInputBase-root': {
                    fontSize: '14px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '6px',
                    height: '38px',
                  },
                   '& .css-1hgcujo-MuiPickersInputBase-root-MuiPickersOutlinedInput-root': {
            height: '42px',
            fontSize: '14px',
           
            backgroundColor: '#f1f5f9',
            borderRadius: '6px',
          },
                  '& input': {
                    padding: '4px 8px',
                    fontSize: '13px',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '12px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cbd5e1',
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      ) : isTextarea ? (
        <textarea
          id={id}
          value={formData[id] || ''}
          onChange={(e) => handleChange(id, e.target.value)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={`w-full p-2 border rounded ${errors[id] ? 'border-red-500' : 'border-gray-300'}`}
          rows={2}
        />
      ) : (
        <TextInput
          id={id}
          type={type}
          value={formData[id] || ''}
          onChange={(e) => handleChange(id, e.target.value)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={` ${!isHalfWidth && 'form-rounded-md'}`}
          style={{ height: isHalfWidth ? '67px' : undefined, borderRadius: '8px' }}
          color={errors[id] ? 'failure' : 'gray'}
        />
      )}

      {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
    </div>
  );
})}
          <div className="col-span-12 flex justify-end gap-4 mt-4">
            <Button color="gray" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit"color="primary" >Update</Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

export default EditBatchModal;

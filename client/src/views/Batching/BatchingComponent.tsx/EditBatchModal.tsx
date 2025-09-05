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
import { useParams } from "react-router";
const EditBatchModal = ({ open, setOpen, batchingData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({});
  const {id} = useParams();
const requiredFields = [
  "mould_no",
  "operator_name",
  "shift",
  "entry_time",
  "mould_oil_qty",
  "slurry_waste",
  "slurry_fresh",
  "cement_qty",
  "lime_qty",
  "gypsum_qty",
  "soluble_oil_qty",
  "aluminium_qty",
  "density",
  "temperature",
  "water_consume",
  "dicromate",
  "mixing_time"
  // ✅ "flow_value", "remark", "hardener_qty" are NOT included here (optional)
];
  // const required = ['shift', 'operator_name', 'mould_no', 'cement_qty' ,'mould_no'];

  console.log(batchingData)
  const [errors, setErrors] = useState<any>({});

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
  const newErrors: any = {};
  requiredFields.forEach((field) => {
    const value = formData[field];

    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      newErrors[field] = `${field.replace(/_/g, " ")} is required`;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e :any) => {
    e.preventDefault();
 if (!validateForm()) return;
    try {
     await dispatch(updateBatching(formData)).unwrap();
      toast.success("Batch updated successfully");
      dispatch(GetBatching(id));
      setOpen(false);
    } catch (err: any) {
  if (typeof err === "string") {
    toast.error(err); // ✅ string from rejectWithValue
  } else if (err?.message) {
    toast.error(err.message); // ✅ fallback if rejectWithValue didn't trigger
  } else {
    toast.error("Something went wrong");
  }
}
  };

  const fields = [
    { id: 'mould_no', label: 'Mould No', type: 'number', placeholder: 'Enter mould no' },
    { id: 'operator_name', label: 'Operator Name', placeholder: 'Enter operator name' },
    { id: 'shift', label: 'Shift', type: 'select', options: ['Day', 'Night'] },
    { id: 'entry_time', label: 'Discharge Time', type: 'time', placeholder: 'Enter Discharge Time' },
    { id: 'mould_oil_qty', label: 'Mould Oil Qty  (ml)', type: 'number' },
    { id: 'slurry_waste', label: 'Slurry Waste  (ltr)', type: 'number' },
    { id: 'slurry_fresh', label: 'Slurry Fresh  (ltr)', type: 'number' },
    { id: 'cement_qty', label: 'Cement Qty (kg)', type: 'number' },
    { id: 'lime_qty', label: 'Lime Qty (kg)', type: 'number' },
    { id: 'gypsum_qty', label: 'Gypsum Qty (kg)', type: 'number' },
    { id: 'soluble_oil_qty', label: 'Soluble Oil Qty  (ltr)', type: 'number' },
    { id: 'aluminium_qty', label: 'Aluminium Powder (grm)', type: 'number' },
    { id: 'density', label: 'Density (kg/m3)', type: 'number' },
    { id: 'flow_value', label: 'Flow Value', type: 'number' },
    { id: 'temperature', label: 'Temperature (°C)', type: 'number' },
    { id: 'water_consume', label: 'Water Consume (ltr)', type: 'number', placeholder: 'Enter Water Consume (ltr)' },
    { id: 'dicromate', label: 'Dicromate (gm)', type: 'number', placeholder: 'Enter Dicromate (gm) ' },
    { id: 'hardener_qty', label: 'Hardener Qty (ltr)',   type: 'number' ,placeholder: 'Enter Hardener (ltr)' },
    { id: 'mixing_time', label: 'mixing Time', type: 'time', placeholder: 'Select mixing time' },
    { id: 'remark', label: 'Remark', placeholder: 'Remarks or notes' },
    ];
  return (
    <Modal show={open} onClose={() => setOpen(false)} size="4xl">
      <ModalHeader>Edit Batching Entry</ModalHeader>
      <ModalBody>
        <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
           {fields.map(({ id, label, type = 'text', options = [], placeholder }) => {
  const isTextarea = id === 'remark';
  const isHalfWidth = id === 'remark';
  const isTime = id === 'entry_time' ||  id === 'mixing_time';
  const colSpan = isHalfWidth ? 'col-span-6' : 'col-span-4';

  return (
    <div className={colSpan} key={id}>
      <Label htmlFor={id} value={label} />
   <span className="text-red-700 ps-1">{ isHalfWidth || id === 'density' || id === 'flow_value' || id === 'hardener_qty' ? ""  :  "*"}</span>

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
  value={
    formData[id]
      ? (id === "mixing_time"
          ? dayjs(formData[id], "mm:ss") // 👈 mixing_time ke liye
          : dayjs(formData[id], "HH:mm:ss") // 👈 entry_time ke liye
        )
      : null
  }
  views={id === "mixing_time" ? ["minutes", "seconds"] : ["hours", "minutes"]}
  format={id === "mixing_time" ? "mm:ss" : "hh:mm A"}
  onChange={(value) => {
    const formatted = value
      ? (id === "mixing_time"
          ? dayjs(value).format("mm:ss") // 👈 DB me sirf mm:ss save hoga
          : dayjs(value).format("HH:mm:ss")) // 👈 DB me full time save hoga
      : "";
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
          onKeyDown={(e) => {
    if (
      type === "number" && 
      ["e", "E", "+", "-", "."].includes(e.key)
    ) {
      e.preventDefault();
    }
  }}
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

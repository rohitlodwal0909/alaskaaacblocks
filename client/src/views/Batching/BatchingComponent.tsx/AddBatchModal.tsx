// components/batching/AddBatchModal.tsx
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addBatching, GetBatching } from 'src/features/batching/BatchingSlice';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
const AddBatchModal = ({ show, setShowmodal, logindata ,batchingdata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    user_id:logindata?.admin?.id,
    shift: '',
    operator_name: '',
    mould_no: '',
    slurry_waste: '',
    slurry_fresh: '',
    cement_qty: '',
    lime_qty: '',
    gypsum_qty: '',
    soluble_oil_qty: '',
    aluminium_qty: '',
    density: '',
    flow_value: '',
    temperature: '',
    entry_time: '',
    hardener_qty: '',
    remark: '',
    mould_oil_qty: '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
  const excludedFields = ["remark", "hardener_qty", "density"];
  const requiredFields = Object.keys(formData).filter(
    (field) => !excludedFields.includes(field)
  );

  const newErrors: any = {};
  requiredFields.forEach((field) => {
    if (!formData[field]) {
      newErrors[field] = `${field} is required`;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;
const existing = batchingdata?.some((item: any) => item.mould_no == formData.mould_no);
  if (existing) {
    toast.error(`Mould No ${formData.mould_no} already exists.`);
    return;
  }

    try {
      const result = await dispatch(addBatching(formData)).unwrap();
      toast.success(result.message || 'Batch created successfully');
      dispatch(GetBatching())
      setFormData({
       user_id:logindata?.admin?.id,
    shift: '',
    operator_name: '',
    mould_no: '',
    slurry_waste: '',
    slurry_fresh: '',
    cement_qty: '',
    lime_qty: '',
    gypsum_qty: '',
    soluble_oil_qty: '',
    aluminium_qty: '',
    density: '',
    flow_value: '',
    temperature: '',
    entry_time: '',
    hardener_qty: '',
    remark: '',
    mould_oil_qty: '',
  });
      setShowmodal(false)
    } catch (err: any) {
  if (typeof err === "string") {
    // rejectWithValue was used, so we get a string
    toast.error(err);
  } else if (err?.error) {
    toast.error(err.error);
  } else if (err?.message) {
    toast.error(err.message);
  } else {
    toast.error("Something went wrong");
  }

  console.error("Caught error:", err);
}
  };

  const shiftOptions = ['Day', 'Night'];

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create New Batching Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
  {/* 1. Mould No */}
  <div className="col-span-4">
    <Label htmlFor="mould_no" value="Mould No" />
     <span className="text-red-700 ps-1">*</span>
    <TextInput
      id="mould_no"
      type="number"
      value={formData.mould_no}
      placeholder="Enter mould number"
        className='form-rounded-md'
      onChange={(e) => handleChange('mould_no', e.target.value)}
      color={errors.mould_no ? 'failure' : 'gray'}
    />
    {errors.mould_no && <p className="text-red-500 text-xs">{errors.mould_no}</p>}
  </div>

  {/* 2. Operator Name */}
  <div className="col-span-4">
    <Label htmlFor="operator_name" value="Operator Name" />
     <span className="text-red-700 ps-1">*</span>
    <TextInput
      id="operator_name"
      type="text"
      value={formData.operator_name}
      placeholder="Enter operator name"
        className='form-rounded-md'
      onChange={(e) => handleChange('operator_name', e.target.value)}
      color={errors.operator_name ? 'failure' : 'gray'}
    />
    {errors.operator_name && <p className="text-red-500 text-xs">{errors.operator_name}</p>}
  </div>

  {/* 3. Shift Dropdown */}
  <div className="col-span-4">
    <Label htmlFor="shift" value="Shift" />
     <span className="text-red-700 ps-1">*</span>
    <select
      id="shift"
      value={formData.shift}
      onChange={(e) => handleChange('shift', e.target.value)}
      className="w-full p-2 border rounded-sm border-gray-300"
    >
      <option value="">Select Shift</option>
      {shiftOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    {errors.shift && <p className="text-red-500 text-xs">{errors.shift}</p>}
  </div>

  {/* Rest of the fields */}
  {[
    { id: 'entry_time', label: 'Entry Time', type: 'time', placeholder: 'Select entry time' },
    { id: 'mould_oil_qty', label: 'Mould Oil Qty (ltr)', type: 'number', placeholder: 'Enter mould oil (ltr)' },
    { id: 'slurry_waste', label: 'Slurry Waste (ltr)', type: 'number', placeholder: 'Enter waste slurry (ltr)' },
    { id: 'slurry_fresh', label: 'Slurry Fresh (ltr)', type: 'number', placeholder: 'Enter fresh slurry (ltr)' },
    { id: 'cement_qty', label: 'Cement Qty (kg)', type: 'number', placeholder: 'Enter cement (kg)' },
    { id: 'lime_qty', label: 'Lime Qty (kg)', type: 'number', placeholder: 'Enter lime (kg)' },
    { id: 'gypsum_qty', label: 'Gypsum Qty (kg)', type: 'number', placeholder: 'Enter gypsum (kg)' },
    { id: 'soluble_oil_qty', label: 'Soluble Oil Qty (ltr)', type: 'number', placeholder: 'Enter soluble oil (ltr)' },
    { id: 'aluminium_qty', label: 'Aluminium Powder (gm)', type: 'number', placeholder: 'Enter aluminium powder (gm)' },
    { id: 'density', label: 'Density (kg/m3)', type: 'number', placeholder: 'Enter final density (kg/m³)' },
    { id: 'flow_value', label: 'Flow Value', type: 'number', placeholder: 'Enter flow value' },
    { id: 'temperature', label: 'Temperature (°C)', type: 'number', placeholder: 'Enter temperature (°C)' },
    { id: 'hardener_qty', label: 'Hardener Qty', type: 'text', placeholder: 'Enter hardener qty or NIL' },
    { id: 'remark', label: 'Remark', type: 'text', placeholder: 'Enter remarks or QC notes' },
  ].map(({ id, label, type = 'text', placeholder }) => {
  const isTextarea = id === 'remark';
  const isHalfWidth = id === 'remark' || id === 'hardener_qty';
  const columnSpan = isHalfWidth ? 'col-span-6' : 'col-span-4';
 
  return (
    <div className={columnSpan} key={id}>
    <Label htmlFor={id} value={label} />
   <span className="text-red-700 ps-1">{ isHalfWidth || id === 'density' ? ""  :  "*"}</span>
  {/* Time Picker Field */}
  {id === 'entry_time' ? (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        value={formData[id] ? dayjs(formData[id]) : null}
        onChange={(value:any) => handleChange(id, value)}
        slotProps={{
          textField: {
            id,
            fullWidth: true,
            // error: !!errors[id],
            // helperText: errors[id],
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
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#cbd5e1',
              },
              '& input': {
               padding: '9.5px 0'
              },
              '& .MuiInputLabel-root': {
                fontSize: '12px',
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  ) : isTextarea ? (
    
    <textarea
      id={id}
      value={formData[id]}
      placeholder={placeholder}
      onChange={(e) => handleChange(id, e.target.value)}
      className={`w-full border rounded-md p-2 ${errors[id] ? 'border-red-500' : 'border-gray-300'}`}
      rows={2}
    />
  ) : (
    <TextInput
      id={id}
      type={type}
      value={formData[id]}
      placeholder={placeholder}
      onChange={(e) => handleChange(id, e.target.value)}
      color={errors[id] ? 'failure' : 'gray'}
      className={` ${!isHalfWidth && id ==="entry_time"  && 'form-rounded-md'}`}
      style={{
        height: isHalfWidth ? '67px' : undefined,
        borderRadius: '8px',
      }}
    />
  )}

  {/* Error message */}
  {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
</div>
  );
})}
</form>

      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>Cancel</Button>
        <Button type="submit"color='primary' onClick={handleSubmit}>Submit</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddBatchModal;

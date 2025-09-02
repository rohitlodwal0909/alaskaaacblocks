import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addCutting, GetCutting } from 'src/features/Cutting/CuttingSlice';
import { useParams } from 'react-router';


const AddCuttingModal = ({ show, setShowmodal, batchingData,logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {id} = useParams();


  const [formData, setFormData] = useState({
    user_id:logindata?.admin?.id,
    mould_no: batchingData?.mould_no || '',
    rising_id:batchingData?.rising_info?.id,
    operator_name: '',
    sizes: [''],
    broken_pcs: [''],
    time: '',
    remark: '',
    datetime:'',
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, mould_no: batchingData?.mould_no || '',
      rising_id:batchingData?.rising_info?.id
     }));
  }, [batchingData]);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };
const handleMultiChange = (index, field, value) => {
  const updated = [...formData[field]];
  updated[index] = value;
  setFormData((prev) => ({ ...prev, [field]: updated }));
};

const addRow = () => {
  setFormData((prev) => ({
    ...prev,
    sizes: [...prev.sizes, ''],
    broken_pcs: [...prev.broken_pcs, ''],
  }));
};

const removeRow = (index) => {
  setFormData((prev) => ({
    ...prev,
    sizes: prev.sizes.filter((_, i) => i !== index),
    broken_pcs: prev.broken_pcs.filter((_, i) => i !== index),
  }));
};
  const validateForm = () => {
    const required = ['mould_no', 'operator_name', 'sizes', 'broken_pcs', 'time'];
    const newErrors = {};
    required.forEach(field => {
      if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
       const payload = {
      ...formData,
      size: formData.sizes,
      broken_pcs: formData.broken_pcs,
    };

      const result = await dispatch(addCutting(payload)).unwrap();
      toast.success(result.message || 'Cutting entry created successfully');
      dispatch(GetCutting(id));
      setFormData({
        user_id:logindata?.admin?.id,
        rising_id:'',
        mould_no: '',
        operator_name: '',
        sizes: [''],
        broken_pcs: [''],
        time: '',
        remark: '',
        datetime:'',

      });
      
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to create cutting entry');
    }
  };
  const sizeOptions = ["600x200x225", "600x200x200", "600x200x150", "600x200x100", "600x200x75"]
  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Create New Cutting Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
       {/* Operator Name */}
<div className="col-span-6">
  <Label htmlFor="operator_name" value="Operator Name" />
  <span className="text-red-700 ps-1">*</span>
  <TextInput
    id="operator_name"
    type="text"
    value={formData.operator_name}
    placeholder="Enter operator name"
    onChange={(e) => handleChange("operator_name", e.target.value)}
    color={errors.operator_name ? "failure" : "gray"}
  />
  {errors.operator_name && (
    <p className="text-red-500 text-xs">{errors.operator_name}</p>
  )}
</div>
   <div className="col-span-6">
            <Label htmlFor="time" value="Time" />
                <span className="text-red-700 ps-1">*</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={formData.time ? dayjs(formData.time, 'HH:mm') : null}
                onChange={(value) => {
                  const formatted = value ? dayjs(value).format('HH:mm') : '';
                  handleChange('time', formatted);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    // error: !!errors.time,
                    // helperText: errors.time,
                    sx: {
                      '& .MuiInputBase-root': {
                        fontSize: '14px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '6px',
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
                        padding: '4px 10px',
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '13px',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
            {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
          </div>
{/* Dynamic size + broken_pcs rows */}
{formData.sizes.map((sizeValue, index) => (
  <div key={index} className="col-span-12 grid grid-cols-12 gap-3 items-end">
    <div className="col-span-5">
      <Label value={`Size ${index + 1}`} />
      <select
        value={sizeValue}
        onChange={(e) => handleMultiChange(index, 'sizes', e.target.value)}
        className="form-rounded-md w-full border px-3 py-2 border-gray-300 rounded-md"
      >
        <option value="">Select Size</option>
        {sizeOptions.map((s) => (
          <option key={s} value={s}>{s.replace(/x/g, " × ")}</option>
        ))}
      </select>
    </div>

    <div className="col-span-5">
      <Label value={`Broken Pcs ${index + 1}`} />
      <TextInput
        type="number"
        value={formData.broken_pcs[index]}
        className='form-rounded-md'
        placeholder='Enter Broken Pcs  '
        onChange={(e) => handleMultiChange(index, 'broken_pcs', e.target.value)}
      />
    </div>

    <div className="col-span-2 flex gap-1">
      {index === 0 ? (
        <Button type="button" color="success" onClick={addRow}>+</Button>
      ) : (
        <Button type="button" color="failure" onClick={() => removeRow(index)}>-</Button>
      )}
    </div>
  </div>
))}

           <div className="col-span-6">
            <Label htmlFor="Date" value="Date & Time" />
                <span className="text-red-700 ps-1">*</span>
              <input
                type="datetime-local"
                id="datetime"
                value={formData.datetime}
                onChange={(e) => handleChange("datetime", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              </div>
       

          {/* Remark Textarea */}
          <div className="col-span-12">
            <Label htmlFor="remark" value="Remark" />
            <textarea
              id="remark"
              value={formData.remark}
              placeholder="Any notes or comments"
              onChange={(e) => handleChange('remark', e.target.value)}
              className={`w-full border rounded-md p-2 ${errors.remark ? 'border-red-500' : 'border-gray-300'}`}
              rows={2}
            />
            {errors.remark && <p className="text-red-500 text-xs">{errors.remark}</p>}
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>Cancel</Button>
        <Button type="submit" color='primary' onClick={handleSubmit}>Submit</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddCuttingModal;

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addCutting, GetCutting } from 'src/features/Cutting/CuttingSlice';


const AddCuttingModal = ({ show, setShowmodal, batchingData,logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    user_id:logindata?.admin?.id,
    mould_no: batchingData?.mould_no || '',
    operator_name: '',
    size: '',
    broken_pcs: '',
    time: '',
    remark: '',
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, mould_no: batchingData?.mould_no || '' }));
  }, [batchingData]);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['mould_no', 'operator_name', 'size', 'broken_pcs', 'time'];
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
      const result = await dispatch(addCutting(formData)).unwrap();
      toast.success(result.message || 'Cutting entry created successfully');
      dispatch(GetCutting());
      setFormData({
       user_id:logindata?.admin?.id,
        mould_no: '',
        operator_name: '',
        size: '',
        broken_pcs: '',
        time: '',
        remark: '',
      });
      
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to create cutting entry');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Create New Cutting Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {[
           
            { id: 'operator_name', label: 'Operator Name', type: 'text', placeholder: 'Enter operator name' },
            { id: 'size', label: ' Cutting size', type: 'text', placeholder: 'Enter size' },
            { id: 'broken_pcs', label: 'No of Broken Pcs', type: 'number', placeholder: 'Enter broken count' },
          ].map(({ id, label, type, placeholder }) => (
            <div className="col-span-6" key={id}>


              <Label htmlFor={id} value={label} />
                  <span className="text-red-700 ps-1">{id === 'remark' ? "":"*"}</span>
              {  id === "size" ?
                <select name={id} id={id} 
                               
                value={formData[id]}
                  onChange={(e) => handleChange(id, e.target.value)}
                className={`form-rounded-md w-full border px-3 py-2  border-gray-300 rounded-md`}>
  <option value="">Select size</option>
  <option value="600*200*75">600*200*75</option>
  <option value="600*200*100">600*200*100</option>
  <option value="600*200*150">600*200*150</option>
  <option value="600*200*200">600*200*200</option>
  <option value="600*200*225">600*200*225</option>
  <option value="600*200*250">600*200*250</option>
</select>  :   
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                placeholder={placeholder}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                className="form-rounded-md"
              />}
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}

          {/* Time Picker */}
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

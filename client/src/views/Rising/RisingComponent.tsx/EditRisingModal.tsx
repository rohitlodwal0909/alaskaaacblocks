import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { updateRising, GetRising } from 'src/features/Rising/RisingSlice'; // Make sure this path is correct
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
const EditRisingModal = ({ show, setShowmodal, risingData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',              // Needed for editing
    mould_no: '',
    hardness: '',
    temperature: '',
    rising_time: '',
    operator_name: '',
    remark: '',
  });

  const [errors, setErrors] = useState<any>({});

 useEffect(() => {
  if (risingData) {
    const info = risingData.rising_info?.[0] || {};
    setFormData({
      mould_no: risingData.mould_no || '',
      hardness: info.hardness || '',
      temperature: info.temperature || '',
      rising_time: info.rising_time || '',
      operator_name: info.operator_name || '',
      remark: info.remark || '',
      id: info.id || '', // if needed for update API
    });
  }
}, [risingData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['mould_no', 'hardness', 'temperature', 'rising_time', 'operator_name'];
    const newErrors: any = {};
    required.forEach(field => {
      if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateRising(formData)).unwrap();
      toast.success(result.message || 'Rising entry updated successfully');
      dispatch(GetRising());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update rising entry');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Edit Rising Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {[
            { id: 'hardness', label: 'Hardness', type: 'number', placeholder: 'Enter hardness' },
            { id: 'temperature', label: 'Temperature (°C)', type: 'number', placeholder: 'Enter temperature' },
            { id: 'rising_time', label: 'Rising Time', type: 'time', placeholder: 'Enter rising time (e.g. 08:15)' },
            { id: 'operator_name', label: 'Operator Name', type: 'text', placeholder: 'Enter operator name' },
            { id: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Any notes or comments' }
          ].map(({ id, label, type, placeholder }) => {
                const isTextarea = type === 'textarea';
            const colSpan = id === 'remark' ? 'col-span-12' : 'col-span-6';
          
              return (
              <div className={colSpan} key={id}>
                <Label htmlFor={id} value={label} />
          
                {id === 'rising_time' ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      value={formData[id] ? dayjs(formData[id], 'HH:mm') : null}
                      onChange={(value) => {
                        const formatted = value ? dayjs(value).format('HH:mm') : '';
                        handleChange(id, formatted);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors[id],
                          helperText: errors[id],
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
                ) : isTextarea ? (
                  <textarea
                    id={id}
                    value={formData[id]}
                    onChange={(e) => handleChange(id, e.target.value)}
                    placeholder={placeholder}
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
                    className="form-rounded-md"
                  />
                )}
          
          
                {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
              </div>
            )})}
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>Cancel</Button>
        <Button type="submit" color='primary'  onClick={handleSubmit}>Update</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditRisingModal;

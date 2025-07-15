import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { updateCutting, GetCutting } from 'src/features/Cutting/CuttingSlice'; // ✅ Adjust path as needed
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const EditCuttingModal = ({ show, setShowmodal, cuttingData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    operator_name: '',
    size: '',
    broken_pcs: '',
    time: '',
    remark: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (cuttingData) {
      const info = cuttingData?.cutting_info || {};
      setFormData({
        id: info.id || '',
        operator_name: info?.operator_name || '',
        size: info?.size || '',
        broken_pcs: info?.broken_pcs || '',
        time: info?.time || '',
        remark: info?.remark || '',
      });
    }
  }, [cuttingData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = [ 'operator_name', 'size', 'broken_pcs', 'time'];
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
      const res = await dispatch(updateCutting(formData)).unwrap();
      toast.success(res.message || 'Cutting entry updated successfully');
      dispatch(GetCutting());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update cutting entry');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Edit Cutting Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {[
            
            { id: 'operator_name', label: 'Operator Name', type: 'text' },
            { id: 'size', label: 'Size', type: 'text' },
            { id: 'broken_pcs', label: 'No of Broken Pcs', type: 'number' },
          ].map(({ id, label, type }) => (
            <div className="col-span-6" key={id}>
              <Label htmlFor={id} value={label} />
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                className="form-rounded-md"
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}

          {/* Time Picker */}
          <div className="col-span-6">
            <Label htmlFor="time" value="Time" />
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
                    error: !!errors.time,
                    helperText: errors.time,
                    sx: {
                      '& .MuiInputBase-root': {
                        fontSize: '14px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '6px',
                      }, '& .css-1hgcujo-MuiPickersInputBase-root-MuiPickersOutlinedInput-root': {
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
              onChange={(e) => handleChange('remark', e.target.value)}
              placeholder="Any notes or comments"
              className={`w-full border rounded-md p-2 ${errors.remark ? 'border-red-500' : 'border-gray-300'}`}
              rows={2}
            />
            {errors.remark && <p className="text-red-500 text-xs">{errors.remark}</p>}
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>Cancel</Button>
        <Button type="submit"color='primary'  onClick={handleSubmit}>Update</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditCuttingModal;

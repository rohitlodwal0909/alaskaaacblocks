import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addRising, GetRising } from 'src/features/Rising/RisingSlice';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useParams } from 'react-router';

const AddRisingModal = ({ show, setShowmodal, batchingData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    user_id: logindata?.admin?.id,
    mould_no: batchingData?.mould_no,
    batching_id: batchingData?.id,
    hardness: '',
    temperature: '',
    rising_time: '',
    operator_name: '',
    remark: '',
    datetime: '',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      mould_no: batchingData?.mould_no,
      batching_id: batchingData?.id,
    }));
  }, [batchingData]);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['mould_no', 'hardness', 'temperature', 'rising_time', 'operator_name', 'datetime'];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addRising(formData)).unwrap();
      toast.success(result.message || 'Rising entry created successfully');
      dispatch(GetRising(id));
      setFormData({
        user_id: logindata?.admin?.id,
        batching_id: batchingData?.id,
        mould_no: '',
        hardness: '',
        temperature: '',
        rising_time: '',
        operator_name: '',
        remark: '',
        datetime: '',
      });
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to create rising entry');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Create New Rising Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {[
            { id: 'hardness', label: 'Hardness', type: 'number', placeholder: 'Enter hardness' },
            { id: 'temperature', label: 'Temperature (°C)', type: 'number', placeholder: 'Enter temperature' },
            { id: 'rising_time', label: 'Cutting time', type: 'time', placeholder: 'Enter Cutting time (e.g. 08:15)' },
            { id: 'operator_name', label: 'Operator Name', type: 'text', placeholder: 'Enter operator name' },
            { id: 'datetime', label: 'Date & Time', type: 'datetime', placeholder: 'Select Date & Time' },
            { id: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Any notes or comments' },
          ].map(({ id, label, type, placeholder }) => {
            const isTextarea = type === 'textarea';
            const colSpan = id === 'remark' ? 'col-span-12' : 'col-span-6';

            return (
              <div className={colSpan} key={id}>
                <Label htmlFor={id} value={label} />
                <span className="text-red-700 ps-1">{id === 'remark' ? '' : '*'}</span>

                {/* Rising Time Picker */}
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
                          sx: {
                            '& .MuiInputBase-root': {
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
                ) : id === 'datetime' ? (
                  // 👇 DateTime Picker
                 <input
                type="datetime-local"
                id="datetime"
                value={formData.datetime}
                onChange={(e) => handleChange("datetime", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
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
            );
          })}
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddRisingModal;

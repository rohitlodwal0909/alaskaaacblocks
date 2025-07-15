import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addAutoclave, GetAutoclave } from 'src/features/Autoclave/AutoclaveSlice'; // Update path accordingly
import { Icon } from "@iconify/react";
const AddAutoClaveModal = ({ show, setShowmodal, batchingData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    mould_no: batchingData?.mould_no || '',
    operator_name: '',
    on_time: '',
    door_steam_time: '',
    vacuum_steam_time: '',
    steam_pressure: [''],
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

  const handleSteamChange = (index, value) => {
    const updated = [...formData.steam_pressure];
    updated[index] = value;
    setFormData(prev => ({ ...prev, steam_pressure: updated }));
  };

  const addSteamPressure = () => {
    setFormData(prev => ({ ...prev, steam_pressure: [...prev.steam_pressure, ''] }));
  };

  const removeSteamPressure = (index) => {
    const updated = formData.steam_pressure.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, steam_pressure: updated }));
  };

  const validateForm = () => {
    const required = ['mould_no', 'operator_name', 'on_time', 'door_steam_time', 'vacuum_steam_time'];
    const newErrors: any = {};
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
      const result = await dispatch(addAutoclave(formData)).unwrap();
      toast.success(result.message || 'Autoclave entry created successfully');
      dispatch(GetAutoclave());
      setFormData({
        mould_no: '',
        operator_name: '',
        on_time: '',
        door_steam_time: '',
        vacuum_steam_time: '',
        steam_pressure: [''],
        remark: '',
      });
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to create autoclave entry');
    }
  };

  const renderTimePicker = (id, label) => (
    <div className="col-span-6">
      <Label htmlFor={id} value={label} />
          <span className="text-red-700 ps-1">{id === 'remark' ? "":"*"}</span>
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
              // error: !!errors[id],
              // helperText: errors[id],
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
              },
            },
          }}
        />
      </LocalizationProvider>
      {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
    </div>
  );

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create New Autoclave Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">

          {/* Operator Name */}
          <div className="col-span-6">
            <Label value="Operator Name" />
                <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="operator_name"
              value={formData.operator_name}
              onChange={(e) => handleChange('operator_name', e.target.value)}
              placeholder="Enter operator name"
              className='form-rounded-md'
              color={errors.operator_name ? 'failure' : 'gray'}
            />
            {errors.operator_name && <p className="text-red-500 text-xs">{errors.operator_name}</p>}
          </div>

          {/* Time Fields */}
          {renderTimePicker('on_time', 'On Time')}
          {renderTimePicker('door_steam_time', 'Door Steam Time (15 min)')}
          {renderTimePicker('vacuum_steam_time', 'Vacuum Steam Time (15-20 min)')}

          {/* Dynamic Steam Pressure */}
          <div className="col-span-12">
            <Label value="Steam Pressure (kg/cm²)" />

            {formData.steam_pressure.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <TextInput
                  value={val}
                  
                  placeholder={`Steam Pressure #${idx + 1}`}
                  onChange={(e) => handleSteamChange(idx, e.target.value)}
                  className="form-rounded-md w-full"
                />
                {idx > 0 ? (
                  <Button color="failure" size="xs" onClick={() => removeSteamPressure(idx)}>  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} /></Button>
                ):(

            <Button size="xs" onClick={addSteamPressure}> <Icon icon="ic:baseline-plus" height={18} /></Button>
                )}
              </div>
            ))}
          </div>

          {/* Remark */}
          <div className="col-span-12">
            <Label value="Remark" />
            <textarea
              value={formData.remark}
              onChange={(e) => handleChange('remark', e.target.value)}
              placeholder="Any notes or comments"
              rows={2}
              className="w-full border rounded-md p-2 border-gray-300"
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>Cancel</Button>
        <Button onClick={handleSubmit} color='primary'>Submit</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddAutoClaveModal;

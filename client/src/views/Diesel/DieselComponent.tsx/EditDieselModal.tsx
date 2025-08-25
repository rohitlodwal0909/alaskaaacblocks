import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Textarea,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { updateDiesel, GetDiesel } from 'src/features/Diesel/DieselSlice';
// import { Icon } from '@iconify/react';
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getDateTimeFromTimeString } from 'src/utils/getDateTimeFromTimeString';
const EditDieselModal = ({ show, setShowmodal, Dieseldata,logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

 
  const [formData, setFormData] = useState({
    id:"",
    user_id: logindata?.admin?.id || "",
    fuel_consume: "",
    meter_reading: "",
    time:"",
    fuel_feel:"",
    description:""
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const required = [ "fuel_consume", "meter_reading" ];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace("_", " ")} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
   
    if (Dieseldata) {
      setFormData({
        id: Dieseldata?.id || '',
        fuel_consume: Dieseldata?.fuel_consume || '',
        meter_reading: Dieseldata?.meter_reading || '',
         user_id:logindata?.admin?.id ,
             time:Dieseldata?.time || '',
         fuel_feel:Dieseldata?.fuel_feel || '',
         description:Dieseldata?.description || '',
      });
    }
  }, [Dieseldata]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateDiesel(formData)).unwrap();
      toast.success(result.message || 'Diesel entry updated successfully');
      dispatch(GetDiesel());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update Diesel entry');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Edit Diesel Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
       <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Equipment Select */}
          <div className="col-span-6">
            <Label htmlFor="equipment" value=" Fuel Consume" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="fuel_consume"
              value={formData.fuel_consume}
              onChange={(e) => handleChange("fuel_consume", e.target.value)}
              color={errors.fuel_consume ? "failure" : "gray"}
              className="rounded-md w-full border border-gray-300"
            >
              <option value="">-- Select --</option>
              <option value="JCB">JCB</option>
              <option value="Forklift">Forklift</option>
              <option value="Generator">Generator</option>
            </select>
            {errors.fuel_consume && <p className="text-red-500 text-xs">{errors.fuel_consume}</p>}
          </div>

          {/* Fuel Consumption */}
         
          {/* Meter Reading */}
          <div className="col-span-6">
            <Label htmlFor="meter_reading" value="Meter Reading " />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="meter_reading"
              placeholder="Enter meter reading"
              value={formData.meter_reading}
              onChange={(e) => handleChange("meter_reading", e.target.value)}
              color={errors.meter_reading ? "failure" : "gray"}
                    className="form-rounded-md"
            />
            {errors.meter_reading && <p className="text-red-500 text-xs">{errors.meter_reading}</p>}
          </div>

        <div className="col-span-6">
                    <Label htmlFor="fuel_feel" value="Fuel (Ltr)" />
                    <span className="text-red-700 ps-1">*</span>
                    <TextInput
                      id="fuel_feel"
                      placeholder="Enter Fuel"
                      value={formData.fuel_feel}
                      onChange={(e) => handleChange("fuel_feel", e.target.value)}
                      color={errors.fuel_feel ? "failure" : "gray"}
                            className="form-rounded-md"
                    />
                    {errors.fuel_feel && <p className="text-red-500 text-xs">{errors.fuel_feel}</p>}
                  </div>
                  {/* Date */}
                  <div className="col-span-6">
                    <Label htmlFor="time" value="time" />
                    <span className="text-red-700 ps-1">*</span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        value={formData.time ? getDateTimeFromTimeString(formData.time) : null}
                        onChange={(val) => handleChange("time", val ? dayjs(val).format("HH:mm") : "")}
                         slotProps={{
                          textField: {
                            fullWidth: true,
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
                        className="form-roounded-md w-full"
                      />
                    </LocalizationProvider>
                    {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
                  </div>
                   <div className="col-span-12">
                                        <Label value="Description" />
                                        {/* <span className="text-red-700 ps-1">*</span> */}
                                        <Textarea
                                          value={formData.description}
                                          onChange={(e) => handleChange("description", e.target.value)}
                                          className="border rounded-md"
                                          placeholder="Enter description"
                                          color={errors.description ? "failure" : "gray"}
                                        />
                                        {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                                      </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Update</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditDieselModal;

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { updateDiesel, GetDiesel } from 'src/features/Diesel/DieselSlice';
// import { Icon } from '@iconify/react';

const EditDieselModal = ({ show, setShowmodal, Dieseldata,logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

 
  const [formData, setFormData] = useState({
    id:"",
    user_id: logindata?.admin?.id || "",
    fuel_consume: "",
    meter_reading: "",
   
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const required = [ "fuel_consume", "meter_reading"];
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
       user_id:logindata?.admin?.id 
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

          {/* Date */}
          {/* <div className="col-span-6">
            <Label htmlFor="date" value="Date" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              color={errors.date ? "failure" : "gray"}
              className="form-rounded-md"
            />
            {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
          </div> */}
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

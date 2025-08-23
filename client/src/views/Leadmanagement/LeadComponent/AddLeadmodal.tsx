import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { Label, TextInput } from "flowbite-react";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import data from '../../../utils/Statedata.json';
import { CreateLeads, GetLeads } from 'src/features/leadmanagment/LeadmanagmentSlice';
import Select from 'react-select';
import { AppDispatch } from 'src/store';
import { Icon } from "@iconify/react";
const Addusermodal = ({ placeModal, modalPlacement, setPlaceModal ,logindata}) => {
   const dispatch = useDispatch<AppDispatch>();
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [formData, setFormData] = useState<any>({
    name: '', email: '', phone: '', source: '',
    user_id: logindata?.admin?.id,
    state: '', district: '', tehsil: '',
    address: '', delivery_address: '',
    materials: [{ material: '', quantity: '', unit: '', size: '', give_range: '' }]
  });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleStateChange = ({ value }) => {
    handleChange('state', value);
    const stateObj = data.states.find(s => s.state === value);
    setDistricts(stateObj?.districts || []);
    handleChange('district', '');
    handleChange('tehsil', '');
    setTehsils([]);
  };

  const handleDistrictChange = ({ value }) => {
    handleChange('district', value);
    const districtObj = districts.find(d => d.name === value);
    setTehsils(districtObj?.tehsils || []);
    handleChange('tehsil', '');
  };

  const updateMaterialRow = (index, field, value) => {
    const updated = [...formData.materials];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, materials: updated }));
  };

  const addMaterialRow = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { material: '', quantity: '', unit: '', size: '', give_range: '' }]
    }));
  };

  const removeMaterialRow = (index) => {
    const updated = formData.materials.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, materials: updated }));
  };

  const validateForm = () => {
    const newErrors = {};
    ['name', 'phone', 'source', 'state', 'district', 'tehsil', 'address', 'delivery_address'].forEach(field => {
      if (!formData[field]) newErrors[field] = `${field} is required`;
    });
    formData.materials.forEach((row, i) => {
      if (!row.material) newErrors[`material_${i}`] = 'Material required';
      if (!row.quantity) newErrors[`quantity_${i}`] = 'Quantity required';
      if (!row.unit) newErrors[`unit_${i}`] = 'Unit required';
      if (!row.give_range) newErrors[`give_range_${i}`] = 'Give range required';
      if (row.material !== 'Adhesive Bag' && !row.size) newErrors[`size_${i}`] = 'Size required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const { materials, ...rest } = formData;
      const payload = {
        ...rest,
        material: materials.map(m => m.material).join(','),
        quantity: materials.map(m => m.quantity).join(','),
        unit: materials.map(m => m.unit).join(','),
        size: materials.map(m => m.size || '').join(','),
        give_range: materials.map(m => m.give_range).join(',')
      };
      const result = await dispatch(CreateLeads(payload)).unwrap();
      toast.success(result.message || 'Lead has been successfully created.');
      dispatch(GetLeads());
      setFormData({
        name: '', email: '', phone: '', source: '',
        state: '', district: '', tehsil: '',
        address: '', delivery_address: '',
        materials: [{ material: '', quantity: '', unit: '', size: '', give_range: '' }]
      });
      setPlaceModal(false);
    } catch (err) {
      toast.error(err);
    }
  };

  const statesOptions = data.states.map(s => ({ label: s.state, value: s.state }));
  const districtsOptions = districts.map(d => ({ label: d.name, value: d.name }));
  const tehsilOptions = tehsils.map(t => ({ label: t, value: t }));

  return (
    <Modal show={placeModal} position={modalPlacement} onClose={() => setPlaceModal(false)} size="4xl">
      <ModalHeader className="pb-0">Create New Lead</ModalHeader>
      <ModalBody className="overflow-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">

          {/* Basic Info */}
          {[{ id: 'name', label: 'Name' }, { id: 'email', label: 'Email' }, { id: 'phone', label: 'Phone' }].map(({ id, label }) => (
            <div key={id} className="col-span-6">
              <Label htmlFor={id} value={label} />
              <span className="text-red-700 ps-1">{ id === "email" ? "": "*"}</span>
              <TextInput
                id={id}
                value={formData[id]}
                style={{ borderRadius: '8px' }}
                onChange={(e) => handleChange(id, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                color={errors[id] ? 'failure' : 'gray'}
                helperText={errors[id] && <span className="text-red-500 text-xs">{errors[id]}</span>}
              />
            </div>
          ))}

          {/* Source */}
          <div className="col-span-6">
            <Label htmlFor="source" value="Source" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="source"
              value={formData.source}
              onChange={(e) => handleChange("source", e.target.value)}
              className={`w-full p-2 border rounded-sm ${errors.source ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Source</option>
              {["India mart", "Justdial", "Instagram", "Youtube", "FaceBook", "google", "Refrence","Other"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.source && <span className="text-red-500 text-xs">{errors.source}</span>}
          </div>

          {/* State, District, Tehsil */}
          {[{ id: 'state', options: statesOptions, handler: handleStateChange },
            { id: 'district', options: districtsOptions, handler: handleDistrictChange },
            { id: 'tehsil', options: tehsilOptions, handler: val => handleChange('tehsil', val?.value) }]
            .map(({ id, options, handler }) => (
              <div className="col-span-4" key={id}>
                <Label value={id.charAt(0).toUpperCase() + id.slice(1)} />
                <Select options={options} value={options.find(opt => opt.value === formData[id]) || null} onChange={handler} />
                {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
              </div>
            ))}

          {/* Party Address */}
          <div className="col-span-6">
            <Label htmlFor="address" value="Party Address" />
             <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="address"
              style={{ borderRadius: '8px' }}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter full address"
              color={errors.address ? 'failure' : 'gray'}
            />
            {errors.address && <span className="text-red-500 text-xs">{errors.address}</span>}
          </div>
          {/* Delivery Address */}
          <div className="col-span-6">
            <Label htmlFor="delivery_address" value="Delivery Address" />
             <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="delivery_address"
              value={formData.delivery_address}
              style={{ borderRadius: '8px' }}
              onChange={(e) => handleChange('delivery_address', e.target.value)}
              placeholder="Enter delivery address"
              color={errors.delivery_address ? 'failure' : 'gray'}
            />
            {errors.delivery_address && <span className="text-red-500 text-xs">{errors.delivery_address}</span>}
          </div>

          {/* Material Rows */}
          {formData.materials.map((item, index) => {
    
const isAdhesive = item.material === 'Adhesive Bag';
  const materialOptions = ["AAC block", "Adhesive Bag"]
  const sizeOptions = ["600x200x225", "600x200x200", "600x200x150", "600x200x100", "600x200x75"]
    
  return (
    <div className="col-span-12 grid grid-cols-12 gap-3 items-end" key={index}>
      <div className="col-span-3">
        <Label value="Material" />
         <span className="text-red-700 ps-1">*</span>
        <select
          value={item.material}
          onChange={(e) => updateMaterialRow(index, "material", e.target.value)}
          className="w-full p-2 border rounded-sm border-gray-300 text-sm"
        >
          <option value="">Select material</option>
          {materialOptions.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        {errors[`material_${index}`] && (
  <p className="text-red-500 text-xs mt-1">{errors[`material_${index}`]}</p>
)}
      </div>

      <div className="col-span-3">
        <Label value="Quantity" />
         <span className="text-red-700 ps-1">*</span>
        <div className="flex ">
          <input
            type="text"
            placeholder="Enter quantity"
            value={item.quantity}
            onChange={(e) => updateMaterialRow(index, "quantity", e.target.value)}
            className="w-full border border-gray-300 rounded-l-sm px-3 py-2 text-sm"
          />
          <select
            value={item.unit}
            onChange={(e) => updateMaterialRow(index, "unit", e.target.value)}
            className="rounded-r-sm border border-l-0 border-gray-300 text-sm"
          >
            <option value="">unit</option>
       {isAdhesive ? <option value="bag">bag</option> : ["pcs", "cubic","bag"].map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        {errors[`quantity_${index}`] && (
  <span className="text-red-500 text-xs mt-1">{errors[`quantity_${index}`]},</span>
)}
{errors[`unit_${index}`] && (
  <span className="text-red-500 text-xs mt-1">{errors[`unit_${index}`]}</span>
)}
      </div>
   {!isAdhesive && (
      <div className="col-span-3">
        <Label value="Size" />
         <span className="text-red-700 ps-1">*</span>
        <select
          value={item.size}
          onChange={(e) => updateMaterialRow(index, "size", e.target.value)}
          className="w-full p-2 border rounded-sm border-gray-300 text-sm" 
        >
          <option value="">Select Size</option>
          {sizeOptions.map((s) => (
            <option key={s} value={s}>{s.replace(/x/g, " × ")}</option>
          ))}
        </select>
        {errors[`size_${index}`] && (
  <p className="text-red-500 text-xs mt-1">{errors[`size_${index}`]}</p>
)}
      </div>
   )}
       <div className="col-span-2 ">
                  <Label value="Give Rate" />
             <span className="text-red-700 ps-1">*</span>

                  <TextInput value={item.give_range} onChange={e => updateMaterialRow(index, 'give_range', e.target.value)} placeholder="Give rate" color='gray'       style={{ borderRadius: '8px' }}   />
                  {errors[`give_range_${index}`] && <p className="text-red-500 text-xs">{errors[`give_range_${index}`]}</p>}
                </div>
      <div className="col-span-1">
        {index === 0 ? (
          <Button onClick={addMaterialRow} color='primary'>
            <Icon icon="ic:baseline-plus" height={18} />
          </Button>
        ) : (
          <Button color='error' onClick={() => removeMaterialRow(index)}> <Icon icon="solar:trash-bin-minimalistic-outline" height={18} /></Button>
        )}
      </div>
    </div>
  );
})}

          {/* Submit Buttons */}
          <div className="col-span-12 flex justify-end gap-4">
            <Button type="reset" color="error" onClick={() => setPlaceModal(false)}>Cancel</Button>
            <Button type="submit" color="primary">Submit</Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

export default Addusermodal;

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
const Addusermodal = ({ placeModal, modalPlacement, setPlaceModal }) => {
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    source: '',
    state: '',
    district: '',
    tehsil: '',
    delivery_address: '',
    give_range: '',
    address: '',
    materials: [{ material: '', quantity: '', unit: '', size: '' }]
  });
  console.log(formData)
  const [errors, setErrors] = useState<any>({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleStateChange = (selectedOption) => {
    const stateName = selectedOption?.value || "";
    handleChange('state', stateName);
    const selectedState = data.states.find(s => s.state === stateName);
    setDistricts(selectedState?.districts || []);
    handleChange('district', '');
    handleChange('tehsil', '');
    setTehsils([]);
  };

  const handleDistrictChange = (selectedOption) => {
    const districtName = selectedOption?.value || "";
    handleChange('district', districtName);
    const selectedDistrict = districts.find(d => d.name === districtName);
    setTehsils(selectedDistrict?.tehsils || []);
    handleChange('tehsil', '');
  };

  const addMaterialRow = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { material: '', quantity: '', unit: '', size: '' }]
    }));
  };

  const removeMaterialRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const updateMaterialRow = (index: number, field: string, value: string) => {
    const updated = [...formData.materials];
    updated[index][field] = value;
    setFormData(prev => ({
      ...prev,
      materials: updated
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phone) newErrors.phone = 'Phone No. is required';
    if (!formData.source) newErrors.source = 'Source is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.tehsil) newErrors.tehsil = 'Tehsil is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.give_range) newErrors.give_range = 'Give rate is required';
    if (!formData.delivery_address) newErrors.delivery_address = 'Give rate is required';

    formData.materials.forEach((row, index) => {
      if (!row.material) newErrors[`material_${index}`] = 'Material is required';
      if (!row.quantity) newErrors[`quantity_${index}`] = 'Quantity is required';
      if (!row.unit) newErrors[`unit_${index}`] = 'Unit is required';
      if (!row.size) newErrors[`size_${index}`] = 'Size is required';
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
        size: materials.map(m => m.size).join(',')
      };

      const result = await dispatch(CreateLeads(payload)).unwrap();
      toast.success(result?.message || "Lead Added Successfully");
      dispatch(GetLeads());

      setFormData({
        name: '',
        email: '',
        phone: '',
        source: '',
        state: '',
        district: '',
        tehsil: '',
        delivery_address: '',
        give_range: '',
        address: '',
        materials: [{ material: '', quantity: '', unit: '', size: '' }]
      });

      setPlaceModal(false);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Modal show={placeModal} position={modalPlacement} onClose={() => setPlaceModal(false)} size="3xl">
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
          {[
            { id: "state", label: "State", data: data.states.map(s => s.state), handler: handleStateChange },
            { id: "district", label: "District", data: districts.map(d => d.name), handler: handleDistrictChange },
            { id: "tehsil", label: "Tehsil", data: tehsils, handler: (e) => handleChange('tehsil', e?.value) }
          ].map(({ id, label, data, handler }) => {
            const options = data.map(val => ({ value: val, label: val }));
            return (
              <div className="col-span-4" key={id}>
                <Label htmlFor={id} value={label} />
                <span className="text-red-700 ps-1">*</span>
                <Select
                  id={id}
                  isSearchable
                  options={options}
                  onChange={handler}
                  value={options.find(opt => opt.value === formData[id]) || null}
                  isDisabled={!options.length}
                />
                {errors[id] && <span className="text-red-500 text-xs">{errors[id]}</span>}
              </div>
            );
          })}

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

          {/* Give Range */}
          <div className="col-span-6">
            <Label htmlFor="give_range" value="Give Rate" />
             <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="give_range"
              style={{ borderRadius: '8px' }}
              value={formData.give_range}
              onChange={(e) => handleChange('give_range', e.target.value)}
              placeholder="Enter Rate"
              color={errors.give_range ? 'failure' : 'gray'}
            />
            {errors.give_range && <span className="text-red-500 text-xs">{errors.give_range}</span>}
          </div>

          {/* Delivery Address */}
          <div className="col-span-12">
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
      const selectedMaterials = formData.materials.map(m => m.material).filter((_, i) => i !== index);
     const selectedSizes = formData.materials.map(m => m.size).filter((_, i) => i !== index);

  const materialOptions = ["AAC block", "Adhesive Bag"].filter(m => !selectedMaterials.includes(m));
  const sizeOptions = ["600x200x225", "600x200x200", "600x200x150", "600x200x100", "600x200x75"]
    .filter(s => !selectedSizes.includes(s));
  return (
    <div className="col-span-12 grid grid-cols-12 gap-3 items-end" key={index}>
      <div className="col-span-4">
        <Label value="Material" />
         <span className="text-red-700 ps-1">*</span>
        <select
          value={item.material}
          onChange={(e) => updateMaterialRow(index, "material", e.target.value)}
          className="w-full p-2 border rounded-sm border-gray-300"
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

      <div className="col-span-4">
        <Label value="Quantity" />
         <span className="text-red-700 ps-1">*</span>
        <div className="flex ">
          <input
            type="text"
            placeholder="Enter quantity"
            value={item.quantity}
            onChange={(e) => updateMaterialRow(index, "quantity", e.target.value)}
            className="w-full border border-gray-300 rounded-l-sm px-3 py-2"
          />
          <select
            value={item.unit}
            onChange={(e) => updateMaterialRow(index, "unit", e.target.value)}
            className="rounded-r-sm border border-l-0 border-gray-300 "
          >
            <option value="">Unit</option>
            <option value="pcs">pcs</option>
            <option value="cubic">cubic</option>
          </select>
        </div>
        {errors[`quantity_${index}`] && (
  <span className="text-red-500 text-xs mt-1">{errors[`quantity_${index}`]},</span>
)}
{errors[`unit_${index}`] && (
  <span className="text-red-500 text-xs mt-1">{errors[`unit_${index}`]}</span>
)}
      </div>

      <div className="col-span-3">
        <Label value="Size" />
         <span className="text-red-700 ps-1">*</span>
        <select
          value={item.size}
          onChange={(e) => updateMaterialRow(index, "size", e.target.value)}
          className="w-full p-2 border rounded-sm border-gray-300" 
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

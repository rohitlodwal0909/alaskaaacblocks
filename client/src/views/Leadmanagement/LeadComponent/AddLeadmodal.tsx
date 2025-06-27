import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { Label, TextInput } from "flowbite-react";
import {  useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import data from '../../../utils/Statedata.json';
import { CreateLeads, GetLeads } from 'src/features/leadmanagment/LeadmanagmentSlice';
import Select from 'react-select';
import { AppDispatch } from 'src/store';
const Addusermodal = ({ placeModal, modalPlacement, setPlaceModal }) => {
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const dispatch = useDispatch<AppDispatch>();

 const [formData, setFormData] = useState<{
  name: any;
  email: any;
  phone: any;
  source: any;
  material: any;
  quantity: any;
  unit: any;
  size: any;
  state: any;
  district: any;
  tehsil: any;
  address: any;
}>({
  name: '',
  email: '',
  phone: '',
  source: '',
  material: '',
  quantity: '',
  unit: '',
  size: '',
  state: '',
  district: '',
  tehsil: '',
  address: ''
});

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

  // Reset district and tehsil
  handleChange('district', '');
  handleChange('tehsil', '');
  setTehsils([]);
};

const handleDistrictChange = (selectedOption) => {
  const districtName = selectedOption?.value || "";
  handleChange('district', districtName);

  const selectedDistrict = districts.find(d => d.name === districtName);
  setTehsils(selectedDistrict?.tehsils || []);

  // Reset tehsil
  handleChange('tehsil', '');
};

const validateForm = () => {
  const newErrors: { [key: string]: string } = {}; // ✅ define the type here

  if (!formData.name) newErrors.name = 'Name is required';
  if (!formData.phone) newErrors.phone = 'Phone No. is required';
  if (!formData.source) newErrors.source = 'Source is required';
  if (!formData.material) newErrors.material = 'Material is required';
  if (!formData.quantity) newErrors.quantity = 'Quantity is required';
  if (!formData.unit) newErrors.unit = 'Unit is required';
  if (!formData.size) newErrors.size = 'Size is required';
  if (!formData.state) newErrors.state = 'State is required';
  if (!formData.district) newErrors.district = 'District is required';
  if (!formData.tehsil) newErrors.tehsil = 'Tehsil is required';
  if (!formData.address) newErrors.address = 'Address is required';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const result = await dispatch(CreateLeads(formData)).unwrap();
      toast.success(result?.message || "Lead Added Successfully");
      dispatch(GetLeads());
      setFormData({
        name: '', email: '', phone: '', source: '', material: '', quantity: '', unit: '', size: '', state: '', district: '', tehsil: '', address: ''
      });
      setPlaceModal(false);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Modal show={placeModal} position={modalPlacement} onClose={() => setPlaceModal(false)} className="large">
      <ModalHeader className="pb-0">Create New Lead</ModalHeader>
      <ModalBody className="overflow-auto max-h-[100vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-3">
          {[
            { id: 'name', label: 'Name', required: true, type: 'text' },
            { id: 'email', label: 'Email', required: true, type: 'email' },
            { id: 'phone', label: 'Phone', required: true, type: 'number' }
          ].map(({ id, label, type, required }) => (
            <div key={id} className="col-span-6">
              <Label htmlFor={id} value={label} />
              {required && <span className="text-red-700 ps-1">*</span>}
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                 style={{borderRadius:'8px'}}
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
              {["India mart", "Gudgedial", "Instagram", "Youtube", "Other"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.source && <span className="text-red-500 text-xs">{errors.source}</span>}
          </div>

          {/* Material */}
          <div className="col-span-6">
            <Label htmlFor="material" value="Material" />
            <select
              id="material"
              value={formData.material}
              onChange={(e) => handleChange("material", e.target.value)}
              className={`w-full p-2 border rounded-sm ${errors.material ? "border-red-500" : "border-gray-300"}`}
             
            >
              <option value="">Select material</option>
              <option value="AAC block">AAC block</option>
              <option value="Adhesive Bag">Adhesive Bag</option>
            </select>
             {errors.material && <span className="text-red-500 text-xs">{errors.material}</span>}
          </div>

          {/* Quantity + Unit */}
          <div className="col-span-6">
            <Label htmlFor="quantity" value="Quantity" />
            <div className=" pb-1 flex  ">
              <input
                type="text"
                id="quantity"
                placeholder="Enter quantity"
                className="w-full rounded-sm border border-gray-300 px-3  py-2 text-sm"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
              />
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                className="rounded-r-md border border-l-0 border-gray-300 px-2 py-2 text-sm"
              >
                <option value="">Unit</option>
                <option value="pcs">pcs</option>
                <option value="cubic">cubic</option>
              </select>
            </div>
              {(errors.quantity || errors.unit) && (
    <span className="text-red-500 text-xs">
      {errors.quantity || errors.unit}
    </span>
  )}
          </div>


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
        // classNamePrefix="react-select"
      />
      {errors[id] && <span className="text-red-500 text-xs">{errors[id]}</span>}
    </div>
  );
})}


          {/* Size */}
          <div className="col-span-12">
            <Label htmlFor="size" value="Size" />
            <select
              id="size"
              value={formData.size}
              onChange={(e) => handleChange("size", e.target.value)}
                className={`w-full p-2 border rounded-sm ${errors.size ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Size</option>
              {["600x200x225", "600x200x200", "600x200x150", "600x200x100", "600x200x75"].map(size => (
                <option key={size} value={size}>{size.replace(/x/g, " × ")}</option>
              ))}
            </select>
             {errors.size && <span className="text-red-500 text-xs">{errors.size}</span>}
          </div>

          {/* Location: State, District, Tehsil */}
     
          {/* Address */}
          <div className="col-span-12">
            <Label htmlFor="address" value="Address" />
            <TextInput
              id="address"
              style={{borderRadius:'8px'}}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter full address"
              color={errors.address ? 'failure' : 'gray'}
            />
            {errors.address && <span className="text-red-500 text-xs">{errors.address}</span>}
          </div>

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

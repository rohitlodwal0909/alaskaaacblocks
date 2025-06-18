
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Toast } from 'flowbite-react';
import {   Label, TextInput,FileInput } from "flowbite-react";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { CreateLeads, GetLeads } from 'src/features/leadmanagment/LeadmanagmentSlice';
const Addusermodal = ({placeModal, modalPlacement , setPlaceModal }) => {

  const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  source: '',
 
   });

const [errors, setErrors] = useState({});
const dispatch = useDispatch()

 
const handleChange = (field, value) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => ({ ...prev, [field]: '' }));
};
 
const validateForm = () => {
  const newErrors = {};
  if (!formData.name) newErrors.name = 'name is required';
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.phone) newErrors.phone = 'Phone No. is required';
  if (!formData.source) newErrors.source = 'Source is required';
 
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;
  try {
    const result = await dispatch(CreateLeads(formData)).unwrap();
    toast.success(result?.message || "Lead  Added Successfully");
   dispatch(GetLeads())
    setFormData({
    name: '',
    email: '',
  phone: '',
  source: '',
 
   })
    setPlaceModal(false);
  } catch (error: any) {
 
    // Check if error has a response with message from backend
    toast.error(error);
  }
};


  return (
    <>
        <Modal show={placeModal} position={modalPlacement} onClose={() => setPlaceModal(false)} className='large'>
         <ModalHeader className="pb-0">Create New Lead</ModalHeader>
          <ModalBody className='overflow-auto max-h-[100vh]'>
       <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-3">
  {/* Username */}
      <div className="col-span-12">
     <div className="mb-2 block">
    <Label htmlFor="username" value="Name" />
     <span className='text-red-700 ps-1 '>*</span>
    </div>
    <TextInput
      id="username"
      type="text"
      value={formData.name}
      onChange={(e) => handleChange('name', e.target.value)}
      placeholder="Enter name"
      style={{ borderRadius: '5px' }}
      color={errors.name ? 'failure' : 'gray'}
      helperText={errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
    />
  </div>

  {/* Email */}
  <div className="col-span-12">
     <div className="mb-2 block">
    <Label htmlFor="email" value="Email" />
     <span className='text-red-700 ps-1 '>*</span>
    </div>
    <TextInput
      id="email"
      type="email"
      value={formData.email}
      onChange={(e) => handleChange('email', e.target.value)}
      placeholder="name@matdash.com"
      style={{ borderRadius: '5px' }}
      color={errors?.email ? 'failure' : 'gray'}
      helperText={errors?.email && <span className="text-red-500 text-xs">{errors.email}</span>}
    />
  </div>
  {/* Password */}
  <div className="col-span-12">
    <div className="mb-2 block">
    <Label htmlFor="Phone" value="Phone" />
     <span className='text-red-700 ps-1 '>*</span>
    </div>
       <div className="relative">
          <TextInput
            id="Phone"
            type='number'
            name="phone"
             placeholder="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            sizing="md"
            color={errors.phone ? 'failure' : 'gray'}
            className=""
           style={{ borderRadius: '5px' }}
          />
          {/* Interactive Icon Positioned Over Right Side */}
          
        </div>
  {errors.phone && (
  <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
)}
  </div>

  {/* Role */}
  <div className="col-span-12">
  <div className="mb-2 block">
    <Label htmlFor="role" value="Source" />
    <span className="text-red-700 ps-1">*</span>
  </div>

  <select
    id="source"
    value={formData.source}
    onChange={(e) => handleChange("source", e.target.value)}
    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors.source ? "border-red-500" : "border-gray-300"
    }`}
  >
    <option value="">Select Source</option>
    <option value="Facebook Ads">Facebook Ads</option>
    <option value="Google Ads">Google Ads</option>
    <option value="Referral">Referral</option>
    <option value="Website Form">Website Form</option>
    <option value="Other">Other</option>
  </select>

  {errors.source && (
    <span className="text-red-500 text-xs">{errors.source}</span>
  )}
</div>

  <div className="col-span-12 flex justify-end items-center gap-[1rem]">
    <Button type="reset" color="error" onClick={() => setPlaceModal(false)}>
      Cancel
    </Button>
    <Button type="submit" color="primary">
      Submit
    </Button>
  </div>
</form>
  </ModalBody>
            <ModalFooter>            
          </ModalFooter>
        </Modal>
    </>
  )
}

export default Addusermodal
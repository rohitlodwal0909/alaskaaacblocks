import { useState, useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import data from '../../../utils/Statedata.json';
import Select from "react-select";
const Editusermodal = ({ setEditModal, modalPlacement, editModal, selectedUser, onUpdateUser }) => {
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", source: "", material: "", quantity: "", unit: "", size: "",
    state: "", district: "", tehsil: "", address: ""
  });

  const sourceOptions = ["India mart", "Gudgedial", "Instagram", "Youtube", "Other"];
  const sizeOptions = ["600x200x225", "600x200x200", "600x200x150", "600x200x100", "600x200x75"];

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        phone: selectedUser.phone || "",
        source: selectedUser.source || "",
        material: selectedUser.material || "",
        quantity: selectedUser.quantity || "",
        unit: selectedUser.unit || "",
        size: selectedUser.size || "",
        state: selectedUser.state || "",
        district: selectedUser.district || "",
        tehsil: selectedUser.tehsil || "",
        address: selectedUser.address || ""
      });

      const selectedState = data.states.find((s) => s.state === selectedUser.state);
      const districtsList = selectedState ? selectedState.districts : [];
      setDistricts(districtsList);

      const selectedDistrict = districtsList.find((d) => d.name === selectedUser.district);
      const tehsilsList = selectedDistrict ? selectedDistrict.tehsils : [];
      setTehsils(tehsilsList);
    }
  }, [selectedUser]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStateChange = (e) => {
    const stateName = e
    handleChange("state", stateName);
    const selectedState = data.states.find((s) => s.state === stateName);
    setDistricts(selectedState ? selectedState.districts : []);
    setTehsils([]);
    handleChange("district", "");
    handleChange("tehsil", "");
  };

  const handleDistrictChange = (e) => {
    const districtName = e
    handleChange("district", districtName);
    const selectedDistrict = districts.find((d) => d.name === districtName);
    setTehsils(selectedDistrict ? selectedDistrict.tehsils : []);
    handleChange("tehsil", "");
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser?.id) return;
    onUpdateUser({ ...selectedUser, ...formData });
    setEditModal(false);
  };

  return (
    <Modal show={editModal} position={modalPlacement} onClose={() => setEditModal(false)} className="large">
      <ModalHeader>Edit Lead</ModalHeader>
      <ModalBody className="overflow-auto max-h-[100vh]">
        <form className="grid grid-cols-6 gap-3" onSubmit={handleEditSubmit}>
          {["name", "email", "phone"].map((field) => (
            <div key={field} className="col-span-6">
              <Label htmlFor={field} value={field.charAt(0).toUpperCase() + field.slice(1)} />
              <TextInput
                id={field}
                name={field}
                type={field === "email" ? "email" : "text"}
                value={formData[field]}
                style={{borderRadius:'8px'}}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            </div>
          ))}

          <div className="col-span-6">
            <Label value="Source" />
            <select className="w-full p-2 border rounded-sm border-gray-300" value={formData.source} onChange={(e) => handleChange("source", e.target.value)}>
              <option value="">Select Source</option>
              {sourceOptions.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div className="col-span-6">
            <Label value="Material" />
            <select className="w-full p-2 border rounded-sm border-gray-300" value={formData.material} onChange={(e) => handleChange("material", e.target.value)}>
              <option value="">Select Material</option>
              <option value="AAC block">AAC block</option>
              <option value="Adhesive Bag">Adhesive Bag</option>
            </select>
          </div>

          <div className="col-span-6">
            <Label value="Quantity" />
            <div className="flex rounded-md">
              <input
                type="text"
                className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
              <select
                className="rounded-r-md border border-l-0 border-gray-300 px-2 py-2 text-sm"
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
              >
                <option value="">Unit</option>
                <option value="pcs">pcs</option>
                <option value="cubic">cubic</option>
              </select>
            </div>
          </div>


        <div className="col-span-4">
  <Label value="State" />
  <Select
    isSearchable
    options={data.states.map(s => ({ label: s.state, value: s.state }))}
    onChange={(selected) => handleStateChange(selected?.value)}
    value={
      formData.state
        ? { label: formData.state, value: formData.state }
        : null
    }
    classNamePrefix="react-select"
  />
</div>

<div className="col-span-4">
  <Label value="District" />
  <Select
    isSearchable
    options={districts.map(d => ({ label: d.name, value: d.name }))}
    onChange={(selected) => handleDistrictChange(selected?.value)}
    value={
      formData.district
        ? { label: formData.district, value: formData.district }
        : null
    }
    classNamePrefix="react-select"
  />
</div>

<div className="col-span-4">
  <Label value="Tehsil" />
  <Select
    isSearchable
    options={tehsils.map(t => ({ label: t, value: t }))}
    onChange={(selected) => handleChange("tehsil", selected?.value)}
    value={
      formData.tehsil
        ? { label: formData.tehsil, value: formData.tehsil }
        : null
    }
    classNamePrefix="react-select"
  />
</div>


          <div className="col-span-12">
            <Label value="Size" />
            <select
              className="w-full p-2 border rounded-sm border-gray-300"
              value={formData.size}
              onChange={(e) => handleChange("size", e.target.value)}
            >
              <option value="">Select Size</option>
              {sizeOptions.map((size) => (
                <option key={size} value={size}>{size.replace(/x/g, " × ")}</option>
              ))}
            </select>
          </div>

          <div className="col-span-12">
            <Label value="Address" />
            <TextInput
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter address"
                 style={{borderRadius:'8px'}}
            />
          </div>

          <div className="col-span-12 flex justify-end gap-4">
            <Button type="reset" color="error" onClick={() => setEditModal(false)}>Cancel</Button>
            <Button type="submit" color="primary">Update</Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

export default Editusermodal;

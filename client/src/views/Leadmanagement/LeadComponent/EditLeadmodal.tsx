import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from "flowbite-react";
import data from "../../../utils/Statedata.json";
import Select from "react-select";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

const Editusermodal = ({ setEditModal, modalPlacement, editModal, selectedUser, onUpdateUser }) => {
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    state: "",
    district: "",
    tehsil: "",
    delivery_address: "",
    give_range: "",
    address: "",
    materials: [{ material: '', quantity: '', unit: '', size: '' }]
  });

 
useEffect(() => {
  if (selectedUser) {
const parseArray = (field: string): string[] => {
  try {
    const value = selectedUser[field];

    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      const parsed = JSON.parse(value);

      // If parsed is not an array, try to split or fallback to empty array
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "string") return parsed.split(",");
      return [];
    }

    if (typeof value === "number") return [String(value)];

    if (typeof value?.split === "function") {
      return value.split(",");
    }

    return [];
  } catch (error) {
    console.error("Failed to parse:", field, selectedUser[field], error);
    return [];
  }
};

    const materialArr = parseArray("material");
    const quantityArr = parseArray("quantity");
    const unitArr = parseArray("unit");
    const sizeArr = parseArray("size");

    const combinedMaterials = materialArr?.map((_, i) => ({
      material: materialArr[i] || "",
      quantity: quantityArr[i] || "",
      unit: unitArr[i] || "",
      size: sizeArr[i] || "",
    }));

    setFormData({
      name: selectedUser.name || "",
      email: selectedUser.email || "",
      phone: selectedUser.phone || "",
      source: selectedUser.source || "",
      state: selectedUser.state || "",
      district: selectedUser.district || "",
      tehsil: selectedUser.tehsil || "",
      address: selectedUser.address || "",
      delivery_address: selectedUser.delivery_address || "",
      give_range: selectedUser.give_range || "",
      materials: combinedMaterials.length ? combinedMaterials : [{ material: "", quantity: "", unit: "", size: "" }]
    });
    // Set district and tehsil like you did already...
  }
}, [selectedUser]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStateChange = (e) => {
    handleChange("state", e);
    const selectedState = data.states.find((s) => s.state === e);
    setDistricts(selectedState ? selectedState.districts : []);
    setTehsils([]);
    handleChange("district", "");
    handleChange("tehsil", "");
  };

  const handleDistrictChange = (e) => {
    handleChange("district", e);
    const selectedDistrict = districts.find((d) => d.name === e);
    setTehsils(selectedDistrict ? selectedDistrict.tehsils : []);
    handleChange("tehsil", "");
  };

  const updateMaterialRow = (index, field, value) => {
    const updated = [...formData.materials];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, materials: updated }));
  };

  const addMaterialRow = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, { material: '', quantity: '', unit: '', size: '' }]
    }));
  };

  const removeMaterialRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleEditSubmit = (e) => {
  e.preventDefault();
  if (!selectedUser?.id) return;

  // 1. Check if any main formData field is empty
  const requiredFields = [
    "name",
    "email",
    "phone",
    "source",
    "state",
    "district",
    "tehsil",
    "address",
    "delivery_address",
    "give_range"
  ];

  const hasEmptyMainField = requiredFields.some(
    (field) => !formData[field]?.toString().trim()
  );

  if (hasEmptyMainField) {
    toast.error("Please fill all required user fields.");
    return;
  }

  // 2. Check if any material field is empty in any row
  const hasEmptyMaterialField = formData.materials.some(
    (m) =>
      !m.material?.toString().trim() ||
      !m.quantity?.toString().trim() ||
      !m.unit?.toString().trim() ||
      !m.size?.toString().trim()
  );

  if (hasEmptyMaterialField) {
    toast.error("Please fill all material, quantity, unit, and size fields.");
    return;
  }
  const payload = {
    ...selectedUser,
    ...formData,
    material: formData.materials.map(m => m.material).join(','),
    quantity: formData.materials.map(m => m.quantity).join(','),
    unit: formData.materials.map(m => m.unit).join(','),
    size: formData.materials.map(m => m.size).join(',')
  };

  onUpdateUser(payload);
  setEditModal(false);
};

  return (
    <Modal show={editModal} position={modalPlacement} onClose={() => setEditModal(false)} size="4xl">
      <ModalHeader>Edit Lead</ModalHeader>
      <ModalBody className="overflow-auto max-h-[90vh]">
        <form className="grid grid-cols-12 gap-3" onSubmit={handleEditSubmit}>
          {["name", "email", "phone"].map((field) => (
            <div key={field} className="col-span-6">
              <Label htmlFor={field} value={field.charAt(0).toUpperCase() + field.slice(1)} />
              <TextInput
                id={field}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </div>
          ))}

          {/* Source */}
          <div className="col-span-6">
            <Label value="Source" />
            <select
              className="w-full p-2 border rounded-sm border-gray-300"
              value={formData.source}
              onChange={(e) => handleChange("source", e.target.value)}
            >
              <option value="">Select Source</option>
              {["India mart", "Justdial", "Instagram", "Youtube", "Facbook", "google", "Refrence", "Other"].map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>

          {["state", "district", "tehsil"].map((key, ) => {
            const options = key === "state"
              ? data.states.map(s => ({ label: s.state, value: s.state }))
              : key === "district"
                ? districts.map(d => ({ label: d.name, value: d.name }))
                : tehsils.map(t => ({ label: t, value: t }));
            const onChange = key === "state" ? handleStateChange : key === "district" ? handleDistrictChange : (e) => handleChange(key, e);
            return (
              <div className="col-span-4" key={key}>
                <Label value={key.charAt(0).toUpperCase() + key.slice(1)} />
                <Select
                  isSearchable
                  options={options}
                  onChange={(selected) => onChange(selected?.value)}
                  value={formData[key] ? { label: formData[key], value: formData[key] } : null}
                />
              </div>
            );
          })}

         

          {/* Address Fields */}
          <div className="col-span-6">
            <Label value="Party Address" />
            <TextInput
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter address"
              style={{ borderRadius: '8px' }}
            />
          </div>

          <div className="col-span-6">
            <Label value="Give Rate" />
            <TextInput
              value={formData.give_range}
              onChange={(e) => handleChange("give_range", e.target.value)}
              placeholder="Enter Rate"
              style={{ borderRadius: '8px' }}
            />
          </div>

          <div className="col-span-12">
            <Label value="Delivery Address" />
            <TextInput
              value={formData.delivery_address}
              onChange={(e) => handleChange("delivery_address", e.target.value)}
              placeholder="Enter delivery address"
              style={{ borderRadius: '8px' }}
            />
          </div>

 {/* Material Section */}
    {formData.materials.map((item, index) => {
  const materialOptions = ["AAC block", "Adhesive Bag"];
  const sizeDropdown = ["600x200x225", "600x200x200", "600x200x150", "600x200x100", "600x200x75"];

  return (
    <div className="col-span-12 grid grid-cols-12 gap-3 items-end" key={index}>
      {/* Material */}
      <div className="col-span-4">
        <Label value="Material" />
        <select
          value={item?.material ?? ""}
          onChange={(e) => updateMaterialRow(index, "material", e.target.value)}
          className="w-full p-2 border rounded-sm border-gray-300"
        >
          <option value="">Select material</option>
          {materialOptions.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Quantity + Unit */}
      <div className="col-span-4">
        <Label value="Quantity" />
        <div className="flex">
          <input
            type="text"
            placeholder="Enter quantity"
            value={item.quantity?? ""}
            onChange={(e) => updateMaterialRow(index, "quantity", e.target.value)}
            className="w-full border border-gray-300 rounded-l-sm px-3 py-2"
          />
          <select
            value={item.unit ??""}
            onChange={(e) => updateMaterialRow(index, "unit", e.target.value)}
            className="rounded-r-sm border border-l-0 border-gray-300"
          >
            <option value="">Unit</option>
            <option value="pcs">pcs</option>
            <option value="cubic">cubic</option>
          </select>
        </div>
      </div>

      {/* Size */}
      <div className="col-span-3">
        <Label value="Size" />
        <select
          value={item.size ?? ""}
          onChange={(e) => updateMaterialRow(index, "size", e.target.value)}
          className="w-full p-2 border rounded-sm border-gray-300"
        >
          <option value="">Select Size</option>
          {sizeDropdown.map((s) => (
            <option key={s} value={s}>{s.replace(/x/g, " × ")}</option>
          ))}
        </select>
      </div>

      {/* Add / Remove Button */}
      <div className="col-span-1">
        {index === 0  ? (
          <Button onClick={addMaterialRow} color="primary" type="button">
            <Icon icon="ic:baseline-plus" height={18} />
          </Button>
        ) : (
          
          <Button onClick={() => removeMaterialRow(index)} color="error" type="button">
            <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
          </Button>
        )}
      </div>
    </div>
  );
})}
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

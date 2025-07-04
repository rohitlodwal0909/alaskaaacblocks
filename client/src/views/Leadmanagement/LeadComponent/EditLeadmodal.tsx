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
    address: "",
    delivery_address: "",
    materials: [{ material: '', quantity: '', unit: '', size: '', give_range: '' }]
  });

  useEffect(() => {
    if (selectedUser) {
      const parseArray = (field: string): string[] => {
        try {
          const value = selectedUser[field];
          if (Array.isArray(value)) return value;
          if (typeof value === "string") {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed;
            if (typeof parsed === "string") return parsed.split(",");
          }
          if (typeof value === "number") return [String(value)];
          if (typeof value?.split === "function") return value.split(",");
          return [];
        } catch {
          return [];
        }
      };

      const materialArr = parseArray("material");
      const quantityArr = parseArray("quantity");
      const unitArr = parseArray("unit");
      const sizeArr = parseArray("size");
      const giveRangeArr = parseArray("give_range");

      const combined = materialArr.map((_, i) => ({
        material: materialArr[i] || "",
        quantity: quantityArr[i] || "",
        unit: unitArr[i] || "",
        size: sizeArr[i] || "",
        give_range: giveRangeArr[i] || ""
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
        materials: combined.length ? combined : [{ material: "", quantity: "", unit: "", size: "", give_range: "" }]
      });
    }
  }, [selectedUser]);

  // Handlers
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStateChange = (value) => {
    handleChange("state", value);
    const state = data.states.find(s => s.state === value);
    setDistricts(state?.districts || []);
    setTehsils([]);
    handleChange("district", "");
    handleChange("tehsil", "");
  };

  const handleDistrictChange = (value) => {
    handleChange("district", value);
    const district = districts.find(d => d.name === value);
    setTehsils(district?.tehsils || []);
    handleChange("tehsil", "");
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
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser?.id) return;

    const requiredFields = ["name", "email", "phone", "source", "state", "district", "tehsil", "address", "delivery_address"];
    const emptyMain = requiredFields.some(f => !formData[f]?.toString().trim());

    const emptyMaterial = formData.materials.some(
      m => !m.material || !m.quantity || !m.unit || (m.material !== "Adhesive Bag" && !m.size) || !m.give_range
    );

    if (emptyMain) return toast.error("Please fill all required user fields.");
    if (emptyMaterial) return toast.error("Fill all material fields correctly.");

    const payload = {
      ...selectedUser,
      ...formData,
      material: formData.materials.map(m => m.material),
      quantity: formData.materials.map(m => m.quantity),
      unit: formData.materials.map(m => m.unit),
      size: formData.materials.map(m => m.material === "Adhesive Bag" ? "" : m.size),
      give_range: formData.materials.map(m => m.give_range)
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
        const isAdhesive = item.material === "Adhesive Bag";
            const unitOptions = isAdhesive ? ["bag"] : ["pcs", "cubic","bag"];
  const materialOptions = ["AAC block", "Adhesive Bag"];
  const sizeDropdown = ["600x200x225", "600x200x200", "600x200x150", "600x200x100", "600x200x75"];

  return (
    <div className="col-span-12 grid grid-cols-12 gap-3 items-end" key={index}>
      {/* Material */}
      <div className="col-span-3">
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
      <div className="col-span-3">
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
             <option value=""> Unit</option>
               {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Size */}
     {!isAdhesive &&
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
    }
                 <div className="col-span-2">
                  <Label value="Give Rate" />
                  <input type="text" value={item.give_range} onChange={(e) => updateMaterialRow(index, "give_range", e.target.value)} className="w-full p-2 border border-gray-300" />
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

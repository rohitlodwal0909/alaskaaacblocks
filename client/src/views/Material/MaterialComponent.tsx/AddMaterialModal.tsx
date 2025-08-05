import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import { addMaterial, GetMaterial, } from "src/features/Material/MaterialSlice";

const AddMaterialModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    user_id: logindata?.admin?.id || "",
    receiving_id:"",
    mould_oil: "",
    slurry_waste: "",
    slurry_fresh: "",
    cement: "",
    lime: "",
    gypsum: "",
    soluble_oil: "",
    aluminium: "",
    density: "",
    flow_value: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const requiredFields = Object.keys(formData).filter((key) => key !== "user_id");
    const newErrors: any = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addMaterial(formData)).unwrap();
      toast.success(result.message || "Material entry created successfully");
      dispatch(GetMaterial());
      setShowmodal(false);
    } catch (err) {
      toast.error("Failed to create material entry");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create Material Entry</ModalHeader>
      <ModalBody className="overflow-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {[
            { label: "Mould Oil", field: "mould_oil" },
            { label: "Slurry Waste", field: "slurry_waste" },
            { label: "Slurry Fresh", field: "slurry_fresh" },
            { label: "Cement", field: "cement" },
            { label: "Lime", field: "lime" },
            { label: "Gypsum", field: "gypsum" },
            { label: "Soluble Oil", field: "soluble_oil" },
            { label: "Aluminium", field: "aluminium" },
            { label: "Density", field: "density" },
            { label: "Flow Value", field: "flow_value" },
          ].map(({ label, field }) => (
            <div className="col-span-4" key={field}>
              <Label value={label} />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="form-rounded-md"
                color={errors[field] ? "failure" : "gray"}
              />
              {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
            </div>
          ))}
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddMaterialModal;

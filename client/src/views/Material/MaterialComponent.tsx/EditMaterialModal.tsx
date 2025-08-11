import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import {  updateMaterial, } from "src/features/Material/MaterialSlice";
import { GetReceiving } from "src/features/Receiving/ReceivingSlice";

const EditMaterialModal = ({ show, setShowmodal, Material, logindata,setPlaceModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    id: Material?.id || "",
    user_id: logindata?.admin?.id || "",
    mould_oil: "",
    // slurry_waste: "",
    // slurry_fresh: "",
    cement: "",
    lime: "",
    gypsum: "",
    soluble_oil: "",
    aluminium: "",
    // density: "",
    // flow_value: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (Material) {
      setFormData({
        id: Material?.id,
        user_id: logindata?.admin?.id || "",
        mould_oil: Material?.mould_oil || "",
        // slurry_waste: Material?.slurry_waste || "",
        // slurry_fresh: Material?.slurry_fresh || "",
        cement: Material?.cement || "",
        lime: Material?.lime || "",
        gypsum: Material?.gypsum || "",
        soluble_oil: Material?.soluble_oil || "",
        aluminium: Material?.aluminium || "",
        // density: Material?.density || "",
        // flow_value: Material?.flow_value || "",
      });

    }
  }, [Material]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const requiredFields = [
      "mould_oil", 
      // "slurry_waste",
      //  "slurry_fresh", 
       "cement", 
       "lime",
      "gypsum",
       "soluble_oil",
        "aluminium", 
        // "density", 
        // "flow_value"
    ];
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
      const result = await dispatch(updateMaterial(formData)).unwrap();
      toast.success(result.message || "Material updated successfully");
      dispatch(GetReceiving())
      setShowmodal(false);
setPlaceModal(false)
    } catch (err) {
      toast.error("Failed to update material entry");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Edit Material Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form className="grid grid-cols-12 gap-3">
          {[
            "mould_oil",
            //  "slurry_waste (ltr)",
            //   "slurry_fresh (ltr)",
               "cement", "lime",
            "gypsum", "soluble_oil", "aluminium",
            //  "density (kg/m³)", 
            //  "flow_value"
          ].map((field) => (
            <div className="col-span-4" key={field}>
            <Label
  value={`${field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} ${
    field === "mould_oil" || field === "soluble_oil"
      ? "(ltr)"
      : field === "aluminium"
      ? "(gm)"
      : "(kg)"
  }`}
/>
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={`Enter ${field.replace(/_/g, " ")}`}
                type="number"
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
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditMaterialModal;

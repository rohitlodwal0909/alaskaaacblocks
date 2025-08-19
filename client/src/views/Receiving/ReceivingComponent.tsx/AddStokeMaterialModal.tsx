import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import { addMaterial } from "src/features/Material/MaterialSlice";
import { GetReceiving } from "src/features/Receiving/ReceivingSlice";

const AddStokeMaterialModal = ({ show, setShowmodal, logindata ,Receiving}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    user_id: logindata?.admin?.id || "",
    receiving_id:Receiving?.id ||"",
    mould_oil: "",
    hardner: "",
    cement: "",
    lime: "",
    gypsum: "",
    soluble_oil: "",
    aluminium: "",
    ph_booster: "",
    antiscalnt_chemical: "",
   dicromate: "",
    wood: "",
      diesel: ""	,
      adhesive_bag: "",
      fly_ash: "",
  });

    useEffect(()=>{
  if(Receiving?.id){
  setFormData((prev) => ({ ...prev, receiving_id: Receiving?.id  }));
   }

    },[Receiving?.id])

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

const validateForm = () => {
  const requiredFields = Object.keys(formData).filter((key) => key !== "user_id");
  const newErrors: any = {};

  requiredFields.forEach((field) => {
    if (
      formData[field] === undefined ||
      formData[field] === null ||
      formData[field] === "" ||
      (Array.isArray(formData[field]) && formData[field].length === 0)
    ) {
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
      dispatch(GetReceiving())
      setShowmodal(false);
       setFormData({
    user_id: logindata?.admin?.id || "",
    receiving_id:Receiving?.id ||"",
    mould_oil: "",
    hardner: "",
    cement: "",
    lime: "",
    gypsum: "",
    soluble_oil: "",
    aluminium: "",
    ph_booster: "",
    antiscalnt_chemical: "",
   dicromate: "",
    wood: "",
      diesel: ""	,
      adhesive_bag: "",
      fly_ash: "",
  });
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
            { label: "Mould Oil (ltr)", field: "mould_oil" },
            { label: "Cement (kg)", field: "cement" },
            { label: "Lime (kg)", field: "lime" },
            { label: "Gypsum (kg)", field: "gypsum" },
            { label: "Soluble Oil (ltr)", field: "soluble_oil" },
            { label: "Aluminium Powder(grm)", field: "aluminium" },
            { label: "Hardner (ltr)", field: "hardner" },
             { label: "Ph Booster (ltr)", field: "ph_booster" },
             {label: 'Dicromate (grm)', field:'dicromate'},
             { label: "Antiscalant Chemical (ltr) ", field: "antiscalnt_chemical" },
            { label: "Wood (tonne)", field: "wood" },
              {label: 'Diesel (ltr)', field:'diesel'},
             {label: 'Adhesive bag', field:'adhesive_bag'},
             {label: 'fly Ash (kg)', field:'fly_ash'},
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

export default AddStokeMaterialModal;

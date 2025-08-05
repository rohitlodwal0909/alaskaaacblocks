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
import { GetReceiving, updateReceiving } from "src/features/Receiving/ReceivingSlice";

const EditReceivingModal = ({ show, setShowmodal, Receiving, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    id: "",
    user_id: logindata?.admin?.id || "",
    date: "",
    supplier_name: "",
    invoice_no: "",
    received_by: "",
    vehical_no: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (Receiving) {
      setFormData({
        id: Receiving?.id,
        user_id: logindata?.admin?.id || "",
        date: Receiving?.date || "",
        supplier_name: Receiving?.supplier_name || "",
        invoice_no: Receiving?.invoice_no || "",
        received_by: Receiving?.received_by || "",
        vehical_no: Receiving?.vehical_no || "",
      });
    }
  }, [Receiving]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const requiredFields = ["date", "supplier_name", "invoice_no", "received_by", "vehical_no"];
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
      const result = await dispatch(updateReceiving(formData)).unwrap();
      toast.success(result.message || "Receiving updated successfully");
      dispatch(GetReceiving());
      setShowmodal(false);
    } catch (err) {
      toast.error("Failed to update Receiving entry");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Edit Receiving Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form className="grid grid-cols-12 gap-3">
          {[
            { field: "supplier_name", type: "text" },
            { field: "vehical_no", type: "text" },
            { field: "invoice_no", type: "text" },
            { field: "received_by", type: "text" },
            { field: "date", type: "date" },
          ].map(({ field, type }) => (
            <div className="col-span-6" key={field}>
              <Label
                value={field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={`Enter ${field.replace(/_/g, " ")}`}
                type={type}
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

export default EditReceivingModal;

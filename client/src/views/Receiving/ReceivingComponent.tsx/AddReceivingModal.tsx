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
import {
  addReceiving,
  GetReceiving,
} from "src/features/Receiving/ReceivingSlice";

const AddReceivingModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    user_id: logindata?.admin?.id || "",
    date: "",
    supplier_name: "",
    invoice_no: "",
    received_by: "",
    vehical_no: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const requiredFields = Object.keys(formData).filter(
      (key) => key !== "user_id"
    );
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
      const result = await dispatch(addReceiving(formData)).unwrap();
      toast.success(result.message || "Receiving stock created successfully");
      dispatch(GetReceiving());
      setShowmodal(false);
    } catch (err) {
      toast.error("Failed to create receiving stock");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create Receiving Entry</ModalHeader>
      <ModalBody className="overflow-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {[
            { label: "Supplier Name", field: "supplier_name" },
            { label: "Vehicle Number", field: "vehical_no" },
            { label: "Invoice Number", field: "invoice_no" },
            { label: "Received By", field: "received_by" },
            { label: "Date", field: "date", type: "date" },
          ].map(({ label, field, type = "text" }) => (
            <div className="col-span-6" key={field}>
              <Label value={label} />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                type={type}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="form-rounded-md"
                color={errors[field] ? "failure" : "gray"}
              />
              {errors[field] && (
                <p className="text-red-500 text-xs">{errors[field]}</p>
              )}
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

export default AddReceivingModal;

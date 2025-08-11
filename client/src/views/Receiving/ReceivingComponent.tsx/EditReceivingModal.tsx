import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Textarea,
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
    material_details: "",
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
        material_details: Receiving?.material_details || "",
      });
    }
  }, [Receiving]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const requiredFields = ["date", "supplier_name", "invoice_no", "received_by", "material_details"];
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
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
                {[
                  { label: "Supplier Name", field: "supplier_name" },
                  { label: "Invoice Number", field: "invoice_no" },
                  { label: "Received By", field: "received_by" },
                  { label: "Date", field: "date", type: "date" },
                  { label: "Material Details", field: "material_details" },
                ].map(({ label, field, type = "text" }) => (
                  <div className="col-span-6" key={field}>
                    <Label value={label} />
                    <span className="text-red-700 ps-1">*</span>{
                    field === "material_details"? (
      
                      <Textarea
                                   value={formData.material_details}
                                   onChange={(e) => handleChange("material_details", e.target.value)}
                                   className="border rounded-md"
                                   placeholder="Enter material details"
                                   color={errors.material_details ? "failure" : "gray"}
                                 />
                    ):
                    <TextInput
                      type={type}
                      value={formData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="form-rounded-md"
                      color={errors[field] ? "failure" : "gray"}
                    />
                    }
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
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditReceivingModal;

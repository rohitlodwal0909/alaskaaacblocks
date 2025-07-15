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
import { addSegregation, GetSegregation } from "src/features/Segregation/SegregationSlice"; // Adjust path if needed

const AddSegregationModal = ({ show, setShowmodal, segregationdata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    mould_no: segregationdata?.mould_no || "",
    operator_name: "",
    size: "",
    no_of_broken_pcs: "",
    no_of_ok_pcs: "",
    remark: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, mould_no: segregationdata?.mould_no || "" }));
  }, [segregationdata]);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const required = [
      "mould_no",
      "operator_name",
      "size",
      "no_of_broken_pcs",
      "no_of_ok_pcs",
    ];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace("_", " ")} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addSegregation(formData)).unwrap();
      toast.success(result.message || "Segregation entry created successfully");
      dispatch(GetSegregation());

      setFormData({
        mould_no: segregationdata?.mould_no || "",
        operator_name: "",
        size: "",
        no_of_broken_pcs: "",
        no_of_ok_pcs: "",
        remark: "",
      });

      setShowmodal(false);
    } catch (err) {
      toast.error("Failed to create segregation entry");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create New Segregation Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {/* Operator Name */}
          <div className="col-span-6">
            <Label value="Operator Name" />
                <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="operator_name"
              value={formData.operator_name}
              onChange={(e) => handleChange("operator_name", e.target.value)}
              placeholder="Enter operator name"
              className="form-rounded-md"
              color={errors.operator_name ? "failure" : "gray"}
            />
            {errors.operator_name && (
              <p className="text-red-500 text-xs">{errors.operator_name}</p>
            )}
          </div>

          {/* Size */}
          <div className="col-span-6">
            <Label value="Size" />
                <span className="text-red-700 ps-1">*</span>

            <TextInput
              id="size"
              value={formData.size}
              onChange={(e) => handleChange("size", e.target.value)}
              placeholder="Enter size"
              className="form-rounded-md"
              color={errors.size ? "failure" : "gray"}
            />
            {errors.size && <p className="text-red-500 text-xs">{errors.size}</p>}
          </div>

          {/* No of OK Pcs */}
          <div className="col-span-6">
            <Label value="No of OK Pcs" />
                <span className="text-red-700 ps-1">*</span>

            <TextInput
              type="number"
              id="no_of_ok_pcs"
              value={formData.no_of_ok_pcs}
              onChange={(e) => handleChange("no_of_ok_pcs", e.target.value)}
              placeholder="Enter no of OK pcs"
              className="form-rounded-md"
              color={errors.no_of_ok_pcs ? "failure" : "gray"}
            />
            {errors.no_of_ok_pcs && (
              <p className="text-red-500 text-xs">{errors.no_of_ok_pcs}</p>
            )}
          </div>

          {/* No of Broken Pcs */}
          <div className="col-span-6">
            <Label value="No of Broken Pcs" />
                <span className="text-red-700 ps-1">*</span>

            <TextInput
              type="number"
              id="no_of_broken_pcs"
              value={formData.no_of_broken_pcs}
              onChange={(e) => handleChange("no_of_broken_pcs", e.target.value)}
              placeholder="Enter no of broken pcs"
              className="form-rounded-md"
              color={errors.no_of_broken_pcs ? "failure" : "gray"}
            />
            {errors.no_of_broken_pcs && (
              <p className="text-red-500 text-xs">{errors.no_of_broken_pcs}</p>
            )}
          </div>

          {/* Remark */}
          <div className="col-span-12">
            <Label value="Remark" />
            
            <textarea
              value={formData.remark}
              onChange={(e) => handleChange("remark", e.target.value)}
              placeholder="Any notes or comments"
              rows={2}
              className="w-full border rounded-md p-2 border-gray-300"
            />
          </div>
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

export default AddSegregationModal;

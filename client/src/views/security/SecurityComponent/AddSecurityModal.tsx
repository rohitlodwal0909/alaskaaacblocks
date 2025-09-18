import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Radio,
} from "flowbite-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import {
  addSecurity,
  GetSecuritydate,
} from "src/features/Security/SecuritySlice";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const AddSecurityModal = ({ show, setShowmodal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: "",
    vehicle_name: "",
    vehicle_no: "",
    product_name: "",
    from: "",
    to: "",
    in_time: "",
    out_time: "",
    signature: "",
    date_time: "",
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
      const result = await dispatch(addSecurity(formData)).unwrap();
      toast.success(result.message || "Security log created successfully");
      dispatch(GetSecuritydate());
      setShowmodal(false);
    } catch (err) {
      toast.error("Failed to create security log");
    }
  };

  const fields = [
    { label: "Name", field: "name" },
    { label: "Vehicle Name", field: "vehicle_name" },
    { label: "Mobile No.", field: "mobile_no" },
    { label: "Vehicle Number", field: "vehicle_no" },
    { label: "Product Name", field: "product_name" },
    { label: "From", field: "from" },
    { label: "To", field: "to" },
    { label: "IN Time", field: "in_time", type: "time" },
    { label: "Out Time", field: "out_time", type: "time" },
  ];

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="5xl">
      <ModalHeader>Create Security Entry</ModalHeader>
      <ModalBody className="overflow-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {fields.map(({ label, field, type = "text" }) => (
            <div className="col-span-6" key={field}>
              <Label value={label} />
              <span className="text-red-700 ps-1">*</span>

              {type === "time" ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={formData[field] ? dayjs(formData[field], "HH:mm") : null}
                    onChange={(newValue) =>
                      handleChange(field, newValue ? newValue.format("HH:mm") : "")
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors[field],
                        helperText: errors[field],
                      },
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <TextInput
                  type={type}
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="form-rounded-md"
                  color={errors[field] ? "failure" : "gray"}
                />
              )}

              {errors[field] && (
                <p className="text-red-500 text-xs">{errors[field]}</p>
              )}
            </div>
          ))}

          {/* ✅ Correct DateTime Picker */}
          <div className="col-span-6">
            <Label value="Date & Time" />
            <span className="text-red-700 ps-1">*</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={formData.date_time ? dayjs(formData.date_time) : null}
                onChange={(newValue) =>
                  handleChange(
                    "date_time",
                    newValue ? newValue.format("YYYY-MM-DD HH:mm") : ""
                  )
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.date_time,
                    helperText: errors.date_time,
                  },
                }}
              />
            </LocalizationProvider>
            {errors.date_time && (
              <p className="text-red-500 text-xs">{errors.date_time}</p>
            )}
          </div>

          {/* Signature Radio */}
          <div className="col-span-6">
            <Label value="Signature" />
            <span className="text-red-700 ps-1">*</span>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Radio
                  id="signature-yes"
                  name="signature"
                  value="Yes"
                  checked={formData.signature === "Yes"}
                  onChange={(e) => handleChange("signature", e.target.value)}
                />
                <Label htmlFor="signature-yes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="signature-no"
                  name="signature"
                  value="No"
                  checked={formData.signature === "No"}
                  onChange={(e) => handleChange("signature", e.target.value)}
                />
                <Label htmlFor="signature-no">No</Label>
              </div>
            </div>
            {errors.signature && (
              <p className="text-red-500 text-xs">{errors.signature}</p>
            )}
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

export default AddSecurityModal;

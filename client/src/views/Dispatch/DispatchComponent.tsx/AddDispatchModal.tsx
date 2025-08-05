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
import {  useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import { addDispatch, GetDispatch } from "src/features/Dispatch/DispatchSlice";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AddDispatchModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<any>({
    user_id: logindata?.admin?.id || "",
    vehicle_number: "",
    transport_name: "",
    driver_name: "",
    driver_number: "",
    delivery_area: "",
    invoice_number: "",
    eway_bill_number: "",
    material_details: "",
    quantity: "",
    size: "",
    loading_picture: null,
    quality_check: "",
    person_responsible: "",
    time: "",
    eway_bill_expiry: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e) => {
    handleChange("loading_picture", e.target.files[0]);
  };

  const validateForm = () => {
    const requiredFields = [
      "vehicle_number", "transport_name", "driver_name", "driver_number", "delivery_area",
      "invoice_number", "eway_bill_number", "material_details", "quantity", "size",
      "quality_check", "person_responsible", "time", "eway_bill_expiry"
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
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const result = await dispatch(addDispatch(data)).unwrap();
      toast.success(result.message || "Dispatch entry created successfully");
      dispatch(GetDispatch());
      setShowmodal(false);
    } catch (err) {
      toast.error("Failed to create Dispatch entry");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="5xl">
      <ModalHeader>Create Dispatch Entry</ModalHeader>  
      <ModalBody className="overflow-auto ">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {[
            { label: "Vehicle Number", field: "vehicle_number" },
            { label: "Transport Name", field: "transport_name" },
            { label: "Driver Name", field: "driver_name" },
            { label: "Driver Number", field: "driver_number" },
            { label: "Delivery Area", field: "delivery_area" },
            { label: "Invoice Number", field: "invoice_number" },
            { label: "E-Way Bill Number", field: "eway_bill_number" },
            { label: "Quantity", field: "quantity" },
            { label: "Size", field: "size" },
            { label: "Quality Check", field: "quality_check" },
            { label: "Person Responsible", field: "person_responsible" },
          ].map(({ label, field }) => (

            <div className="col-span-4" key={field}>
              <Label value={label} />
              <span className="text-red-700 ps-1">*</span>
               {field === "quality_check" ? (
      <select
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        className={`form-rounded-md w-full border px-3 py-2  rounded-md ${
          errors[field] ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select</option>
        <option value="Pass">Pass</option>
        <option value="Fail">Fail</option>
      </select>
    ) : (
              <TextInput
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="form-rounded-md"
                color={errors[field] ? "failure" : "gray"}
              />
    )}
              {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
            </div>
          ))}
 {/* File Upload */}
          {/* Material Details */}
          <div className="col-span-4">
            <Label value="Loading Picture Upload" />
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50"
              onChange={handleFileChange}
            />
            {errors.loading_picture && <p className="text-red-500 text-xs">{errors.loading_picture}</p>}
          </div>

          {/* Time Picker */}
          <div className="col-span-6">
            <Label value="Dispatch Time" />
            <span className="text-red-700 ps-1">*</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={formData.time ? dayjs(formData.time, "HH:mm") : null}
                onChange={(val) => handleChange("time", val ? dayjs(val).format("HH:mm") : "")}
                 slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      '& .MuiInputBase-root': {
                        fontSize: '14px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '6px',
                      },
                         '& .css-1hgcujo-MuiPickersInputBase-root-MuiPickersOutlinedInput-root': {
                        height: '42px',
                        fontSize: '14px',
                       
                        backgroundColor: '#f1f5f9',
                        borderRadius: '6px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#cbd5e1',
                      },
                      '& input': {
                        padding: '4px 10px',
                      },
                    },
                  },
                }}
                className="form-roounded-md w-full"
              />
            </LocalizationProvider>
            {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
          </div>

          <div className="col-span-6">
            <Label value="E-Way Bill Expiry" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              type="date"
              value={formData.eway_bill_expiry}
              onChange={(e) => handleChange("eway_bill_expiry", e.target.value)}
              className="form-rounded-md"
              color={errors.eway_bill_expiry ? "failure" : "gray"}
            />
            {errors.eway_bill_expiry && <p className="text-red-500 text-xs">{errors.eway_bill_expiry}</p>}
          </div>

           {/* Material Details */}
         
           <div className="col-span-12">
            <Label value="Material Details" />
            <span className="text-red-700 ps-1">*</span>
            <Textarea
              value={formData.material_details}
              onChange={(e) => handleChange("material_details", e.target.value)}
                className="border rounded-md"
              placeholder="Enter material details"
              color={errors.material_details ? "failure" : "gray"}
            />
            {errors.material_details && <p className="text-red-500 text-xs">{errors.material_details}</p>}
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

export default AddDispatchModal;

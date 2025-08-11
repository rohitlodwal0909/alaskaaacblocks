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
import {
  updateDispatch,
  GetDispatch,
} from "src/features/Dispatch/DispatchSlice";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { imageurl } from "src/constants/contant";

const EditDispatchModal = ({ show, setShowmodal, Dispatch, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<any>({
    id: Dispatch?.id,
    user_id: logindata?.admin?.id || "",
    vehicle_number: "",
    transport_name: "",
    driver_name: "",
    driver_number: "",
    delivery_area: "",
    invoice_number: "",
    eway_bill_number: "",
    material_details: "",
    quantity_size_list: [{ quantity: "", size: "" }],
    loading_picture: null,
    quality_check: "",
    person_responsible: "",
    time: "",
    eway_bill_expiry: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (Dispatch) {
let qtySizeList = [];

try {
  const rawQty = Dispatch?.quantity || "[]";
  const rawSize = Dispatch?.size || "[]";

  // Step 1: Remove extra escaping (if present)
  const cleanQtyStr = typeof rawQty === "string" ? JSON.parse(rawQty) : rawQty;
  const cleanSizeStr = typeof rawSize === "string" ? JSON.parse(rawSize) : rawSize;

  // Step 2: Parse actual arrays
  const qty = Array.isArray(cleanQtyStr)
    ? cleanQtyStr
    : JSON.parse(cleanQtyStr);

  const size = Array.isArray(cleanSizeStr)
    ? cleanSizeStr
    : JSON.parse(cleanSizeStr);

  // Step 3: Combine into list
  qtySizeList = qty.map((q, i) => ({
    quantity: q,
    size: size[i] || "",
  }));

  if (!qtySizeList.length) {
    qtySizeList = [{ quantity: "", size: "" }];
  }
} catch (err) {
  // fallback to single comma-separated values
  const qty = Dispatch?.quantity?.split(",") || [];
  const size = Dispatch?.size?.split(",") || [];

  qtySizeList = qty.map((q, i) => ({
    quantity: q.trim(),
    size: size[i]?.trim() || "",
  }));

  if (!qtySizeList.length) {
    qtySizeList = [{ quantity: "", size: "" }];
  }
}

      setFormData({
        id: Dispatch?.id || "",
        user_id: logindata?.admin?.id || "",
        driver_name: Dispatch?.driver_name || "",
        vehicle_number: Dispatch?.vehicle_number || "",
        delivery_area: Dispatch?.delivery_area || "",
        transport_name: Dispatch?.transport_name || "",
        driver_number: Dispatch?.driver_number || "",
        invoice_number: Dispatch?.invoice_number || "",
        eway_bill_number: Dispatch?.eway_bill_number || null,
        eway_bill_expiry: Dispatch?.eway_bill_expiry || null,
        material_details: Dispatch?.material_details || "",
        quantity_size_list: qtySizeList,
        loading_picture: Dispatch?.loading_picture || "",
        quality_check: Dispatch?.quality_check || "",
        person_responsible: Dispatch?.person_responsible || "",
        time: Dispatch?.time || "",
        date: Dispatch?.date || "",
      });
    }
  }, [Dispatch]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };



  const addQuantitySizeRow = () => {
    setFormData((prev) => ({
      ...prev,
      quantity_size_list: [...prev.quantity_size_list, { quantity: "", size: "" }],
    }));
  };
  const removeQuantitySizeRow = (index: number) => {
    const updatedList = [...formData.quantity_size_list];
    updatedList.splice(index, 1);
    setFormData((prev) => ({ ...prev, quantity_size_list: updatedList }));
  };

  const handleQuantitySizeChange = (index: number, field: "quantity" | "size", value: string) => {
    const updatedList = [...formData.quantity_size_list];
    updatedList[index][field] = value;
    setFormData((prev) => ({ ...prev, quantity_size_list: updatedList }));
  };

  const handleFileChange = (e) => {
    handleChange("loading_picture", e.target.files[0]);
  };

  const validateForm = () => {
    const requiredFields = [
      "vehicle_number",
      "transport_name",
      "driver_name",
      "driver_number",
      "delivery_area",
      "invoice_number",
      "eway_bill_number",
      "material_details",
      "quality_check",
      "person_responsible",
      "time",
      "eway_bill_expiry",
    ];
    const newErrors: any = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required`;
      }
    });

    if (
      !formData.quantity_size_list.length ||
      formData.quantity_size_list.some((item) => !item.quantity || !item.size)
    ) {
      newErrors["quantity_size_list"] = "All quantity and size fields are required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedForm = {
      ...formData,
      quantity_size_list: JSON.stringify(formData.quantity_size_list),
    };

    try {
      const result = await dispatch(updateDispatch(updatedForm)).unwrap();
      toast.success(result.message || "Dispatch updated successfully");
      dispatch(GetDispatch());
      setShowmodal(false);
    } catch (err) {
      toast.error("Failed to update dispatch");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Edit Dispatch Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form className="grid grid-cols-12 gap-3">
          {/* Form Fields */}
          {[
            { label: "Vehicle Number", field: "vehicle_number" },
            { label: "Transport Name", field: "transport_name" },
            { label: "Driver Name", field: "driver_name" },
            { label: "Driver Number", field: "driver_number" },
            { label: "Delivery Area", field: "delivery_area" },
            { label: "Invoice Number", field: "invoice_number" },
            { label: "E-Way Bill Number", field: "eway_bill_number" },
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
                  className={`form-rounded-md w-full border px-3 py-2 rounded-md ${
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
              {errors[field] && (
                <p className="text-red-500 text-xs">{errors[field]}</p>
              )}
            </div>
          ))}

       

          {/* Time Picker */}
          <div className="col-span-4">
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

          {/* Eway Bill Expiry */}
          <div className="col-span-4">
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
   {/* File Upload */}
          <div className="col-span-4">
            <Label value="Loading Picture Upload" />
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50"
              onChange={handleFileChange}
            />
             {formData.loading_picture && typeof formData.loading_picture === "string" && (
              <div className="flex justify-end gap-2 mt-1">
                <img
                  src={imageurl + formData.loading_picture}
                  alt="Loading"
                  className="rounded-md h-7"
                />
              </div>
            )}
            {errors.loading_picture && <p className="text-red-500 text-xs">{errors.loading_picture}</p>}
          </div>
          {/* Dynamic Quantity & Size */}
          <div className="col-span-12">
            <Label value="Quantity & Size" />
            <span className="text-red-700 ps-1">*</span>

            {formData.quantity_size_list.map((row, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center mb-2">
                <div className="col-span-5">
                  <TextInput
                    placeholder="Enter quantity"
                value={row.quantity}
                      className="form-rounded-md"
                    onChange={(e) => handleQuantitySizeChange(index, "quantity", e.target.value)}
                  />
                </div>
                <div className="col-span-5">
                  <TextInput
                    placeholder="Enter size"
                    value={row.size}
                    className="form-rounded-md"
                    onChange={(e) => handleQuantitySizeChange(index, "size", e.target.value)}
                  />
                </div>
                <div className="col-span-2 flex gap-2">
                  {index > 0  && (
                    <Button color="failure" size="sm" onClick={() => removeQuantitySizeRow(index)}>
                      -
                    </Button>
                  )}
                  {index == 0 && (
                    <Button color="success" size="sm" onClick={addQuantitySizeRow}>
                      +
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {errors.quantity_size_list && (
              <p className="text-red-500 text-xs">{errors.quantity_size_list}</p>
            )}
          </div>

          {/* Material Details */}
          <div className="col-span-12">
            <Label value="Material Details" />
            <span className="text-red-700 ps-1">*</span>
            <Textarea
              value={formData.material_details}
              onChange={(e) =>
                handleChange("material_details", e.target.value)
              }
              className="border rounded-md"
              placeholder="Enter material details"
              color={errors.material_details ? "failure" : "gray"}
            />
            {errors.material_details && (
              <p className="text-red-500 text-xs">
                {errors.material_details}
              </p>
            )}
          </div>
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

export default EditDispatchModal;

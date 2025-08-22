

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
import {   GetBoiler, updateBoiler } from "src/features/Boiler/BoilerSlice";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EditBoilerModal = ({ show, setShowmodal, BoilerData , logindata  }) => {
  const dispatch = useDispatch<AppDispatch>();

  const fieldSetFields = [
    { id: "time", label: "Time", type: "text" },
    { id: "feed_water_temp", label: "Feed Water Temp", type: "number" },
    { id: "feed_water_tds", label: "Feed Water TDS", type: "number" },
    { id: "water_meter_reading", label: "Water Meter Reading", type: "number" },
    { id: "steam_pressure", label: "Steam Pressure", type: "number" },
    { id: "stack_temp", label: "Stack Temp", type: "number" },
    { id: "inlet_temp", label: "Inlet Temp", type: "number" },
    { id: "fd_fan_reading", label: "FD Fan Reading", type: "number" },
   { id: "ph_booster", label: "PH Booster chemical (ltr)", type: "number" },
    { id: "antiscalnt_chemical", label: "Antiscalant Chemical (ltr)", type: "number" },
    { id: "energy_meter_reading", label: "Energy Meter Reading", type: "number" },
  ];

  const initialData = {
    id:"",
    user_id: logindata?.admin?.id,
    date: "",
    // location: "",
    shift: "",
    done_by: "",
      blow_tds:"",
      blow_ph:"",
    total_wood_consumption: "",
   readings: [
    Object.fromEntries(fieldSetFields.map(({ id }) => [id, ""])), // default one entry
  ],
  };


  const shiftOptions = ["Day", "Night"];
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<any>({});

 useEffect(() => {
  if (BoilerData) {
    const readingsArray = [];

    const readingFieldKeys = fieldSetFields.map((field) => field.id);
    const parsedFields: Record<string, any[]> = {};

    let maxLength = 0;

    readingFieldKeys.forEach((key) => {
      try {
        parsedFields[key] = JSON.parse(BoilerData[key] || "[]");
        if (parsedFields[key].length > maxLength) {
          maxLength = parsedFields[key].length;
        }
      } catch (err) {
        parsedFields[key] = [];
      }
    });

    for (let i = 0; i < maxLength; i++) {
      const reading: Record<string, any> = {};

      readingFieldKeys.forEach((key) => {
        reading[key] = parsedFields[key]?.[i] ?? "";
      });

      readingsArray.push(reading);
    }

    setFormData({
      id: BoilerData.id || "",
      user_id: logindata?.admin?.id,
      date: BoilerData.date || "",
      // location: BoilerData.location || "",
      shift: BoilerData.shift || "",
      done_by: BoilerData.done_by || "",
      total_wood_consumption: BoilerData.total_wood_consumption || "",
        blow_tds:BoilerData.blow_tds || "",
      blow_ph:BoilerData.blow_ph || "",
      readings: readingsArray.length
        ? readingsArray
        : [
            Object.fromEntries(readingFieldKeys.map((key) => [key, ""]))
          ],
    });

    setErrors({});
  }
}, [BoilerData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleReadingChange = (index: number, field: string, value: any) => {
    const updated = [...formData.readings];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, readings: updated }));
  };

  const addReadingSet = () => {
    const newSet = Object.fromEntries(fieldSetFields.map(({ id }) => [id, ""]));
    setFormData((prev) => ({
      ...prev,
      readings: [...prev.readings, newSet],
    }));
  };

  const deleteReadingSet = (index: number) => {
    const updated = formData.readings.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, readings: updated }));
  };

  const requiredFields = ["date", "shift", "done_by", "total_wood_consumption"];

 const validateForm = () => {
  const newErrors: any = {};
  const readingErrors: any = [];

  // Validate top-level fields
  requiredFields.forEach((field) => {
    if (!formData[field]) {
      newErrors[field] = `${field.replace(/_/g, " ")} is required`;
    }
  });

  // Validate each reading set
  formData.readings.forEach((reading) => {
    const errorsInSet: any = {};
    fieldSetFields.forEach(({ id }) => {
      if (!reading[id]) {
        errorsInSet[id] = `${id.replace(/_/g, " ")} is required`;
      }
    });

    readingErrors.push(errorsInSet);
  });

  // If at least one set is empty, throw error
  if (formData.readings.length === 0) {
    newErrors.readings = "At least one reading set is required";
  }

  // Attach per-reading errors to main errors object
  newErrors.readings = readingErrors;

  setErrors(newErrors);

  // Check if all fields are valid
  const hasTopLevelErrors = Object.keys(newErrors).some((key) => key !== "readings" && newErrors[key]);
  const hasReadingErrors = readingErrors.some((setErrors) => Object.keys(setErrors).length > 0);

  return !hasTopLevelErrors && !hasReadingErrors;
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const result = await dispatch(updateBoiler(formData)).unwrap();
    toast.success(result.message || "Boiler entry updated successfully");
    dispatch(GetBoiler()); // Refresh data
    setFormData(initialData); // Reset form
    setShowmodal(false); // Close modal
  } catch (err: any) {
    toast.error(
      err?.message || err?.error || "Failed to update Boiler entry"
    );
  }
};
  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="5xl">
      <ModalHeader>Edit Boiler Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <Label htmlFor="done_by" value="Done By" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="done_by"
              value={formData.done_by}
              onChange={(e) => handleChange("done_by", e.target.value)}
              placeholder="Enter name"
              className="form-rounded-md"
            />
               {errors.done_by && <p className="text-red-500 text-xs">{errors.done_by}</p>}
          </div>
          <div className="col-span-4">
            <Label htmlFor="shift" value="Shift" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="shift"
              value={formData.shift}
              onChange={(e) => handleChange("shift", e.target.value)}
              className="w-full p-2 border rounded-sm border-gray-300"
            >
              <option value="">Select Shift</option>
              {shiftOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
               {errors.shift && <p className="text-red-500 text-xs">{errors.shift}</p>}

          </div>
          <div className="col-span-4">
            <Label htmlFor="total_wood_consumption" value="Total Wood Consumption " />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="total_wood_consumption"
              value={formData.total_wood_consumption}
              onChange={(e) => handleChange("total_wood_consumption", e.target.value)}
              placeholder="Enter value"
              className="form-rounded-md"
            />
               {errors.total_wood_consumption && <p className="text-red-500 text-xs">{errors.total_wood_consumption}</p>}

          </div>
          {/* <div className="col-span-6">
            <Label htmlFor="location" value="Location" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Enter location"
              className="form-rounded-md"
            />
               {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}

          </div> */}
          <div className="col-span-4">
            <Label htmlFor="date" value="Date" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="form-rounded-md"
            />
               {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
          </div>

           <div className="col-span-4">
            <Label htmlFor="blow_tds" value="Blow down TDS" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="blow_tds"
              value={formData.blow_tds}
              onChange={(e) => handleChange("blow_tds", e.target.value)}
              placeholder="Enter Blow down TDS"
              className="form-rounded-md"
            />
               {errors.blow_tds && <p className="text-red-500 text-xs">{errors.blow_tds}</p>}

          </div>
          <div className="col-span-4">
            <Label htmlFor="blow_ph" value="Blow down ph" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="blow_ph"
              value={formData.blow_ph}
              onChange={(e) => handleChange("blow_ph", e.target.value)}
              placeholder="Enter Blow down ph"
              className="form-rounded-md"
            />
               {errors.blow_ph && <p className="text-red-500 text-xs">{errors.blow_ph}</p>}

          </div>
          {/* Render Dynamic Reading Sets */}
       {formData.readings.map((reading, index) => (
     <div key={index} className="col-span-12 border p-4 rounded-md  relative">
   
    <div className="grid grid-cols-4 gap-4">
      {fieldSetFields.map(({ id, label, type }) => (
        <div key={id}>
          <Label htmlFor={`${id}-${index}`} value={label} />
          <span className="text-red-700 ps-1">*</span>
          {id === "time" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={reading[id] ? dayjs(reading[id]) : null}
                onChange={(value: any) =>
                  handleReadingChange(index, id, value)
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      "& .MuiInputBase-root": {
                        fontSize: "14px",
                        backgroundColor: "#f1f5f9",
                        borderRadius: "6px",
                        height: "38px",
                      },
                       '& .css-1hgcujo-MuiPickersInputBase-root-MuiPickersOutlinedInput-root': {
            height: '42px',
            fontSize: '14px',
           
            backgroundColor: '#f1f5f9',
            borderRadius: '6px',
          },
                      "& input": { padding: "9.5px 0" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          ) : (
            <TextInput
              id={`${id}-${index}`}
              type={type}
              value={reading[id]}
              onChange={(e) =>
                handleReadingChange(index, id, e.target.value)
              }
              placeholder={`Enter ${label.toLowerCase()}`}
              className="form-rounded-md"
            />
          )}
          {errors.readings?.[index]?.[id] && (
  <p className="text-red-500 text-xs">
    {errors.readings[index][id]}
  </p>
)}
        </div>
      ))}
        {index !== 0 && (
      <button
        type="button"
        onClick={() => deleteReadingSet(index)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
      >
        Delete
      </button>
    )}
    </div>
  </div>
))}
          {/* Add More Readings Button */}
          <div className="col-span-12 ps-4">
            <Button type="button" onClick={addReadingSet} color="primary">
              + Add More
            </Button>
           
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditBoilerModal;


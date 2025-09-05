import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from "flowbite-react";
import {  useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { addAutoclave, GetCuttingdate } from "src/features/Autoclave/AutoclaveSlice";
import { Icon } from "@iconify/react";

const AddAutoClaveModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();


  const [header, setHeader] = useState({
    user_id: logindata?.admin?.id,
    datetime:'',
    operator_name: "",
  });
  

  // multiple rows
  const [rows, setRows] = useState([
    {
      autoclave_no:"",
      material_receipt_time: "",
      door_closing_time: "",
      vacuum_on_time: "",
      vacuum_off_time: "",
      rising_pressure_time: "",
      rising_pressure_value: "",
      holding_pressure_time: "",
      holding_pressure_value: "",
      release_pressure_time: "",
      release_pressure_value: "",
      door_opening_time: "",
    },
  ]);

  const handleHeaderChange = (field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([
      ...rows,
      { 
        autoclave_no:"",
        material_receipt_time: "",
        door_closing_time: "",
        vacuum_on_time: "",
        vacuum_off_time: "",
        rising_pressure_time: "",
        rising_pressure_value: "",
        holding_pressure_time: "",
        holding_pressure_value: "",
        release_pressure_time: "",
        release_pressure_value: "",
        door_opening_time: "",
      },
    ]);
  };

  const removeRow = (idx) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = { 
      autoclaveData: header,   // 👈 autoclaveData ke andar header fields (mould_no, operator_name, user_id)
      records: rows            // 👈 records alag array
    };

    const result = await dispatch(addAutoclave(payload)).unwrap();
    toast.success(result.message || "Autoclave entry created successfully");
    dispatch(GetCuttingdate());
    setShowmodal(false);
  } catch (err) {
    toast.error("Failed to create autoclave entry");
  }
};


  const renderTime = (val, onChange) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        value={val ? dayjs(val, "HH:mm") : null}
        onChange={(newVal) => onChange(newVal ? dayjs(newVal).format("HH:mm") : "")}
        slotProps={{
          textField: { size: "small", sx: { width: "100%" } },
        }}
      />
    </LocalizationProvider>
  );

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="7xl">
      <ModalHeader>Autoclave Daily Report</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ===== Header Section ===== */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Operator Name</Label>
              <TextInput
                value={header.operator_name}
                onChange={(e) => handleHeaderChange("operator_name", e.target.value)}
              />
            </div>
         
            <div>
              <Label>Date & Time</Label>
              <input
                type="datetime-local"
                id="datetime"
                value={header.datetime}
                onChange={(e) => handleHeaderChange("datetime", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

            
          </div>
          </div>

          {/* ===== Rows Section (4-4 grid layout) ===== */}
          {rows.map((row, idx) => (
            <div key={idx} className="border rounded-lg p-3 mb-4 shadow-sm">
              <div className="grid grid-cols-4 gap-4">

                 <div>
                  <Label>Autoclave No.</Label>
                  <TextInput
                      type="number"
                      placeholder="Enter Autoclave No."
                      value={row.autoclave_no}
                      onChange={(e) =>
                        handleRowChange(idx, "autoclave_no", e.target.value)
                      }
                    />
                </div>

                <div>
                  <Label>Material Receipt</Label>
                  {renderTime(row.material_receipt_time, (val) =>
                    handleRowChange(idx, "material_receipt_time", val)
                  )}
                </div>

                <div>
                  <Label>Door Closing</Label>
                  {renderTime(row.door_closing_time, (val) =>
                    handleRowChange(idx, "door_closing_time", val)
                  )}
                </div>

                <div>
                  <Label>Vacuum On</Label>
                  {renderTime(row.vacuum_on_time, (val) =>
                    handleRowChange(idx, "vacuum_on_time", val)
                  )}
                </div>

                <div>
                  <Label>Vacuum Off</Label>
                  {renderTime(row.vacuum_off_time, (val) =>
                    handleRowChange(idx, "vacuum_off_time", val)
                  )}
                </div>

                <div>
                  <Label>Rising Pressure</Label>
                  <div className="flex flex-col gap-1">
                    {renderTime(row.rising_pressure_time, (val) =>
                      handleRowChange(idx, "rising_pressure_time", val)
                    )}
                    <TextInput
                      type="number"
                      placeholder="kg/cm²"
                      value={row.rising_pressure_value}
                      onChange={(e) =>
                        handleRowChange(idx, "rising_pressure_value", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Holding Pressure</Label>
                  <div className="flex flex-col gap-1">
                    {renderTime(row.holding_pressure_time, (val) =>
                      handleRowChange(idx, "holding_pressure_time", val)
                    )}
                    <TextInput
                      type="number"
                      placeholder="kg/cm²"
                      value={row.holding_pressure_value}
                      onChange={(e) =>
                        handleRowChange(idx, "holding_pressure_value", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Release Pressure</Label>
                  <div className="flex flex-col gap-1">
                    {renderTime(row.release_pressure_time, (val) =>
                      handleRowChange(idx, "release_pressure_time", val)
                    )}
                    <TextInput
                      type="number"
                      placeholder="kg/cm²"
                      value={row.release_pressure_value}
                      onChange={(e) =>
                        handleRowChange(idx, "release_pressure_value", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Door Opening</Label>
                  {renderTime(row.door_opening_time, (val) =>
                    handleRowChange(idx, "door_opening_time", val)
                  )}
                </div>
              </div>

              {/* Delete button */}
              {rows.length > 1 && (
                <div className="mt-3 flex justify-end">
                  <Button
                    size="xs"
                    color="failure"
                    onClick={() => removeRow(idx)}
                  >
                    <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                  </Button>
                </div>
              )}
            </div>
          ))}

          <div className="mt-3">
            <Button size="sm" onClick={addRow}>
              <Icon icon="ic:baseline-plus" height={18} /> Add Row
            </Button>
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

export default AddAutoClaveModal;

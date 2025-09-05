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
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { updateAutoclave, GetAutoclave,GetAutoclaveSingle } from "src/features/Autoclave/AutoclaveSlice";
import { getDateTimeFromTimeString } from "src/utils/getDateTimeFromTimeString";
import { useParams } from "react-router";

const EditAutoClaveModal = ({ show, setShowmodal, autoclaves }) => {
  const dispatch = useDispatch<AppDispatch>();

  console.log(autoclaves);
  // const editId = autoclaves?.rising_info?.cutting_info?.autoclave?.id;
   const editId = autoclaves?.id;
const {id} = useParams();

  // use main autoclave.id, not autoclave_entries[0]?.id

  const [autoclave, setAutoclave] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    id: "",
    operator_name: "",
    records: [],
  });

  useEffect(() => {
    if (!editId) return;
    dispatch(GetAutoclaveSingle(editId)).then((res: any) => {
      if (res?.payload) {
        setAutoclave(res.payload);
      }
    });
  }, [dispatch, editId]);

  // Populate form with API data
  useEffect(() => {
    if (autoclave) {
      setFormData({
        id: autoclave.id || "",
        operator_name: autoclave.operator_name || "",
        records:
          autoclave.records?.length > 0
            ? autoclave.records.map((r) => ({
                ...r,
                material_receipt_time: r.material_receipt_time || "",
                door_closing_time: r.door_closing_time || "",
                vacuum_on_time: r.vacuum_on_time || "",
                vacuum_off_time: r.vacuum_off_time || "",
                rising_pressure_time: r.rising_pressure_time || "",
                rising_pressure_value: r.rising_pressure_value || "",
                holding_pressure_time: r.holding_pressure_time || "",
                holding_pressure_value: r.holding_pressure_value || "",
                release_pressure_time: r.release_pressure_time || "",
                release_pressure_value: r.release_pressure_value || "",
                door_opening_time: r.door_opening_time || "",
              }))
            : [
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
              ],
      });
    }
  }, [autoclave]);

  // --- handle input changes ---
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecordChange = (index: number, field: string, value: any) => {
    const updatedRecords = [...formData.records];
    updatedRecords[index][field] = value;
    setFormData((prev) => ({ ...prev, records: updatedRecords }));
  };

  // --- submit update ---
const handleSubmit = async (e: any) => {
  e.preventDefault();
  try {
    const payload = {
      autoclaveData: {
        id: formData.id,
        operator_name: formData.operator_name,
      },
      records: formData.records,
    };

    const result = await dispatch(updateAutoclave({ id: formData.id, data: payload })).unwrap();
    toast.success(result.message || "Autoclave entry updated successfully");
    dispatch(GetAutoclave(id));
    setShowmodal(false);
  } catch (err) {
    toast.error("Failed to update autoclave entry");
  }
};


  // --- render time picker ---
  const renderTime = (val: string, onChange: (val: string) => void) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        ampm={true}
        value={
          val && getDateTimeFromTimeString(val)?.isValid()
            ? getDateTimeFromTimeString(val)
            : null
        }
        onChange={(value) => {
          const formatted = value ? dayjs(value).format("HH:mm:ss") : "";
          onChange(formatted);
        }}
        slotProps={{
          textField: { size: "small", sx: { width: "100%" } },
        }}
      />
    </LocalizationProvider>
  );

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="6xl">
      <ModalHeader>Edit Autoclave Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- Operator Name --- */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Operator Name</Label>
              <TextInput
                value={formData.operator_name}
                onChange={(e) => handleChange("operator_name", e.target.value)}
              />
            </div>
          </div>

          {/* --- Records Section --- */}
          {formData.records.map((row: any, idx: number) => (
            <div key={idx} className="border rounded-lg p-3 mb-4 shadow-sm">
              <div className="grid grid-cols-4 gap-4">

          
                <div>
         
                  <Label>Autoclave No.</Label>
                  <div className="flex flex-col gap-1">
                   
                    <TextInput
                      type="number"
                      value={row.autoclave_no}
                      onChange={(e) =>
                        handleRecordChange(idx, "autoclave_no", e.target.value)
                      }
                    />
                  </div>
                  </div>

                
                <div>
                  <Label>Material Receipt</Label>
                  {renderTime(row.material_receipt_time, (val) =>
                    handleRecordChange(idx, "material_receipt_time", val)
                  )}
                </div>
                <div>
                  <Label>Door Closing</Label>
                  {renderTime(row.door_closing_time, (val) =>
                    handleRecordChange(idx, "door_closing_time", val)
                  )}
                </div>
                <div>
                  <Label>Vacuum On</Label>
                  {renderTime(row.vacuum_on_time, (val) =>
                    handleRecordChange(idx, "vacuum_on_time", val)
                  )}
                </div>
                <div>
                  <Label>Vacuum Off</Label>
                  {renderTime(row.vacuum_off_time, (val) =>
                    handleRecordChange(idx, "vacuum_off_time", val)
                  )}
                </div>
                <div>
                  <Label>Rising Pressure</Label>
                  <div className="flex flex-col gap-1">
                    {renderTime(row.rising_pressure_time, (val) =>
                      handleRecordChange(idx, "rising_pressure_time", val)
                    )}
                    <TextInput
                      type="number"
                      value={row.rising_pressure_value}
                      onChange={(e) =>
                        handleRecordChange(idx, "rising_pressure_value", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Holding Pressure</Label>
                  <div className="flex flex-col gap-1">
                    {renderTime(row.holding_pressure_time, (val) =>
                      handleRecordChange(idx, "holding_pressure_time", val)
                    )}
                    <TextInput
                      type="number"
                      value={row.holding_pressure_value}
                      onChange={(e) =>
                        handleRecordChange(idx, "holding_pressure_value", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Release Pressure</Label>
                  <div className="flex flex-col gap-1">
                    {renderTime(row.release_pressure_time, (val) =>
                      handleRecordChange(idx, "release_pressure_time", val)
                    )}
                    <TextInput
                      type="number"
                      value={row.release_pressure_value}
                      onChange={(e) =>
                        handleRecordChange(idx, "release_pressure_value", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Door Opening</Label>
                  {renderTime(row.door_opening_time, (val) =>
                    handleRecordChange(idx, "door_opening_time", val)
                  )}
                </div>
              </div>
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


export default EditAutoClaveModal;

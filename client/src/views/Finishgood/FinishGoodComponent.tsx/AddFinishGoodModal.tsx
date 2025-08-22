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
import {
    addfinishgood,
  GetFinishGood,
} from "src/features/Segregation/SegregationSlice";

const AddFinishGoodModal = ({ show, setShowmodal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    entries: [
      {
        size: "",
        no_of_ok_pcs: "",
      },
    ],
   
  });

  const [errors, setErrors] = useState<any>({});

 

  const sizeOptions = [
    "600x200x225",
    "600x200x200",
    "600x200x150",
    "600x200x100",
    "600x200x75",
  ];

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...formData.entries];
    newEntries[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      entries: newEntries,
    }));
  };

  const addEntryRow = () => {
    setFormData((prev) => ({
      ...prev,
      entries: [...prev.entries, { size: "", no_of_ok_pcs: "" , }],
    }));
  };

  const removeEntryRow = (index) => {
    const newEntries = [...formData.entries];
    newEntries.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      entries: newEntries,
    }));
  };

 
  const validateForm = () => {
    const newErrors: any = {};
    formData.entries.forEach((entry, index) => {
      if (!entry.size  || !entry.no_of_ok_pcs) {
        newErrors[`entry_${index}`] = "All fields in this row are required";
      }
    });
  
    if (!formData.entries.length) newErrors.entries = "At least one entry is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        
         size: formData.entries.map((row) => row.size),
  no_of_ok_pcs: formData.entries.map((row) => row.no_of_ok_pcs),
      };

      const result = await dispatch(addfinishgood(payload)).unwrap();
      toast.success(result.message || "Segregation entry created successfully");
      dispatch(GetFinishGood());

      setFormData({
        entries: [{ size: "", no_of_ok_pcs: "" }],
      });

      setShowmodal(false);
    } catch (err) {
      toast.error("Failed to create segregation entry");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create  Entry</ModalHeader>
      <ModalBody className="overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
          {/* Dynamic Entries */}
          <div className="col-span-12 ">
            {formData.entries.map((entry, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-end  p-2 "
              >
                <div className="col-span-5">
                  <Label value={`Size `} />
                  <select
                    value={entry.size}
                    onChange={(e) => handleEntryChange(index, "size", e.target.value)}
                    className="w-full p-2 border rounded-sm border-gray-300 text-sm"
                  >
                    <option value="">Select Size</option>
                    {sizeOptions.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/x/g, " × ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-5">
                  <Label value={`OK Pcs`} />
                  <TextInput
                    type="number"
                    value={entry.no_of_ok_pcs}
               
              className="form-rounded-md"

                    onChange={(e) =>
                      handleEntryChange(index, "no_of_ok_pcs", e.target.value)
                    }
                    placeholder="Enter OK Pcs"
                  />
                </div>

                <div className="col-span-2 flex gap-1">
                  {index === 0 ? (
                    <Button color="success" onClick={addEntryRow} type="button">
                      +
                    </Button>
                  ) : (
                    <Button
                      color="failure"
                      onClick={() => removeEntryRow(index)}
                      type="button"
                    >
                      -
                    </Button>
                  )}
                </div>

                {errors[`entry_${index}`] && (
                  <p className="text-red-500 text-xs col-span-12">
                    {errors[`entry_${index}`]}
                  </p>
                )}
              </div>
            ))}
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

export default AddFinishGoodModal;

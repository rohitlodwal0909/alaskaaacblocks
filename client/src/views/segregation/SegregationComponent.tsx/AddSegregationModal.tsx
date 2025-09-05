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
  addSegregation,
  GetAutoclavedate,
} from "src/features/Segregation/SegregationSlice";

const AddSegregationModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  // const autoclave_id = segregationdata?.id;



  const [formData, setFormData] = useState({
    user_id: logindata?.admin?.id,
    datetime:'',
    operator_name:'',
    entries: [
      {
        size: "",
        no_of_broken_pcs: "",
        no_of_ok_pcs: "",
        plate_no:'',
      },
    ],
    remark: "",
  });

  const [errors, setErrors] = useState<any>({});

  // useEffect(() => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     mould_no: segregationdata?.mould_no || "",
  //     autoclave_id:autoclave_id,
  //   }));
  // }, [segregationdata]);

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
      entries: [...prev.entries, { size: "", no_of_broken_pcs: "", no_of_ok_pcs: "" , plate_no:'',}],
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    formData.entries.forEach((entry, index) => {
      if (!entry.size || !entry.no_of_broken_pcs || !entry.no_of_ok_pcs || !entry.plate_no) {
        newErrors[`entry_${index}`] = "All fields in this row are required";
      }
    });
    if (!formData.operator_name) newErrors.operator_name = "Operator Name is required";
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
          user_id: logindata?.admin?.id,
          size: formData.entries.map((row) => row.size),
          no_of_broken_pcs: formData.entries.map((row) => row.no_of_broken_pcs),
          no_of_ok_pcs: formData.entries.map((row) => row.no_of_ok_pcs),
          plate_no:formData.entries.map((row) => row.plate_no),
      };

      const result = await dispatch(addSegregation(payload)).unwrap();
      toast.success(result.message || "Segregation entry created successfully");
      dispatch(GetAutoclavedate());

      setFormData({
        operator_name:"",
        user_id: logindata?.admin?.id,
        datetime:'',
        entries: [{ size: "", no_of_broken_pcs: "", no_of_ok_pcs: "",plate_no:"" }],
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

           <div className="col-span-6">
            <Label value="Date & Time" />
            <span className="text-red-700 ps-1">*</span>
              <input
                type="datetime-local"
                id="datetime"
                value={formData.datetime}
                onChange={(e) => handleChange("datetime", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            {errors.operator_name && (
              <p className="text-red-500 text-xs">{errors.datetime}</p>
            )}
          </div>

         

          {/* Mould No */}
         
          {/* Dynamic Entries */}
          <div className="col-span-12 ">
            {formData.entries.map((entry, index) => (
              <div
                key={index}
                className="grid grid-cols-10 gap-3 items-end  p-2 "
              >
                <div className="col-span-3">
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

                <div className="col-span-2">
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

                <div className="col-span-2">
                  <Label value={`Broken Pcs`} />
                  <TextInput
                    type="number"
                    value={entry.no_of_broken_pcs}
              className="form-rounded-md"

                    onChange={(e) =>
                      handleEntryChange(index, "no_of_broken_pcs", e.target.value)
                    }
                    placeholder="Enter Broken Pcs"
                  />
                </div>
  <div className="col-span-2">
                  <Label value={`Plate No.`} />
                  <TextInput
                    type="number"
                    value={entry.plate_no}
                   className="form-rounded-md"

                    onChange={(e) =>
                      handleEntryChange(index, "plate_no", e.target.value)
                    }
                    placeholder="Enter Plate Number"
                  />
                </div>
                <div className="col-span-1 flex gap-1">
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

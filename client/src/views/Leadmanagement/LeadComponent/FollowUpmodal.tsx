import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
   Label,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FollowupLeads } from "src/features/leadmanagment/LeadmanagmentSlice";
import { AppDispatch } from 'src/store';

const FollowUpmodal = ({ placeModal, modalPlacement,setPlaceModal,selectedRow,setFollowupData }) => {

    const [formData, setFormData] = useState({
    lead_id: selectedRow?.id,
    notes: "",
    followUpDate: "",
    callType: "",
    give_range:''
  });
  const [errors, setErrors] = useState({
    notes: "",
  });
 const dispatch = useDispatch<AppDispatch>();
useEffect(() => {
  if (selectedRow?.id) {
    setFormData((prev) => ({ ...prev, lead_id: selectedRow?.id }));
  }
}, [selectedRow]);
 const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "notes" && value.trim() !== "") {
      setErrors((prev) => ({ ...prev, notes: "" }));
    }
  };

   const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!formData.notes.trim()) {
      setErrors((prev) => ({ ...prev, notes: "Notes is required" }));
      hasError = true;
    }
    if (hasError) return;
    try {
    const resultAction = await dispatch(FollowupLeads(formData));
    const result = resultAction.payload;
    toast.success(" Leads Notes Add Successfully  ")
    setFollowupData(result);
    setFormData({
     lead_id:'',
    notes: "",
    followUpDate: "",
    callType: "",
  give_range:""
})
    setPlaceModal(false);
  } catch (error) {
    console.error("Follow-up submission failed:", error);
   
  }
  };


  return (
     <Modal
      size="xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      className="overflow-x-hidden"
    >
      <ModalHeader className="pb-0 text-center text-2xl font-bold text-gray-800">
        Follow-up Details
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notes */}
          <div>
            <Label htmlFor="notes" value="Notes" className="mb-1 block" />
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="What was discussed.."
              rows={4}
              className={`w-full ${
                errors.notes ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
             {errors.notes && (
              <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
            )}
          </div>
       <div className="">
            <Label htmlFor="give_range" value="Give Rate" />
            <TextInput
              id="give_range"
              style={{ borderRadius: '8px' }}
              value={formData.give_range}
              onChange={(e) => handleChange('give_range', e.target.value)}
              placeholder="Enter Rate"
             
            />
            
          </div>
          {/* Follow-up Date */}
          <div>
            <Label htmlFor="followUpDate" value="Follow-up Date" className="mb-1 block" />
            <input
              type="date"
              id="followUpDate"
              value={formData.followUpDate}
              onChange={(e) => handleChange("followUpDate", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            
            />
          </div>

          {/* Call Type */}
          <div>
            <Label htmlFor="callType" value="Call Type" className="mb-1 block" />
            <select
              id="callType"
              value={formData.callType}
              onChange={(e) => handleChange("callType", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Call Type</option>
              <option value="Call Received">Call Received</option>
              <option value="Not Receiveded">Not Receiveded</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-center px-6">
       
        <Button color="blue" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default FollowUpmodal
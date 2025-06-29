import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useEffect, useState } from "react";
type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
  followupdata:any
};

const ViewLeadmodal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
  followupdata
}: Props) => {
  const fields = [
    ["Name", selectedRow?.name],
    ["Email", selectedRow?.email],
    ["Status", selectedRow?.status],
    ["Phone", selectedRow?.phone],
    ["Source", selectedRow?.source],
    ["Material", selectedRow?.material],
    ["Quantity", selectedRow?.quantity],
    ["Unit", selectedRow?.unit],
    ["Size", selectedRow?.size],
    ["State", selectedRow?.state],
    ["District", selectedRow?.district],
    ["Tehsil", selectedRow?.tehsil],
    ["Address", selectedRow?.address],
  ];
  const [showFollowup, setShowFollowup] = useState([]);

useEffect(() => {
  if (!Array.isArray(followupdata) || !selectedRow?.id) {
    setShowFollowup([]);
    return;
  }

  const data = followupdata?.filter(item => item?.lead_id == selectedRow.id);
  setShowFollowup(data);
}, [followupdata, selectedRow]);

   
  return (
    <Modal
  size="5xl"
  show={placeModal}
  position={modalPlacement}
  onClose={() => setPlaceModal(false)}
  className="overflow-x-hidden"
>

  <ModalHeader className="pb-0 text-center text-2xl font-bold text-gray-800">
    Lead Details
  </ModalHeader>
  <ModalBody>

     <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="Leads View"
            icon={() => <Icon icon="solar:shield-user-outline" height={20} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-2">
        {fields.map(([label, value]) => (
          <div
            key={label}
            className="bg-gray-50 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500 font-semibold">{label}</p>
            <p className="text-base text-gray-800 mt-1 font-medium break-words">
              {value || "-"}
            </p>
          </div>
        ))}
      </div>
          </TabItem>
          <TabItem title="Notes View" icon={() => <Icon icon="solar:graph-linear" height={20} />}>
            <div className="space-y-4">
         

         {showFollowup?.length === 0 ? (
  <p className="text-gray-500">No follow-up data available.</p>
) : (
    <div className="overflow-x-auto my-2">
    <table className="min-w-full text-sm text-left text-gray-800 border border-gray-300">
      <thead className="bg-gray-100 text-xs uppercase text-gray-700">
        <tr>
          <th className="px-4 py-3 border">#</th>
          <th className="px-4 py-3 border">Notes</th>
          <th className="px-4 py-3 border">Follow-up Date</th>
          <th className="px-4 py-3 border">Call Type</th>
        </tr>
      </thead>
      <tbody>
        {showFollowup.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-4 py-2 border">{index + 1}</td>
            <td className="px-4 py-2 border break-words">{item.notes}</td>
            <td className="px-4 py-2 border">{item.followUpDate || "-"}</td>
            <td className="px-4 py-2 border capitalize">{item.callType}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        </div>
    
          </TabItem>
          </Tabs>
    <div className="rounded-lg  n px-2">
     

       <div className="bg-white shadow rounded p-4">
     
       
    </div>

    </div>
  </ModalBody>
  <ModalFooter className="justify-center">
    <Button color="gray" onClick={() => setPlaceModal(false)}>
      Close
    </Button>
  </ModalFooter>
</Modal>
  );
};

export default ViewLeadmodal;

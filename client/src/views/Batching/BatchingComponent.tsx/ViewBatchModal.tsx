import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;

};

const ViewBatchModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
 
}: Props) => {

 const fields = [
  ["Mould No", selectedRow?.mould_no],
  ["Operator Name", selectedRow?.operator_name],
  ["Shift", selectedRow?.shift],
  ["Batch Date",selectedRow?.batch_date ], // format if needed
  ["Entry Time", selectedRow?.entry_time ?  new Date(`1970-01-01T${selectedRow?.entry_time}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) : '-'], // format if needed

  ["Slurry Waste (kg)", selectedRow?.slurry_waste],
  ["Slurry Fresh (kg)", selectedRow?.slurry_fresh],
  ["Cement Qty (kg)", selectedRow?.cement_qty],
  ["Lime Qty (kg)", selectedRow?.lime_qty],
  ["Gypsum Qty (kg)", selectedRow?.gypsum_qty],

  ["Soluble Oil Qty (kg)", selectedRow?.soluble_oil_qty],
  ["Aluminium Powder (gm)", selectedRow?.aluminium_qty],
  ["Density (kg/m³)", selectedRow?.density],
  ["Flow Value", selectedRow?.flow_value],
  ["Temperature (°C)", selectedRow?.temperature],
  ["Water Consume", selectedRow?.density],
  ["Dicromate", selectedRow?.disromate],
  ["Mixing Time", selectedRow?.mixing_time? new Date(`1970-01-01T${selectedRow?.mixing_time}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) : '-'],

  ["Hardener Qty", selectedRow?.hardener_qty],
  ["Mould Oil Qty", selectedRow?.mould_oil_qty],
  ["Remark", selectedRow?.remark],
];


   
  return (
    <Modal
  size="5xl"
  show={placeModal}
  position={modalPlacement}
  onClose={() => setPlaceModal(false)}
  className="overflow-x-hidden"
>

  <ModalHeader className="pb-0 text-center text-2xl font-bold text-gray-800">
    Batching  Details
  </ModalHeader>
  <ModalBody>

     <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="Batching View"
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

export default ViewBatchModal;

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { TabItem, Tabs } from "flowbite-react";
import { Icon } from "@iconify/react";
import { formatTime } from "src/utils/Datetimeformate";
import { format } from "date-fns";
import { imageurl } from "src/constants/contant";

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const DispatchView = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
}: Props) => {
  const fields = [
    ["Driver Name", selectedRow?.driver_name],
    ["Vehicle Number", selectedRow?.vehicle_number],
    ["Delivery Area", selectedRow?.delivery_area],
    ["Transport Name", selectedRow?.transport_name],
    ["Driver Number", selectedRow?.driver_number],
    ["Invoice Number", selectedRow?.invoice_number],
    ["Eway Bill Number", selectedRow?.eway_bill_number],
    ["Eway Bill Expiry", selectedRow?.eway_bill_expiry ? format(new Date(selectedRow?.eway_bill_expiry), "dd-MM-yyyy") : "-"],
    ["Material Details", selectedRow?.material_details],
    ["Quantity", selectedRow?.quantity],
    ["Size", selectedRow?.size],
    ["Quality Check", selectedRow?.quality_check],
    ["Person Responsible", selectedRow?.person_responsible],
    ["Time", formatTime(selectedRow?.time)],
    ["Date", selectedRow?.date ? format(new Date(selectedRow?.date), "dd-MM-yyyy") : "-"],
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
        Dispatch Details
      </ModalHeader>
      <ModalBody>
        <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="Dispatch View"
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
              {selectedRow?.loading_picture && (
                <div className="bg-gray-50 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm text-gray-500 font-semibold">Loading Picture</p>
                  <img
                    src={imageurl + selectedRow?.loading_picture }
                    alt="Loading"
                    className="mt-2 rounded-md  h-20 object-contain border"
                  />
                </div>
              )}
            </div>
          </TabItem>
        </Tabs>
      </ModalBody>
      <ModalFooter className="justify-center">
        <Button color="gray" onClick={() => setPlaceModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DispatchView;

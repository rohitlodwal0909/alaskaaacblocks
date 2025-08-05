import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { TabItem, Tabs } from "flowbite-react";
import { Icon } from "@iconify/react";


type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const MaterialView = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
}: Props) => {
  const fields = [
    ["Mould Oil", selectedRow?.mould_oil],
    ["Slurry Waste", selectedRow?.slurry_waste],
    ["Slurry Fresh", selectedRow?.slurry_fresh],
    ["Cement", selectedRow?.cement],
    ["Lime", selectedRow?.lime],
    ["Gypsum", selectedRow?.gypsum],
    ["Soluble Oil", selectedRow?.soluble_oil],
    ["Aluminium", selectedRow?.aluminium],
    ["Density", selectedRow?.density],
    ["Flow Value", selectedRow?.flow_value],
    // ["Created At", selectedRow?.created_at ? format(new Date(selectedRow?.created_at), "dd-MM-yyyy HH:mm") : "-"],
    // ["Updated At", selectedRow?.updated_at ? format(new Date(selectedRow?.updated_at), "dd-MM-yyyy HH:mm") : "-"],
    // ["Deleted At", selectedRow?.deleted_at ? format(new Date(selectedRow?.deleted_at), "dd-MM-yyyy HH:mm") : "-"],
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
        Material Details
      </ModalHeader>
      <ModalBody>
        <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="Material View"
            icon={() => <Icon icon="fluent-mdl2:product" height={20} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-2">
              {fields.map(([label, value]) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-gray-500 font-semibold">{label}</p>
                  <p className="text-base text-gray-800 mt-1 font-medium break-words">
                    {value ?? "-"}
                  </p>
                </div>
              ))}
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

export default MaterialView;

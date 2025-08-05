import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { TabItem, Tabs } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import ComonDeletemodal from '../../../utils/deletemodal/ComonDeletemodal'
import { deleteMaterial } from "src/features/Material/MaterialSlice";
import { GetReceiving } from "src/features/Receiving/ReceivingSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import EditMaterialModal from "src/views/Material/MaterialComponent.tsx/EditMaterialModal";

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
  logindata:any
};

const ReceivingView = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
  logindata
}: Props) => {
const data = selectedRow?.materials?.length > 0 ? selectedRow.materials[0] : {};
  const fields = [
    ["Supplier Name", selectedRow?.supplier_name],
    ["Vehicle No", selectedRow?.vehical_no],
    ["Invoice No", selectedRow?.invoice_no],
    ["Received By", selectedRow?.received_by],
    ["Date", selectedRow?.date],
    // ["Created At", selectedRow?.created_at ? format(new Date(selectedRow?.created_at), "dd-MM-yyyy HH:mm") : "-"],
    // ["Updated At", selectedRow?.updated_at ? format(new Date(selectedRow?.updated_at), "dd-MM-yyyy HH:mm") : "-"],
    // ["Deleted At", selectedRow?.deleted_at ? format(new Date(selectedRow?.deleted_at), "dd-MM-yyyy HH:mm") : "-"],
  ];
  const [deletemodal , setDeletemodal] = useState(false)
  const [editmodal , setEditmodal] = useState(false)
const fields2 = [
   ["Mould Oil (ltr)", data?.mould_oil],
    ["Slurry Waste (ltr)", data?.slurry_waste],
    ["Slurry Fresh (ltr)", data?.slurry_fresh],
    ["Cement (kg)", data?.cement],
    ["Lime (kg)", data?.lime],
    ["Gypsum (kg)", data?.gypsum],
    ["Soluble Oil (ltr)", data?.soluble_oil],
    ["Aluminium Powder (gm)", data?.aluminium],
    ["Density  (kg/m³)", data?.density],
    ["Flow Value", data?.flow_value],
]

const dispatch  = useDispatch<AppDispatch>()

  const handleDelete = async () => {
    if (!data) return;
    try {
      await dispatch(deleteMaterial(data?.id)).unwrap();
      dispatch(GetReceiving());
      toast.success("The material  was successfully deleted. ");
      setPlaceModal(false)
    } catch (error: any) {
      console.error("Delete failed:", error);
      if (error?.response?.status === 404) toast.error("User not found.");
      else if (error?.response?.status === 500) toast.error("Server error. Try again later.");
      else toast.error("Failed to delete user.");
    }
  }
  return (
    <Modal
      size="5xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      className="overflow-x-hidden"
    >
      <ModalHeader className="pb-0 text-center text-2xl font-bold text-gray-800">
        Receiving Stock  Details
      </ModalHeader>
      <ModalBody>
        <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="Receiving Stock"
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
           <TabItem
            active
            title="Material Stock"
            icon={() => <Icon icon="fluent-mdl2:product" height={20} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-2">
              {fields2.map(([label, value]) => (
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
            <div className="flex gap-3">

              <Button color="success" onClick={() => setEditmodal(true)}>
          Edit
        </Button>
              <Button color="error" onClick={() => setDeletemodal(true)}>
          Delete
        </Button>
            </div>
          </TabItem>
        </Tabs>
          <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deletemodal}
        setIsOpen={setDeletemodal}
        selectedUser={selectedRow}
        title="Are you sure you want to Delete this Material ?"
      />
  
       <EditMaterialModal show={editmodal} setShowmodal={setEditmodal} Material={data} logindata={logindata} setPlaceModal={setPlaceModal} />
      </ModalBody>
      <ModalFooter className="justify-center">
        <Button color="gray" onClick={() => setPlaceModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ReceivingView;

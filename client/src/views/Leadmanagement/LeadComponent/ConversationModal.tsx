import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

type Props = {
  openModal: boolean;
  modalPlacement: string;
  setopenModal: (value: boolean) => void;
  selectedRow: any;
  followupdata: any;
};

const ConversationModal = ({
  openModal,
  modalPlacement,
  setopenModal,
  selectedRow,
  followupdata,
}: Props) => {
  const [showFollowup, setShowFollowup] = useState<any[]>([]);

  useEffect(() => {
    if (!Array.isArray(followupdata) || !selectedRow?.id) {
      setShowFollowup([]);
      return;
    }

    const data = followupdata?.filter(
      (item) => item?.lead_id == selectedRow.id
    );
    setShowFollowup(data);
  }, [followupdata, selectedRow]);

  return (
    <Modal
      size="5xl"
      show={openModal}
      position={modalPlacement}
      onClose={() => setopenModal(false)}
      className="overflow-x-hidden"
    >
      <ModalHeader className="pb-0 text-center text-2xl font-bold text-blue-700">
        Lead Conversation By  {selectedRow?.name}
      
      </ModalHeader>
      <ModalBody>
        
            <div className="space-y-4">
              {showFollowup?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Icon
                    icon="mdi:message-off-outline"
                    className="text-gray-400 mb-2"
                    height={40}
                  />
                  <p className="text-gray-600 font-medium">
                    No conversations have been recorded yet for{" "}
                    <span className="text-blue-600">{selectedRow?.name}</span>.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto my-2">
                  <table className="min-w-full text-sm text-left text-gray-800 border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-blue-50 text-xs uppercase text-blue-800">
                      <tr>
                        <th className="px-4 py-3 border">#</th>
                        <th className="px-4 py-3 border">Notes</th>
                        <th className="px-4 py-3 border">Follow-up Date</th>
                        <th className="px-4 py-3 border">Call Type</th>
                        <th className="px-4 py-3 border">Quantity</th>
                        <th className="px-4 py-3 border">Size</th>
                        <th className="px-4 py-3 border">Give Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showFollowup.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          <td className="px-4 py-2 border font-medium text-gray-700">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2 border break-words">
                            {item.notes || "-"}
                          </td>
                          <td className="px-4 py-2 border">
                            {item.followUpDate || "-"}
                          </td>
                          <td className="px-4 py-2 border capitalize">
                            {item.callType || "-"}
                          </td>

                          {/* Quantity */}
                          <td className="px-4 py-2 border">
                            {(() => {
                              let data = item.quantity;
                              if (
                                typeof data === "string" &&
                                data.startsWith("[")
                              ) {
                                try {
                                  data = JSON.parse(data);
                                } catch {
                                  data = [data];
                                }
                              }
                              if (!Array.isArray(data)) data = [data];
                              return data.map((val, i) => (
                                <div key={i}>{i + 1}. {val}</div>
                              ));
                            })()}
                          </td>

                          {/* Size */}
                          <td className="px-4 py-2 border">
                            {(() => {
                              let data = item.size;
                              if (
                                typeof data === "string" &&
                                data.startsWith("[")
                              ) {
                                try {
                                  data = JSON.parse(data);
                                } catch {
                                  data = [data];
                                }
                              }
                              if (!Array.isArray(data)) data = [data];
                              return data.map((val, i) => (
                                <div key={i}>{i + 1}. {val}</div>
                              ));
                            })()}
                          </td>

                          {/* Give Range */}
                          <td className="px-4 py-2 border">
                            {(() => {
                              let data = item.give_range;
                              if (
                                typeof data === "string" &&
                                data.startsWith("[")
                              ) {
                                try {
                                  data = JSON.parse(data);
                                } catch {
                                  data = [data];
                                }
                              }
                              if (!Array.isArray(data)) data = [data];
                              return data.map((val, i) => (
                                <div key={i}>{i + 1}. {val}</div>
                              ));
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          
      </ModalBody>

      <ModalFooter className="justify-center">
        <Button color="blue" onClick={() => setopenModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConversationModal;

import { useState, useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput, FileInput } from 'flowbite-react';
import { IconUser, IconMail, IconLock } from "@tabler/icons-react";
import { IconEye, IconEyeOff } from '@tabler/icons-react';
const Editusermodal = ({ setEditModal, modalPlacement, editModal, selectedUser, onUpdateUser }) => {
  // 1. Set form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
  });
  const sourceOptions = [
    { id: "Facebook Ads", label: "Facebook Ads" },
    { id: "Google Ads", label: "Google Ads" },
    { id: "Referral", label: "Referral" },
    { id: "Website Form", label: "Website Form" },
    { id: "Other", label: "Other" },
  ];



  // 2. Load selectedUser data into form
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        phone: selectedUser.phone || "", // Leave empty or mask for security
        source: selectedUser?.source || "",
        // You may prefill with URL if needed
      });
    }
  }, [selectedUser]);

  // 3. Handle changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // 4. Handle submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser?.id) return;

    const updatedUser = {
      ...selectedUser,
      name: formData.name,
      email: formData.email,
      source: formData.source,
      phone: formData.phone,

    };

    // Call parent handler or dispatch Redux thunk
    onUpdateUser(updatedUser);

    // Close modal
    setEditModal(false);
  };

  return (
    <Modal show={editModal} position={modalPlacement} onClose={() => setEditModal(false)} className="large">
      <ModalHeader className="pb-0">Edit Lead</ModalHeader>
      <ModalBody className="overflow-auto max-h-[100vh]">
        <form className="grid grid-cols-6 gap-3" onSubmit={handleEditSubmit}>
          {/* Name */}
          <div className="col-span-12">
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              name="name"
              type="text"
              rightIcon={() => <IconUser size={20} />}
              className="form-control "
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="col-span-12">
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              name="email"
              type="email"
              rightIcon={() => <IconMail size={20} />}

              className="form-control "
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="col-span-12">
            <Label htmlFor="Phone" value="Phone" />
            <div className="">
              <TextInput
                id="Phone"
                type={'numbers'}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                sizing="md"
                className="form-control "

              />
              {/* Interactive Icon Positioned Over Right Side */}

            </div>

          </div>

          {/* Role */}
          <div className="col-span-12">
            <Label htmlFor="role" value="Source" />
            <select

              name="source"
              value={formData.source} // should be a number: 1, 2, or 3
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"

            >
              <option value="" disabled>
                Select Source
              </option>
              {sourceOptions.map((source) => (
                <option value={source?.id}>
                  {source?.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}


          {/* Buttons */}
          <div className="col-span-12 flex justify-end items-center gap-[1rem]">
            <Button type="reset" color="error" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

export default Editusermodal;

import { useState, useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { IconUser, IconMail} from "@tabler/icons-react";
import { IconEye, IconEyeOff } from '@tabler/icons-react';
const Editusermodal = ({ setEditModal, modalPlacement, editModal, selectedUser, onUpdateUser }) => {
  // 1. Set form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "",
   
  });
  const roleOptions = [
  { id: "1", label: "Manager" },
  { id:"2", label: "Employee" },
  { id: "3", label: "Guard" },
];
   const [showPassword, setShowPassword] = useState(false);


  // 2. Load selectedUser data into form
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || "",
        email: selectedUser.email || "",
        password: "", // Leave empty or mask for security
        role_id: selectedUser?.role_id || "",
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
      username: formData.username,
      email: formData.email,
      role_id: formData.role_id,
      password: formData.password,
      
    };

    // Call parent handler or dispatch Redux thunk
    onUpdateUser(updatedUser);

    // Close modal
    setEditModal(false);
  };

  return (
    <Modal show={editModal} position={modalPlacement} onClose={() => setEditModal(false)} className="large">
      <ModalHeader className="pb-0">Edit User</ModalHeader>
      <ModalBody className="overflow-auto max-h-[100vh]">
        <form className="grid grid-cols-6 gap-3" onSubmit={handleEditSubmit}>
          {/* Name */}
          <div className="col-span-12">
            <Label htmlFor="name" value="Username" />
            <TextInput
              id="name"
              name="name"
              type="text"
              rightIcon={() => <IconUser size={20} />}
              placeholder="Enter name"
   
              value={formData.username}
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
              placeholder="name@domain.com"
            
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="col-span-12">
            <Label htmlFor="password" value="Password" />
               <div className="relative">
                      <TextInput
                        id="userpwd"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                       onChange={handleChange}
                        sizing="md"
                        className="form-control "
                       
                      />
                      {/* Interactive Icon Positioned Over Right Side */}
                      <div
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                      </div>
                    </div>
          
          </div>

          {/* Role */}
          <div className="col-span-12">
            <Label htmlFor="role" value="Role" />
          <select
  id="role_id"
  name="role_id"
  value={formData.role_id} // should be a number: 1, 2, or 3
  onChange={handleChange}
  className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
 
>
  <option value="" disabled>
    Select Role
  </option>
  {roleOptions.map((role) => (
    <option key={role.id} value={role.id}>
      {role.label}
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

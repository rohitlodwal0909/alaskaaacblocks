import { Button, Checkbox, Label, TextInput, Toast } from "flowbite-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Authenticationmodule } from "src/features/authentication/AuthenticationSlice";
import { IconEye, IconEyeOff } from '@tabler/icons-react';

const AuthLogin = ({ }) => {
  const [formData, setFormData] = useState({
  email: '',
  password: '',
});
const [showPassword, setShowPassword] = useState(false);
const dispatch = useDispatch()
const navigate = useNavigate()
const [errors, setErrors] = useState({});
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  setErrors((prev) => ({ ...prev, [name]: '' }));
};
const validateForm = () => {
  const newErrors = {};
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.password) newErrors.password = 'Password is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    try {
      const result = await dispatch(Authenticationmodule(formData)).unwrap();

       toast.success(result?.message || "Login successful");
        localStorage.setItem("logincheck", JSON.stringify(result));
        const localdata = JSON.parse(localStorage.getItem('logincheck') || '{}');
        if(localdata){
          navigate("/");
        }
    } catch (error) {
      // error = object from rejectWithValue
      const errorMsg = error?.message;
     
      if (errorMsg == "Invalid Email") {
        toast.error("Invalid Email");
      } else if (errorMsg == "Invalid Password") {
        toast.error("Invalid Password");
      } else {
        toast.error(errorMsg || "Server Error. Please try again later.");
      }
    }
  }
};

  return (
    <>
     <form className="mt-6" onSubmit={handleSubmit}>
  {/* Email */}
   <div className="mb-4">
    <Label htmlFor="email" value="Email" />
    <TextInput
      id="email"
      type="email"
      name="email"
      value={formData.email}
      onChange={handleInputChange}
      sizing="md"
      color={errors.email ? 'failure' : 'gray'}
      className="form-control"
      helperText={errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
    />
  </div>

  {/* Password */}
  <div className="mb-4">
    <Label htmlFor="userpwd" value="Password" />
     <div className="relative">
      <TextInput
        id="userpwd"
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        sizing="md"
        color={errors.password ? 'failure' : 'gray'}
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
     {errors.password && (
  <div className="text-red-500 text-xs mt-1">{errors.password}</div>
)}
  </div>

  {/* Remember & Forgot */}
  <div className="flex justify-between my-5">
    <div className="flex items-center gap-2">
      <Checkbox id="accept" className="checkbox" />
      <Label htmlFor="accept" className="opacity-90 font-normal cursor-pointer">
        Remember this Device
      </Label>
    </div>
    <Link to="/admin/forgot-password" className="text-primary text-sm font-medium">
      Forgot Password?
    </Link>
  </div>

  {/* Submit Button */}
  <Button color="primary" type="submit" className="w-full">
    Sign in
  </Button>
</form>

    </>
  );
};

export default AuthLogin;

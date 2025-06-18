
import { Link, useNavigate } from "react-router";
import Logo from "src/layouts/full/shared/logo/Logo";
import AuthLogin from "../authforms/AuthLogin";
// import SocialButtons from "../authforms/SocialButtons";
import LeftSidebarPart from "../LeftSidebarPart";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Authenticationmodule } from "src/features/authentication/AuthenticationSlice";
import { toast } from "react-toastify";

const Login = () => {

  const dispatch = useDispatch();
 const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  //  useEffect(() => {
  //   dispatch(Authenticationmodule()).then((res) => {
  //     if (res.payload) {
  //       console.log(res.payload)
  //       localStorage.setItem("logincheck", "true")
  //       navigate("/");
  //     } else {
  //       toast.error("Invalid email or password");
  //     }
  //   });
  // },[]);

   const handleLogin = (e) => {
    e.preventDefault();
     dispatch(Authenticationmodule()).then((res) => {
      if (res.payload) {
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    });
  };
  return (
    <>
      <div className="relative overflow-hidden h-screen">
        <div className="grid grid-cols-12 gap-3 h-screen bg-white dark:bg-darkgray">
          <div className="xl:col-span-4 lg:col-span-4 col-span-12 bg-dark lg:block hidden relative overflow-hidden">
            <LeftSidebarPart />
          </div>
          <div className="xl:col-span-8 lg:col-span-8 col-span-12 sm:px-12 px-4">
            <div className="flex h-screen items-center px-3 lg:justify-start justify-center">
              <div className="max-w-[420px] w-full mx-auto">
                <Logo />
                <h3 className="text-2xl font-bold my-3">Sign In</h3>
                <p className="text-darklink text-sm font-medium">
                  Alaska AAC Blocks Dashboard
                </p>
                {/* <SocialButtons title="or sign in with" /> */}
                <AuthLogin  handleSubmit={handleLogin} formData={formData} handleInputChange={handleInputChange}/>
                <div className="flex gap-2 text-base text-ld font-medium mt-6 items-center justify-center">
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

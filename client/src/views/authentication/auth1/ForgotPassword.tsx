
import Logo from "src/layouts/full/shared/logo/Logo";
import LeftSidebarPart from "../LeftSidebarPart";
import { Button } from "flowbite-react";
import AuthForgotPassword from "../authforms/AuthForgotPassword";
import { Link } from "react-router";
;


const ForgotPassword = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen">
        <div className="grid grid-cols-12 gap-3 h-screen bg-white dark:bg-darkgray">
          <div className="xl:col-span-4 lg:col-span-4 col-span-12 bg-dark lg:block hidden relative overflow-hidden">
            <LeftSidebarPart />
          </div>
          <div className="xl:col-span-8 lg:col-span-8 col-span-12 sm:px-12 px-4">
            <div className="flex h-screen items-center px-3 max-w-[460px] mx-auto">
              <div className="w-full">
                <Logo />
                <h3 className="text-2xl font-bold my-3">Forgot Password</h3>
                <p className="text-darklink text-sm font-medium">
                  Please enter the email address associated with your account
                  and We will email you a link to reset your password.
                </p>
                <AuthForgotPassword />
                <Button
                  color={"lightprimary"}
                  as={Link}
                  to="/admin/login"
                  className="w-full mt-4"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

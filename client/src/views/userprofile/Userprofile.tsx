import React from "react";
import { Button, Label, TextInput } from "flowbite-react";
interface UserProfileProps {
  initialData: {
    username: string;
    email: string;
    role: string;
  };
}
import userImg from "../../../src/assets/images/profile/user-1.jpg"
import CardBox from "src/components/shared/CardBox";
const UserProfile: React.FC<UserProfileProps> = () => {

  return (
   <>
         <div className="grid grid-cols-12 lg:gap-y-30 lg:gap-x-30 gap-y-30 gap-x-0">
         <div className="col-span-12">
          <CardBox>
            <div className="mx-auto text-center mt-5">
              <img
                src={userImg}
                alt="logo"
                height="120"
                width="120"
                className="rounded-full mx-auto"
              />
              <div className="flex justify-center gap-3 ">
                <TextInput color={"primary"} className="hidden"  type="file"/>
              </div>
            
            </div>
             <h5 className="card-title text-center py-3">User Profile Details</h5>
            {/* <p className="card-subtitle -mt-1">
              To change your personal detail , edit and save from here
            </p> */}
            <div className="grid grid-cols-12 gap-6">
                
              <div className="md:col-span-6 col-span-12">

                <div className="flex flex-col gap-3 mt-3">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="ynm" value=" User Name" />
                    </div>
                    <TextInput
                      id="ynm"
                      type="text"
                      sizing="md"
                  
                      className="form-control"
                    />
                  </div>
                
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="ynm" value="Email" />
                    </div>
                    <TextInput
                      id="em"
                      type="email"
                      placeholder="info@MatDash.com"
                      sizing="md"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-6 col-span-12">
                <div className="flex flex-col gap-3 mt-3">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="store" value="Role" />
                    </div>
                    <TextInput
                      id="store"
                      type="text"
                      sizing="md"
                    
                      className="form-control"
                    />
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="ph" value="Phone" />
                    </div>
                    <TextInput
                      id="ph"
                      type="text"
                      sizing="md"
                      placeholder="+91 1234567895"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-12 -mt-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="add" value="Address" />
                  </div>
                  <TextInput
                    id="add"
                    type="text"
                    sizing="md"
                    placeholder="814 Howard Street, 120065, India"
                    className="form-control "
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-5">
              <Button color={"primary"}>Save</Button>
              <Button color={"lighterror"}>Cancel</Button>
            </div>
          </CardBox>
        </div>
      </div>
   </>
  );
};

export default UserProfile;

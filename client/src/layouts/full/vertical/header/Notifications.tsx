
import { Icon } from "@iconify/react";
import { Badge, Button, Dropdown } from "flowbite-react";
import * as Notification from "./Data";
import SimpleBar from "simplebar-react";
import { Link, Links, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Avatar } from 'flowbite-react';
import notificationicon from '../../../../assets/images/logos/notification2.png'
import notificationicon2 from '../../../../assets/images/logos/notification.png'
import { useDispatch, useSelector } from "react-redux";
import { GetNotification, ReadNotification } from "src/features/Notifications/NotificationSlice";
import { toast } from "react-toastify";
import { useRef } from "react";
const Notifications = () => {
  const notifications = useSelector((state: any) => state.notifications.notificationData);
  const [notificationList, setNotificationList] = useState(notifications||[]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
      const dispatch = useDispatch()
      useEffect(() => {
         const fetchnotification = async () => {
           try {
             await dispatch(GetNotification()).unwrap(); // unwrap makes it throw on error
           } catch (error) {
             toast.error(error || "Failed to fetch leads"); // or use alert or console
            //  console.error("Error fetching leads:", error);
           }
         };
         fetchnotification();
       }, []);
 
       useEffect(() => {
  if (notifications) {
    setNotificationList(notifications);
  }
}, [notifications]);

 const handleSeeAllClick = () => {
    // ✅ Optional: simulate click outside to close dropdown (if needed)
    document.body.click();
    navigate("/notifications");
  };

 const handleRead = async (id) => {
  try {
    const result = await dispatch(ReadNotification(id)).unwrap(); // sends ID to backend
    if (result) {
      const updated = notificationList.map((item) =>
        item.id === id ? result : item
      );
      setNotificationList(updated);
    }
  } catch (error) {
    toast.error("Failed to update notification");
    console.error(error);
  }
};

  // ✅ Filter only unread for display;
  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        
        className="w-screen sm:w-[360px] py-6  rounded-sm"
        dismissOnClick={false}
        
          renderTrigger={() => (
          <div className="relative" >
            <span className="h-10 w-10 hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
              <Icon icon="solar:bell-bing-line-duotone" height={20} />
            </span>
            <span className="rounded-full absolute end-1 top-1 bg-error text-[10px] h-4 w-4 flex justify-center items-center text-white">
           {notificationList?.filter((items)=> items?.is_read ==0).length}
            </span>
          </div>
          )}
        >
        <div className="flex items-center px-6 justify-between">
          <h3 className="mb-0 text-lg font-semibold text-ld">Notifications</h3>
          <Badge color={"primary"}>{notificationList?.filter((items)=> items?.is_read ==0).length}</Badge>
        </div>

        <SimpleBar className="max-h-80 mt-3">
          {notificationList?.map((links, index) => (
            <Dropdown.Item
              // as={Link}
//           to={{
//   pathname: "/notifications",
//   state: { id: links?.id } 
// }}
              className="px-6 py-3 flex justify-between items-center bg-hover group/link w-full"
              key={index}
              onClick={() => handleRead(links?.id)}
            >
              <div className="flex items-center w-full">
                <div
                  className={`h-11 w-11 flex-shrink-0 rounded-full flex justify-center items-center ${links.bgcolor}`}
                >
                  <Avatar
                    img={links.is_read == 0 ? notificationicon : notificationicon2}
                    rounded
                    status={links.is_read == 0 ? "online" : 'busy'}
                    statusPosition="bottom-right"
                 
                  />
                </div>

                <div className="ps-4 flex justify-between w-full">
                  <div className="w-3/4 text-start">
                    <h5
                      className={`mb-1 text-sm ${links.is_read == 0
                          ? "text-gray-900 font-semibold"
                          : "text-gray-500 font-normal"
                        } group-hover/link:text-primary`}
                    >
                      {links.title}
                    </h5>
                    <div
                      className={`text-xs line-clamp-1 ${links.is_read == 0 ? "text-gray-800 font-medium" : "text-gray-400"
                        }`}
                    >
                      {links.message}
                    </div>
                  </div>
{links.date_time && (
  <div>
    <div className="text-xs block self-start pt-1.5">
      {new Date(links.date_time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}
    </div>
    <div className="text-xs block self-start pt-0.5 text-gray-500">
      {new Date(links.date_time).toLocaleDateString()}
    </div>
  </div>
)}
                 
                </div>
              </div>
            </Dropdown.Item>
          ))}
        </SimpleBar>
        <div className="pt-5 px-6">
          <Button
            color={"primary"}
            className="w-full border border-primary text-primary hover:bg-primary hover:text-white"
            pill
            outline
           onClick={handleSeeAllClick} 
          >
            See All Notifications
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Notifications;

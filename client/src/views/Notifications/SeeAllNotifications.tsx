
import {  useLocation} from "react-router"
import { useEffect, useState } from "react";
import { Avatar } from 'flowbite-react';
import notificationicon from '../../assets/images/logos/notification2.png'
import notificationicon2 from '../../assets/images/logos/notification.png'
import { GetNotification, ReadNotification } from "src/features/Notifications/NotificationSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import CardBox from 'src/components/shared/CardBox';
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";
import { AppDispatch } from 'src/store';
const SeeAllNotifications = () => {

     const notifications = useSelector((state: any) => state.notifications.notificationData);
     const [notificationList, setNotificationList] = useState(notifications||[]);
      const dispatch = useDispatch<AppDispatch>()
const location =useLocation()
const notificationId = location.key;

      useEffect(() => {
         const fetchnotification = async () => {
           try {
             await dispatch(GetNotification()).unwrap(); // unwrap makes it throw on error
           } catch (error) {
             toast.error(error || "Failed to fetch leads"); // or use alert or console
            //  console.error("Error fetching leads:", error);
           }
         };
         if(notificationId || location.state === null){
         fetchnotification();
         }
         fetchnotification();
       }, [dispatch, notificationId]);
 
       useEffect(() => {
  if (notifications) {
    setNotificationList(notifications);
  }
}, [notifications]);
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

   


 
  return (
      <div > 
         
           <BreadcrumbComp    items={[{ title: "Notifications", to: "/" }]}
                  title="Notifications"/>
         
          {/* <Badge color={"primary"}>{notificationList?.filter((items)=> items?.is_read ==0).length}</Badge> */}
         <CardBox>
         <ul className="w-full  rounded-sm" >
         {notificationList.map((links) => (
                <li
                  // as={Link}
                  // to="#"
                  
                     onClick={() => handleRead(links.id)}
                  className={`px-6 py-3 cursor-pointer flex justify-between items-center w-full hover:bg-gray-100`}
                  key={links.id}
                >
                  <div className="flex items-center w-full">
                    <div
                      className={`h-11 w-11 flex-shrink-0 rounded-full flex justify-center items-center ${links.bgcolor} `}
                    >
                       <Avatar
  img={ links.is_read == 0 ?    notificationicon:notificationicon2}
  rounded
  status={links.is_read == 0 ?"online":'busy'}
  statusPosition="bottom-right"
 // 👈 controls the image size
/>
                      {/* <Icon icon='basil:notification-on-outline' className="text-blue-500" /> */}
                    </div>
                    <div className="ps-4 flex justify-between w-full">
                      <div className="w-3/4 text-start">
                        <h5     className={`mb-1 text-sm ${
                      links.is_read == 0
                        ? "text-gray-900 font-semibold"
                        : "text-gray-500 font-normal"
                      } group-hover/link:text-primary`}>
                          {links.title}
                        </h5>
                        <div className="text-xs text-darklink line-clamp-1">
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
                </li>
              ))}
              
              </ul>
              
              </CardBox></div>
  )
}

export default SeeAllNotifications
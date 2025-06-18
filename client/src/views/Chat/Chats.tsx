
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";
import ChatsApp from "./ChatComponent/ChatsApp";





const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Chat",
  },
];
const Chats = () => {
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Chat", to: "/" }]}
        title="Chat"/>
       <ChatsApp />
    </>
  );
};

export default Chats;

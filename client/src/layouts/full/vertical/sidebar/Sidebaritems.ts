export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  

  // {
  //   id: 2,
  //   name: "Dashboard",
  //   items: [
  //     {
  //       heading: "Dashboard",
  //       children: [
  //         {
  //           name: "Chat",
  //           icon: "carbon:report",
  //           id: uniqueId(),
  //           url: "/chats",
  //         },
  //         {
  //           name: "Permission",
  //           icon: "arcticons:permissionsmanager",
  //           id: uniqueId(),
  //           url: "/permission",
  //         }
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 2,
  //   name: "Menu",
  //   items: [
  //     {
  //       heading: "Multi level",
  //       children: [
  //         {
  //           name: "Menu Level",
  //           icon: "solar:widget-add-line-duotone",
  //           id: uniqueId(),
  //           children: [
  //             {
  //               id: uniqueId(),
  //               name: "Level 1",
  //               url: "",
  //             },
  //             {
  //               id: uniqueId(),
  //               name: "Level 1.1",
  //               icon: "fad:armrecording",
  //               url: "",
  //               children: [
  //                 {
  //                   id: uniqueId(),
  //                   name: "Level 2",
  //                   url: "",
  //                 },
  //                 {
  //                   id: uniqueId(),
  //                   name: "Level 2.1",
  //                   icon: "fad:armrecording",
  //                   url: "",
  //                   children: [
  //                     {
  //                       id: uniqueId(),
  //                       name: "Level 3",
  //                       url: "",
  //                     },
  //                     {
  //                       id: uniqueId(),
  //                       name: "Level 3.1",
  //                       url: "",
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       heading: "More Options",
  //       children: [
  //         {
  //           id: uniqueId(),
  //           url: "/sample-page",
  //           name: "Applications",
  //           icon: "solar:check-circle-bold",
  //           color: "text-primary",
  //         },
  //         {
  //           id: uniqueId(),
  //           url: "",
  //           name: "Form Options",
  //           icon: "solar:check-circle-bold",
  //           color: "text-secondary",
  //         },
  //         {
  //           id: uniqueId(),
  //           url: "",
  //           name: "Table Variations",
  //           icon: "solar:check-circle-bold",
  //           color: "text-info",
  //         },
  //         {
  //           id: uniqueId(),
  //           url: "",
  //           name: "Charts Selection",
  //           icon: "solar:check-circle-bold",
  //           color: "text-warning",
  //         },
  //         {
  //           id: uniqueId(),
  //           url: "",
  //           name: "Widgets",
  //           icon: "solar:check-circle-bold",
  //           color: "text-success",
  //         },
  //       ],
  //     },
  //   ],
  // },
   {
    id: 1,
    name: "Lead management",
    items: [
      {
        heading: "Lead management",
        children: [
          {
            name: "Leads",
            icon: "ph:user-circle-check-thin",
            id: uniqueId(),
            url: "/lead-managment/leads",
          },
          // {
          //   name: "Sample page 2",
          //   icon: "basil:app-store-outline",
          //   id: uniqueId(),
          //   url: "/",
          // },
          //  {
          //   name: "Sample page 3",
          //   icon: "token:qrdo",
          //   id: uniqueId(),
          //   url: "/",
          // }
         
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Authentiction",
    items: [
      {
        heading: "Authentiction",
        children: [
          {
            name: "Login",
            icon: "solar:login-2-line-duotone",
            id: uniqueId(),
            url: "/admin/login",
          },
          {
            name: "Sign Up",
            icon: "solar:login-2-line-duotone",
            id: uniqueId(),
            url: "/admin/register",
          }
         
        ],
      },
    ],
  },
];

export default SidebarContent;

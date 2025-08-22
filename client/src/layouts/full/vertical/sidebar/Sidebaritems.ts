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
  {
    id: 1,
    name: "Menu",
    items: [
      {
        heading: "Alaska AAC Blocks",
        children: [
           {
            id: uniqueId(),
            url: "/",
            name: "Dashboard",
            icon: "material-symbols:dashboard-outline",
            color: "text-primary",
          },
          {
            id: uniqueId(),
            url: "/lead-managment/leads",
            name: "Lead Management",
            icon: "ph:user-circle-check-thin",
            color: "text-primary",
          },
          {
            id: uniqueId(),
            url: "/batching",
            name: "Batching",
            icon: "material-symbols:batch-prediction-outline-rounded",
            color: "text-secondary",
          },
          {
            id: uniqueId(),
            url: "/rising",
            name: "Rising",
            icon: "tdesign:sun-rising-filled",
            color: "text-info",
          },
          {
            id: uniqueId(),
            url: "/cutting",
            name: "Cutting",
            icon: "icon-park-outline:cutting",
            color: "text-secondary",
          },
          {
            id: uniqueId(),
            url: "/autoclave",
            name: "Autoclave",
            icon: "material-symbols:hdr-auto-outline-rounded",
            color: "text-primary",
          },
           {
            id: uniqueId(),
            url: "/segregation",
            name: "Segregation",
            icon: "cbi:sega",
            color: "text-primary",
          },
           {
            id: uniqueId(),
            url: "/boiler",
            name: "Boiler",
            icon: "icon-park-outline:boiler",
            color: "text-primary",
          },
          //  {
          //   id: uniqueId(),
          //   url: "/ro-water",
          //   name: "RO Water",
          //   icon: "material-symbols:water-do-outline-rounded",
          //   color: "text-primary",
          // },
           {
            id: uniqueId(),
            url: "/diesel-fuel",
            name: "Diesel Fuel",
            icon: "bi:fuel-pump-diesel",
            color: "text-primary",
          },
           {
            id: uniqueId(),
            url: "/finish-good",
            name: "Finish Good  ",
            icon: "hugeicons:security-lock",
            color: "text-primary",
          },
           {
            id: uniqueId(),
            url: "/dispatch",
            name: "Dispatch",
            icon: "ix:disk",
            color: "text-primary",
          },
          {
            id: uniqueId(),
            url: "/receiving-stock",
            name: "Receiving Stock",
            icon: "wpf:gps-receiving",
            color: "text-primary",
          },
           {
            id: uniqueId(),
            url: "/material",
            name: "Material",
            icon: "mdi:material-ui",
            color: "text-primary",
          },
        ],
      },
    ],
  },
  //  {
  //   id: 1,
  //   name: "Lead management",
  //   items: [
  //     {
  //       heading: "Lead management",
  //       children: [
  //         {
  //           name: "Leads",
  //           icon: "ph:user-circle-check-thin",
  //           id: uniqueId(),
  //           url: "/lead-managment/leads",
  //         },
  //         {
  //           name: "Sample page 2",
  //           icon: "basil:app-store-outline",
  //           id: uniqueId(),
  //           url: "/",
  //         },
  //          {
  //           name: "Sample page 3",
  //           icon: "token:qrdo",
  //           id: uniqueId(),
  //           url: "/",
  //         }
         
  //       ],
  //     },
  //   ],
  // },
  //  {
  //   id: 2,
  //   name: "Batching ",
  //   items: [
  //     {
  //       heading: "Batching",
  //       children: [
  //         {
  //           name: "Batching",
  //           icon: "carbon:batch-job",
  //           id: uniqueId(),
  //           url: "/batching",
  //         },
  //         // {
  //         //   name: "Sign Up",
  //         //   icon: "solar:login-2-line-duotone",
  //         //   id: uniqueId(),
  //         //   url: "/admin/register",
  //         // }
         
  //       ],
  //     },
  //   ],
  // },
  //  {
  //   id: 3,
  //   name: "Rising ",
  //   items: [
  //     {
  //       heading: "Rising",
  //       children: [
  //         {
  //           name: "Rising",
  //           icon: "tdesign:sun-rising-filled",
  //           id: uniqueId(),
  //           url: "/rising",
  //         },
  //         // {
  //         //   name: "Sign Up",
  //         //   icon: "solar:login-2-line-duotone",
  //         //   id: uniqueId(),
  //         //   url: "/admin/register",
  //         // }
         
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 3,
  //   name: "Authentiction",
  //   items: [
  //     {
  //       heading: "Authentiction",
  //       children: [
  //         {
  //           name: "Login",
  //           icon: "solar:login-2-line-duotone",
  //           id: uniqueId(),
  //           url: "/admin/login",
  //         },
  //         {
  //           name: "Sign Up",
  //           icon: "solar:login-2-line-duotone",
  //           id: uniqueId(),
  //           url: "/admin/register",
  //         }
         
  //       ],
  //     },
  //   ],
  // },
];

export default SidebarContent;

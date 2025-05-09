import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  ServerStackIcon,
  RectangleStackIcon,PhotoIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, UsersTable, Settings,Gallery } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";


const icon = {
  className: "w-5 h-5 text-inherit",
};
  
export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <PhotoIcon {...icon} />,
        name: "gallery",
        path: "/gallery",
        element:<Gallery />
      },
       {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element:<Home/>
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element:<Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "contacts",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "user",
        path: "/users-table",
        element:<UsersTable />,
      }
      ,
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "settings",
        path: "/settings",
        element:<Settings />,
      }

    ],
  },

  {

    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
    
      
    ],
  },
 
];

export default routes;

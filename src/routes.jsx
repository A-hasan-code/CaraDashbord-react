import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, UsersTable, Settings } from "@/pages/dashboard";

import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Contacts",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Usertables",
        path: "/users-table",
        element: <UsersTable />,
      }
      ,
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Settings",
        path: "/Settings",
        element: <Settings />,
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
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/create-user",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;

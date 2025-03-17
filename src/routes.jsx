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
import ProtectedRoute from "./ProtectedRoute";

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
        element: <ProtectedRoute element={<Home />} />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <ProtectedRoute element={<Profile />} />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Contacts",
        path: "/tables",
        element: <ProtectedRoute element={<Tables />} />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Usertables",
        path: "/users-table",
        element: <ProtectedRoute element={<UsersTable />} />,
      }
      ,
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Settings",
        path: "/Settings",
        element: <ProtectedRoute element={<Settings />} />,
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
      // {
      //   icon: <RectangleStackIcon {...icon} />,
      //   name: "sign up",
      //   path: "/create-user",
      //   element: <SignUp />,
      // },
    ],
  },
];

export default routes;

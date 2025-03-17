import { useLocation, Link, useNavigate, NavLink } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import {
  setOpenConfigurator,
  setOpenSidenav,
} from "@/Redux/slices/materialTailwindSlice";
import { logout } from "@/Redux/slices/authslices";

export function DashboardNavbar({ routes }) {
  console.log('routes', routes);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fixedNavbar, openSidenav } = useSelector((state) => state.materialTailwind);
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  // Check if the page is in an iframe
  const isInIframe = window.self == window.top;
  console.log('isAuthenticated', isAuthenticated);
  console.log('isInIframe', isInIframe);



  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard/profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    dispatch(logout()); // Dispatch logout action
    navigate("/auth/sign-in");
  };

  //filterout when isAuthenticated is true
  const filteredRoutes = routes.map((route) => ({
    ...route,
    pages: route.pages.filter(
      (page) => !(page.name === 'sign in' && isAuthenticated)
    ),
  }));

  return (
    <>
      <Navbar
        color={fixedNavbar ? "white" : "transparent"}
        className={`rounded-xl transition-all ${fixedNavbar ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5" : "px-0 py-1"}`}
        fullWidth
        blurred={fixedNavbar}
      >
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          <div className="capitalize">
          </div>
          {/* Right Side: Profile and Routes */}
          <div className="flex items-center gap-6">
            {/* Only show the sidenav toggle in non-iframe mode */}
            {isInIframe && (
              <IconButton
                variant="text"
                color="blue-gray"
                className="grid xl:hidden"
              // onClick={() => dispatch(setOpenSidenav(!openSidenav))}
              >
                <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
              </IconButton>
            )}
            {/* Only show full menu if not in an iframe */}
            {isInIframe && (
              <div className="m-4 flex items-center gap-x-6">
                {/* Loop through the routes and display the items horizontally */}
                {filteredRoutes.map(({ layout, title, pages }, key) => (
                  <div key={key} className="flex items-center space-x-6">
                    {title && (
                      <Typography variant="small" className="font-black uppercase opacity-75">
                        {title}
                      </Typography>
                    )}
                    {pages.map(({ icon, name, path }) => (
                      <NavLink key={name} to={`/${layout}${path}`}>
                        {({ isActive }) => (
                          <Button
                            variant={isActive ? "gradient" : "text"}
                            className="flex items-center gap-2 px-4 capitalize"
                          >
                            {icon}
                            <Typography color="inherit" className="font-medium capitalize">
                              {name}
                            </Typography>
                          </Button>
                        )}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Conditional Rendering Based on Authentication and iframe check */}
            {isInIframe && isAuthenticated && (
              <Menu>
                <MenuHandler>
                  <Avatar src={user?.avatar} alt="User Avatar" className="cursor-pointer" />
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}

            {/* Only show the settings and sign-in options if in an iframe */}
            {!isInIframe && (
              <div className="flex gap-6">
                <Link to="/auth/sign-in">
                  <Button variant="text" className="flex items-center gap-2 px-4">
                    <Cog6ToothIcon className="h-6 w-6" />
                    <Typography color="inherit" className="font-medium capitalize">
                      Sign In
                    </Typography>
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="text" className="flex items-center gap-2 px-4">
                    <Cog6ToothIcon className="h-6 w-6" />
                    <Typography color="inherit" className="font-medium capitalize">
                      Settings
                    </Typography>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Navbar>
      <Breadcrumbs className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""}`}>
        <Link to={`/${layout}`}>
          <Typography variant="small" color="blue-gray" className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100">
            {layout.replace(/\b\w/g, (char) => char.toUpperCase())}
          </Typography>

        </Link>
        <Typography variant="small" color="blue-gray" className="font-normal">
          {page.replace(/\b\w/g, (char) => char.toUpperCase())}
        </Typography>
      </Breadcrumbs>
      <Typography variant="h6" color="blue-gray">
        {page.replace(/\b\w/g, (char) => char.toUpperCase())}
      </Typography></>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;

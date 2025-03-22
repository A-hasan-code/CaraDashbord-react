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

import { logout } from "@/Redux/slices/User.Slice"; 
import {getImageSettings } from '@/Redux/slices/secretIdSlice'; 
import { useEffect } from "react";
export function DashboardNavbar({ routes }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
    const { logo: imagelogo } = useSelector((state) => state.clientIdsSet);
  // Access user data and authentication status from the userSlice
  const { user, isAuthenticated } = useSelector((state) => state.user);  // Assuming `user` slice holds the authentication status and user data
  
  // Check if the page is in an iframe
  const isInIframe = window.self === window.top;

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard/profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    dispatch(logout());
     dispatch(clearUser());  // Dispatch logout action from userSlice
    navigate("/auth/sign-in");
  };

  // Filter routes based on authentication status
  const filteredRoutes = routes.map((route) => ({
    ...route,
    pages: route.pages.filter(
      (page) => !(page.name === 'sign in' && isAuthenticated)
    ),
  }));
  useEffect(()=>{
    dispatch(getImageSettings());
  },[dispatch])

  return (
    <>

      <Navbar
        color="transparent"
        className={`rounded-xl transition-all sticky top-4 z-40 py-3   px-0 py-1`}
        fullWidth
        // blurred={fixedNavbar}
      >
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          {/* Left Side: Logo */}
          <div className="capitalize flex items-center gap-2">
            <img src={`http://localhost:5000${imagelogo}`} alt="Logo" className="h-20 w-20 object-contain" />
            {/* <Typography variant="h6" className="font-bold text-black">
              XortLogix
            </Typography> */}
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

            {/* Loop through routes if not in iframe */}
            {isInIframe && (
              <div className="m-4 flex items-center gap-x-6">
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

            {/* User Menu */}
            {isInIframe && isAuthenticated && (
              <Menu>
                <MenuHandler>
                  <Avatar src={`http://localhost:5000/${user?.image}`} alt="User Avatar" className="cursor-pointer" />
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}

            {/* Show settings and sign-in options for non-iframe case */}
            {!isInIframe && (
              <div className="flex gap-6">
                <Link to="/settings">
                  <Button variant="text" className="flex items-center gap-2 px-4">
                    <Cog6ToothIcon className="h-6 w-6" />
                    <Typography color="inherit" className="font-medium capitalize">
                      Settings
                    </Typography>
                  </Button>
                </Link>
                {isAuthenticated ? (
                  <Menu>
                    <MenuHandler>
                      <Avatar src={`http://localhost:5000/${user?.image}`} alt="User Avatar" className="cursor-pointer" />
                    </MenuHandler>
                    <MenuList>
                      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                ) : (
                  <Link to="/auth/sign-in">
                    <Button variant="text" className="flex items-center gap-2 px-4">
                      <Cog6ToothIcon className="h-6 w-6" />
                      <Typography color="inherit" className="font-medium capitalize">
                        Sign In
                      </Typography>
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </Navbar>

      {/* Breadcrumbs */}
<Breadcrumbs className={`bg-transparent p-1 transition-all mt-4`}>
  <Typography 
    variant="small" 
    color="blue-gray" 
    className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100">
    {layout.replace(/\b\w/g, (char) => char.toUpperCase())}
  </Typography>
  <Typography 
    variant="small" 
    color="blue-gray" 
    className="font-normal p-0">
    {page ? page.replace(/\b\w/g, (char) => char.toUpperCase()) : "Dashboard"}
  </Typography>
</Breadcrumbs>



      <Typography variant="h6" color="blue-gray">
        {page ? page.replace(/\b\w/g, (char) => char.toUpperCase()) : "Dashboard"}
      </Typography>
    </>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;

import { Link,useLocation, NavLink, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/Redux/slices/User.Slice";
import { getImageSettings } from "@/Redux/slices/secretIdSlice";
import { useEffect, useState } from "react";

export function DashboardNavbar({ routes }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const { logo: imagelogo } = useSelector((state) => state.clientIdsSet);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const isInIframe = window.self !== window.top;
useEffect(() => {
   const hasReloaded = sessionStorage.getItem("iframe-reloaded");

    if (isInIframe && !hasReloaded) {
      sessionStorage.setItem("iframe-reloaded", "true");
      console.log("Reloading iframe app once...");
      window.location.reload();
    }
},[])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(getImageSettings());
  }, [dispatch]);

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prevState) => !prevState); // Toggle state
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard/profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/auth/sign-in");
  };

  const isGalleryPage = page.toLowerCase() === "gallery";

  const filteredRoutes = routes.map((route) => ({
    ...route,
    pages: route.pages.filter(
      (page) =>
        !(page.name === "sign in" && isAuthenticated) &&
        !(user?.role === "superadmin" && (page.name === "Contacts" || page.name === "gallery")) &&
        !(user?.role === "company" && (page.name === "User" || page.name === "gallery"))
    ),
  }));

  return (
    <>
      <Navbar color="transparent" className="rounded-xl transition-all sticky top-4 z-40 px-0 py-1" fullWidth>
        <div className="flex justify-between items-center w-full">

          {/* Left Side: Logo */}
          {!isInIframe && ( <div className="capitalize flex items-center gap-2">
            <img
              src={`https://caradashboard-backend-production.up.railway.app${imagelogo}`}
              alt="Logo"
              className="h-20 w-20 object-contain"
            />
          </div>)}

          {/* Right Side: Hamburger Menu & Profile */}
          <div className="flex items-center gap-6">
            {/* Hamburger Menu for Mobile 
            {isInIframe && (
              <IconButton
                variant="text"
                color="blue-gray"
                className="xl:hidden"
                onClick={handleDrawerToggle}
              >
                {isDrawerOpen ? (
                  <XMarkIcon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
                ) : (
                  <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
                )}
              </IconButton>
            )}*/}

            {/* Menu for Desktop 
            <div className="hidden md:flex items-center gap-6">
              {!isGalleryPage && isInIframe && isAuthenticated && (
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
            </div>*/}

            {/* User Menu 
            {isInIframe && isAuthenticated && (
              <Menu>
                <Avatar
                  src={`https://caradashboard-backend-production.up.railway.app/${user?.image}`}
                  alt="User Avatar"
                  className="cursor-pointer"
                  
                />
              </Menu>
            )}*/}
            {/* For non-iframe or if not authenticated */}
             <div className="hidden md:flex items-center gap-6">
              {!isGalleryPage && !isInIframe && isAuthenticated && (
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
            </div>
            {!isInIframe && (
            
              <div className="flex gap-6">
                   <div className="capitalize flex items-center gap-2">
            
          </div>
                {/* <Link to="/Settings">
                  <Button variant="text" className="flex items-center gap-2 px-4">
                    <Cog6ToothIcon className="h-6 w-6" />
                    <Typography color="inherit" className="font-medium capitalize">
                      Settings
                    </Typography>
                  </Button>
                </Link> */}
                {isAuthenticated ? (
                  <Menu>
                    <MenuHandler>
                      <Avatar
                        src={`https://caradashboard-backend-production.up.railway.app/${user?.image}`}
                        alt="User Avatar"
                        className="cursor-pointer"
                      />
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

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute top-0 right-0 p-6 bg-white w-64 h-full shadow-xl">
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={handleDrawerToggle} // Close drawer when X is clicked
              className="absolute top-0 right-0"
            >
              <XMarkIcon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
            </IconButton>
            <div className="p-4">
              {filteredRoutes.map(({ layout, title, pages }, key) => (
                <div key={key}>
                  {title && (
                    <Typography variant="small" className="font-black uppercase opacity-75">
                      {title}
                    </Typography>
                  )}
                  {pages.map(({ icon, name, path }) => (
                    <NavLink key={name} to={`/${layout}${path}`} onClick={() => setIsDrawerOpen(false)}>
                      <Button variant="text" className="w-full capitalize py-2 flex items-center gap-4">
                        {icon}
                        <Typography color="inherit" className="font-medium capitalize">
                          {name}
                        </Typography>
                      </Button>
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page Title */}
      <div className="mt-0  p-2 rounded-xl  border bg-gray-100 bg-blend-darken">
        <Typography variant="h5" color="blue-gray">
          {page ? (page.toLowerCase() === "gallery" ? "Project Gallery" : page.replace(/\b\w/g, (char) => char.toUpperCase())) : "Dashboard"}
        </Typography>
      </div>
    </>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";
export default DashboardNavbar;

import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useSelector, useDispatch } from "react-redux";

export function Sidenav({ routes }) {
  const dispatch = useDispatch();


  const { isAuthenticated } = useSelector((state) => state.user)  // Accessing the authentication status from the auth slice
  
  // Defining different sidenav types
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <Link to="/dashboard/home" className="py-6 px-8 text-center flex items-center justify-center">
          <img
            src="https://assets.cdn.filesafe.space/vcLxBfw01Nmv2VnlhtND/media/66b25360e5b9f51906bf5080.png"
            alt="Logo"
            width={50}
          />
          <Typography variant="h6" className="mr-2">
            Xortslogix
          </Typography>
        </Link>

        {/* Close Button for Sidenav */}
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>

      {/* Navigation Routes */}
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography variant="small" className="font-black uppercase opacity-75">
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                {/* Conditionally render the 'Sign In' page based on authentication status */}
                {(name === 'sign in' && !isAuthenticated) || (name !== 'sign in' && isAuthenticated) ? (
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        className="flex items-center gap-4 px-4 capitalize"
                        fullWidth
                      >
                        {icon}
                        <Typography color="inherit" className="font-medium capitalize">
                          {name}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                ) : null}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Material Tailwind React",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;

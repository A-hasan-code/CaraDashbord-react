import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useSelector, useDispatch } from "react-redux";
import { setOpenConfigurator } from "@/Redux/slices/materialTailwindSlice"; 
import { useState } from "react";

export function Dashboard() {
  const dispatch = useDispatch();
  const { sidenavType } = useSelector((state) => state.materialTailwind);

  // State to manage iframe visibility
  const [iframeVisible, setIframeVisible] = useState(false);

  // Toggle iframe visibility (this can be triggered based on user interaction)
  const toggleIframeVisibility = () => setIframeVisible(!iframeVisible);

  // Dynamically change layout based on sidenav visibility
  const sidenavClass = iframeVisible ? "" : "xl:ml-80";

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      {/* Conditionally render Sidenav based on iframe visibility */}
      {!iframeVisible && (
        <Sidenav
          routes={routes}
          brandImg={
            sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
          }
        />
      )}

      <div className={`p-4 ${sidenavClass}`}>
        <DashboardNavbar routes={routes} /> {/* Pass routes to DashboardNavbar */}
        
        {/* You can trigger iframe visibility from here */}
        {/* <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={toggleIframeVisibility}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton> */}

        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))
          )}
        </Routes>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;

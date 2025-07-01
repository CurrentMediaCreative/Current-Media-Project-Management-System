import { NavLink } from "react-router-dom";
import { forwardRef } from "react";

const Sidebar = forwardRef(({ isOpen, toggleSidebar }, ref) => {
  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
        </svg>
      ),
    },
    {
      name: "Projects",
      path: "/projects",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
        </svg>
      ),
    },
  ];

  // Action items
  const actionItems = [
    {
      name: "New Document",
      path: "/documents/new",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Backdrop for all screen sizes */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        ref={ref}
        className={`fixed top-0 left-0 z-50 w-64 h-screen pt-14 transition-transform bg-white border-r border-gray-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 mt-5">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-normal rounded-lg ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-900 hover:bg-gray-100"
                    }`
                  }
                  end={item.path === "/"}
                >
                  <span className="w-6 h-6 transition duration-75">
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="my-5 border-t border-gray-200"></div>

          {/* Actions Section */}
          <div className="px-3 mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </h3>
          </div>
          <ul className="space-y-2">
            {actionItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-base font-normal rounded-lg ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-900 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="w-6 h-6 transition duration-75">
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
});

export default Sidebar;

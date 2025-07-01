import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/authService";

const Navbar = ({ toggleSidebar }) => {
  const { setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50 flex justify-between items-center">
      <div className="flex items-center">
        {/* Menu button - visible on all screen sizes */}
        <button
          onClick={toggleSidebar}
          data-sidebar-toggle="true"
          className="p-2 mr-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            CurrentMedia PMS
          </span>
        </Link>
      </div>

      {/* Right side navigation items */}
      <div className="flex items-center">
        <div className="flex items-center ml-3">
          <div>
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
              id="user-menu-button"
              aria-expanded="false"
            >
              <span className="sr-only">Open user menu</span>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                CM
              </div>
            </button>
          </div>
          {/* Dropdown menu */}
          <div className="ml-3">
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

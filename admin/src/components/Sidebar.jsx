import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);

  return (
    <div className="min-h-screen bg-white border-r">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 mx-2 md:px-9 md:min-w-72 cursor-pointer ${
                isActive
                  ? "bg-[#f2f3ff] border-b-4 border-primary md:border-b-0 md:border-r-4"
                  : ""
              }`
            }
            to={"/admin-dashboard"}
          >
            <img src={assets.home_icon} alt="home_icon" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 mx-2 md:px-9 md:min-w-72 cursor-pointer ${
                isActive
                  ? "bg-[#f2f3ff] border-b-4 border-primary md:border-b-0 md:border-r-4"
                  : ""
              }`
            }
            to={"/all-appointments"}
          >
            <img src={assets.appointment_icon} alt="appointment_icon" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 mx-2 md:px-9 md:min-w-72 cursor-pointer ${
                isActive
                  ? "bg-[#f2f3ff] border-b-4 border-primary md:border-b-0 md:border-r-4"
                  : ""
              }`
            }
            to={"/add-doctor"}
          >
            <img src={assets.add_icon} alt="add_icon" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 mx-2 md:px-9 md:min-w-72 cursor-pointer ${
                isActive
                  ? "bg-[#f2f3ff] border-b-4 border-primary md:border-b-0 md:border-r-4"
                  : ""
              }`
            }
            to={"/doctor-list"}
          >
            <img src={assets.people_icon} alt="people_icon" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;

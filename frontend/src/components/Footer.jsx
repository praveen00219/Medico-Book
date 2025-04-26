import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* ---------- Left Section ---------- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            <strong>Welcome to Medico!</strong> <br />
            At Medico, we are committed to providing the highest quality
            healthcare information and services. Our mission is to make trusted
            medical resources accessible to everyone.
          </p>
        </div>

        {/* ---------- Center Section ---------- */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <NavLink to="/">
              <li>Home</li>
            </NavLink>

            <NavLink to="/doctors">
              <li className="py-1">All Doctors</li>
            </NavLink>

            <NavLink to="/about">
              <li>About us</li>
            </NavLink>

            <NavLink to="/contact">
              <li>Contact us</li>
            </NavLink>

            <NavLink to="/policy">
              <li>Privacy policy</li>
            </NavLink>
          </ul>
        </div>

        {/* ---------- Right Section ---------- */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>📞 +91-7297952644</li>
            <li>✉️ paru2192000@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* ---------- Copyright Text ---------- */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright © 2025 - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;

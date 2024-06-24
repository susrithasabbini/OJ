import { Link } from "react-router-dom";

const MenuLink = ({ to, icon, text, isMenuOpen }) => (
  <Link
    to={to}
    className={`${
      isMenuOpen ? "text-blue-500 bg-blue-50" : "text-gray-500"
    } hover:bg-gray-100 w-full px-4 transition-colors duration-300 hover:opacity-80 flex items-center gap-x-4 py-[10px] rounded-md cursor-pointer`}
  >
    {icon}
    <span className="text-base">{text}</span>
  </Link>
);

export default MenuLink;

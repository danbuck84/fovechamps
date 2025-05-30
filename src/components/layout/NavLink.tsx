
import { useLocation, useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";

type NavLinkProps = {
  path: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
};

const NavLink = ({ path, icon: Icon, label, isCollapsed }: NavLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = location.pathname === path;

  return (
    <li>
      <button
        onClick={() => navigate(path)}
        className={`flex items-center w-full p-2 rounded-lg transition-colors ${
          isActive
            ? "text-fove-red bg-fove-red/10"
            : "text-fove-silver hover:bg-fove-red/10 hover:text-fove-white"
        }`}
      >
        <Icon className="w-6 h-6" />
        <span className={isCollapsed ? "hidden" : "ml-3"}>{label}</span>
      </button>
    </li>
  );
};

export default NavLink;

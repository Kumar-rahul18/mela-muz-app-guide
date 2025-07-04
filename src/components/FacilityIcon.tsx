
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FacilityIconProps {
  icon: React.ReactNode;
  label: string;
  type?: string;             // made optional
  onClick?: () => void;      // new optional prop
}

const FacilityIcon: React.FC<FacilityIconProps> = ({ icon, label, type, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // execute the custom action if provided
    } else if (type === 'lost-found') {
      navigate('/lost-found');
    } else if (type) {
      navigate(`/facility/${type}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center space-y-2 cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <div className="icon-3d bg-gradient-to-br from-orange-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border-2 border-orange-200">
        <div className="icon-3d-container animate-dice-3d text-white text-2xl">
          {icon}
        </div>
      </div>
      <span className="text-xs text-orange-800 text-center font-medium leading-tight">
        {label}
      </span>
    </div>
  );
};

export default FacilityIcon;

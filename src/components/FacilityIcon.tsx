
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FacilityIconProps {
  icon: React.ReactNode;
  label: string;
  type: string;
}

const FacilityIcon: React.FC<FacilityIconProps> = ({ icon, label, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/facility/${type}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col items-center space-y-2 cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <div className="card-gradient w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
        <div className="text-white text-2xl">
          {icon}
        </div>
      </div>
      <span className="text-xs text-gray-600 text-center font-medium leading-tight">
        {label}
      </span>
    </div>
  );
};

export default FacilityIcon;

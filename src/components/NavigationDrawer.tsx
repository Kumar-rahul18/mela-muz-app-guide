import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import FeedbackForm from './FeedbackForm';
import {
  Home,
  Images,
  Calendar,
  Users,
  Shield,
  Camera,
  MapPin,
  Languages,
  LogIn,
  BookOpen,
  Car,
  TreePine,
  MessageSquare,
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageChange: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onLanguageChange,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVehicleAdmin, setIsVehicleAdmin] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    checkVehicleAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    try {
      const adminSession = localStorage.getItem('adminSession');

      if (adminSession) {
        const sessionData = JSON.parse(adminSession);
        setIsAdmin(
          sessionData.username === 'MMCMUZAFFARPUR' && sessionData.isAdmin
        );
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const checkVehicleAdminStatus = () => {
    try {
      const vehicleAdminSession = localStorage.getItem('vehicleAdminSession');

      if (vehicleAdminSession) {
        const sessionData = JSON.parse(vehicleAdminSession);
        setIsVehicleAdmin(
          sessionData.username === 'ADMIN' && sessionData.isVehicleAdmin
        );
      } else {
        setIsVehicleAdmin(false);
      }
    } catch (error) {
      console.error('Error checking vehicle admin status:', error);
      setIsVehicleAdmin(false);
    }
  };

  const navigationItems = [
    { icon: Home, label: t('home'), path: '/' },
    { icon: BookOpen, label: t('history'), path: '/history' },
    { icon: Calendar, label: t('events'), path: '/events' },
    { icon: Users, label: t('crowd_status'), path: '/crowd-status' },
    { icon: Camera, label: t('photo_contest'), path: '/photo-contest' },
    { icon: TreePine, label: t('attractions'), path: '/attractions' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLanguageChange = () => {
    onLanguageChange();
    onClose();
  };

  const handleFeedbackOpen = () => {
    setIsFeedbackOpen(true);
    onClose(); // Close navigation drawer when feedback form opens
  };

  const handleAdminLogin = () => {
    navigate('/admin');
    onClose();
  };

  const handleVehicleAdminLogin = () => {
    const username = prompt('Enter username:');
    const password = prompt('Enter password:');

    if (username === 'ADMIN' && password === 'Xy91%7as') {
      localStorage.setItem('vehicleAdminSession', JSON.stringify({
        username: 'ADMIN',
        isVehicleAdmin: true,
        loginTime: new Date().toISOString()
      }));
      setIsVehicleAdmin(true);
      navigate('/admin/vehicle');
      onClose();
    } else {
      alert('Invalid credentials');
    }
  };

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
    onClose();
  };

  const handleVehicleAdmin = () => {
    navigate('/admin/vehicle');
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
    onClose();
  };

  const handleVehicleAdminLogout = () => {
    localStorage.removeItem('vehicleAdminSession');
    setIsVehicleAdmin(false);
    onClose();
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="fixed inset-y-0 left-0 z-50 h-full w-80 transform transition-transform duration-300 ease-in-out bg-white shadow-xl">
          <DrawerHeader>
            <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white p-4 rounded-lg">
              <img
                src="/favicon.ico"
                alt="MMC Icon"
                className="w-10 h-10 rounded-full border border-white shadow-sm"
              />
              <div>
                <h1 className="text-lg font-bold leading-tight">Shravani Mela App</h1>
                <p className="text-sm font-semibold leading-tight">by MMC</p>
              </div>
            </div>
          </DrawerHeader>

          <div className="p-4 space-y-2 flex-1 overflow-y-auto">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-12 hover:bg-orange-50"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}

            <Button
              variant="ghost"
              className="w-full justify-start text-left h-12 hover:bg-blue-50 text-blue-700"
              onClick={handleFeedbackOpen}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              {t('feedback')}
            </Button>

            {!isAdmin ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-12 bg-red-50 hover:bg-red-100 text-red-700"
                onClick={handleAdminLogin}
              >
                <LogIn className="mr-3 h-5 w-5" />
                Admin Login
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left h-12 bg-red-50 hover:bg-red-100 text-red-700"
                  onClick={handleAdminDashboard}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  {t('admin')}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left h-12 bg-gray-50 hover:bg-gray-100 text-gray-700"
                  onClick={handleLogout}
                >
                  <LogIn className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </>
            )}

            {!isVehicleAdmin ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-12 bg-blue-50 hover:bg-blue-100 text-blue-700"
                onClick={handleVehicleAdminLogin}
              >
                <Car className="mr-3 h-5 w-5" />
                Vehicle Admin Login
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left h-12 bg-blue-50 hover:bg-blue-100 text-blue-700"
                  onClick={handleVehicleAdmin}
                >
                  <Car className="mr-3 h-5 w-5" />
                  Vehicle Admin
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left h-12 bg-gray-50 hover:bg-gray-100 text-gray-700"
                  onClick={handleVehicleAdminLogout}
                >
                  <LogIn className="mr-3 h-5 w-5" />
                  Vehicle Logout
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start text-left h-12 bg-blue-50 hover:bg-blue-100 text-blue-700"
              onClick={handleLanguageChange}
            >
              <Languages className="mr-3 h-5 w-5" />
              {t('change_language')}
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-left h-12 bg-green-50 hover:bg-green-100 text-green-700"
              onClick={() => window.open('tel:8503945378', '_self')} 
            >
              <div className="flex items-center w-full">
                <img 
                  src="https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/general//contact_developer.webp" 
                  alt="Contact Developer" 
                  className="mr-3 h-5 w-5 rounded-full object-cover"
                />
                Contact Developer
              </div>
            </Button>
          </div>

          <div className="p-4">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>

      <FeedbackForm 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </>
  );
};

export default NavigationDrawer;

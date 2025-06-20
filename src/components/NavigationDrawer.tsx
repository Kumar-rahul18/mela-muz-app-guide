
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Images, Calendar, Users, Shield, Camera, MapPin, Languages, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageChange: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose, onLanguageChange }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }

      setIsLoggedIn(true);

      // Check if user is admin (specific email check only)
      if (user.email === 'harsh171517@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  };

  const navigationItems = [
    { icon: Home, label: t('home'), path: '/' },
    { icon: Images, label: t('gallery'), path: '/gallery' },
    { icon: Calendar, label: t('events'), path: '/events' },
    { icon: Users, label: t('crowd_status'), path: '/crowd-status' },
    { icon: Camera, label: t('photo_contest'), path: '/photo-contest' },
    { icon: MapPin, label: t('facilities'), path: '/facility/route' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLanguageChange = () => {
    onLanguageChange();
    onClose();
  };

  const handleAdminLogin = () => {
    navigate('/admin');
    onClose();
  };

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
    onClose();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent side ="right">
        <DrawerHeader>
          <DrawerTitle className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white p-4 rounded-lg">
            {t('app_title')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2">
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
          
          {/* Admin Section */}
          {!isLoggedIn ? (
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-12 bg-red-50 hover:bg-red-100 text-red-700"
              onClick={handleAdminLogin}
            >
              <LogIn className="mr-3 h-5 w-5" />
              Admin Login
            </Button>
          ) : isAdmin ? (
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
          ) : null}
          
          {/* Language Change Button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-12 bg-blue-50 hover:bg-blue-100 text-blue-700"
            onClick={handleLanguageChange}
          >
            <Languages className="mr-3 h-5 w-5" />
            {t('change_language')}
          </Button>
        </div>
        <DrawerClose asChild>
          <Button variant="outline" className="m-4">
            Close
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default NavigationDrawer;

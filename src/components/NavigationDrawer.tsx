
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Images, Calendar, Users, Shield, Camera, MapPin, Languages } from 'lucide-react';
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

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      setIsAdmin(!error && !!adminData);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const navigationItems = [
    { icon: Home, label: t('nav.home'), path: '/' },
    { icon: Images, label: t('nav.gallery'), path: '/gallery' },
    { icon: Calendar, label: t('nav.events'), path: '/events' },
    { icon: Users, label: t('nav.crowd_status'), path: '/crowd-status' },
    { icon: Camera, label: t('nav.photo_contest'), path: '/photo-contest' },
    { icon: MapPin, label: t('nav.facilities'), path: '/facility/route' },
  ];

  // Only add admin option if user is verified admin
  if (isAdmin) {
    navigationItems.push({ icon: Shield, label: t('nav.admin'), path: '/admin/dashboard' });
  }

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLanguageChange = () => {
    onLanguageChange();
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="bg-gradient-to-r from-orange-600 to-pink-600 text-white p-4 rounded-lg">
            {t('app.title')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start text-left h-12 ${
                item.path.includes('admin') ? 'bg-red-50 hover:bg-red-100 text-red-700' : 'hover:bg-orange-50'
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
          
          {/* Language Change Button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-12 bg-blue-50 hover:bg-blue-100 text-blue-700"
            onClick={handleLanguageChange}
          >
            <Languages className="mr-3 h-5 w-5" />
            {t('nav.change_language')}
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

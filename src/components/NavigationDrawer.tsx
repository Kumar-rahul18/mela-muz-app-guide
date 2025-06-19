
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Gallery, Calendar, Users, Shield, Camera, MapPin } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navigationItems = [
    { icon: Home, label: t('nav.home'), path: '/' },
    { icon: Gallery, label: t('nav.gallery'), path: '/gallery' },
    { icon: Calendar, label: t('nav.events'), path: '/events' },
    { icon: Users, label: t('nav.crowd_status'), path: '/crowd-status' },
    { icon: Camera, label: t('nav.photo_contest'), path: '/photo-contest' },
    { icon: MapPin, label: t('nav.facilities'), path: '/facility/route' },
    { icon: Shield, label: t('nav.admin'), path: '/admin', isAdmin: true },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="app-gradient text-white p-4 rounded-lg">
            {t('app.title')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start text-left h-12 ${
                item.isAdmin ? 'bg-red-50 hover:bg-red-100 text-red-700' : ''
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
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

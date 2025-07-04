import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import FacilitySection from '@/components/FacilitySection';
import ContactCategoryFilter, { Contact } from '@/components/ContactCategoryFilter';
import { Button } from '@/components/ui/button';
import Marquee from "react-fast-marquee";
import VoiceSearch from '@/components/VoiceSearch';

const Index = () => {
  const location = useLocation();
  const [showContacts, setShowContacts] = useState(false);
  const [activeContactSection, setActiveContactSection] = useState<string>('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (location.state?.showContacts) {
      setShowContacts(true);
      if (location.state?.activeSection) {
        setActiveContactSection(location.state.activeSection);
      }
      // Clear the state to prevent it from persisting
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleContactToggle = (section?: string) => {
    setShowContacts(!showContacts);
    if (section) {
      setActiveContactSection(section);
    } else {
      setActiveContactSection('');
    }
  };

  return (
    <div className="overflow-hidden">
      <HeroSection />

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <ServicesSection />
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <FacilitySection />
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        {isMobile ? (
          <VoiceSearch compact={true} onFacilityFound={() => {}} />
        ) : (
          <VoiceSearch onFacilityFound={() => {}} />
        )}
      </div>

      {showContacts && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => handleContactToggle()}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {activeContactSection === 'ambulance' && 'Emergency Ambulance Contacts'}
                {activeContactSection === 'helpdesk' && 'Helpdesk Contacts'}
                {activeContactSection === 'control-room' && 'Control Room Contacts'}
                {activeContactSection === 'centralised-contact' && 'Centralized Contact Information'}
                {!activeContactSection && 'Emergency Contacts'}
              </h2>
              <Button
                onClick={() => handleContactToggle()}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <ContactCategoryFilter 
              onContactsLoad={setContacts}
              activeSection={activeContactSection}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Index;

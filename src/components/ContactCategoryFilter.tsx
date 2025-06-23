
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Contact {
  id: string;
  contact_type: string;
  name: string;
  phone: string;
  email: string;
  designation: string;
  category: string;
  is_active: boolean;
}

const ContactCategoryFilter: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, selectedCategory]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('is_active', true)
       // .order('contact_type');
      .order('created_at', { ascending: true });


      if (error) {
        console.error('Error fetching contacts:', error);
        return;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContacts = () => {
    if (selectedCategory === 'all') {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(contacts.filter(contact => contact.category === selectedCategory));
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-orange-600">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          size="sm"
          variant={selectedCategory === 'all' ? "default" : "outline"}
          onClick={() => setSelectedCategory('all')}
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
        >
          All Contacts
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === 'district_admin' ? "default" : "outline"}
          onClick={() => setSelectedCategory('district_admin')}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          {t('district_admin')}
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === 'mmc_admin' ? "default" : "outline"}
          onClick={() => setSelectedCategory('mmc_admin')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          {t('mmc_admin')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100 pb-3">
              <CardTitle className="text-orange-800 text-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold">{contact.name}</div>
                  {contact.designation && (
                    <div className="text-sm font-normal text-orange-600">{contact.designation}</div>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  contact.category === 'district_admin' ? 'bg-blue-100 text-blue-700' :
                  contact.category === 'mmc_admin' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                 {contact.category === 'district_admin' ? t('district_admin') :
                  contact.category === 'mmc_admin' ? t('mmc_admin') : 'General'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="text-sm text-orange-600 font-medium">
                {contact.contact_type}
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => handleCall(contact.phone)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center justify-center space-x-2"
                  size="sm"
                >
                  <Phone className="h-4 w-4" />
                  <span>{contact.phone}</span>
                </Button>
                
                {contact.email && (
                  <Button
                    onClick={() => handleEmail(contact.email)}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center justify-center space-x-2"
                    size="sm"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{contact.email}</span>
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-orange-500 text-center">
                {t('tap_to_call')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center text-orange-600 py-8">
          No contacts found in this category.
        </div>
      )}
    </div>
  );
};

export default ContactCategoryFilter;

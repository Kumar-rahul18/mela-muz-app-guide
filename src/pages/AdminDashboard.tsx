import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CrowdStatus {
  id: string;
  location: string;
  status: 'low' | 'medium' | 'high';
  status_color: 'green' | 'yellow' | 'red';
  description: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  event_type: string;
  location: string;
  is_active: boolean;
}

interface Facility {
  id: string;
  facility_type: string;
  name: string;
  contact_number: string;
  location_name: string;
  google_maps_link: string;
  is_active: boolean;
}

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

const AdminDashboard: React.FC = () => {
  const [crowdStatuses, setCrowdStatuses] = useState<CrowdStatus[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContactCategory, setSelectedContactCategory] = useState<string>('all');
  
  // Form states for crowd status
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'low' | 'medium' | 'high'>('low');
  const [crowdDescription, setCrowdDescription] = useState('');
  
  // Form states for events
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventType, setEventType] = useState('general');
  const [eventLocation, setEventLocation] = useState('');
  
  // Form states for facilities
  const [facilityType, setFacilityType] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [facilityContact, setFacilityContact] = useState('');
  const [facilityLocationName, setFacilityLocationName] = useState('');
  const [facilityMapsLink, setFacilityMapsLink] = useState('');
  
  // Form states for contacts
  const [contactType, setContactType] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactDesignation, setContactDesignation] = useState('');
  const [contactCategory, setContactCategory] = useState('general');
  
  // Add new state for managed facilities
  const [managedFacilities, setManagedFacilities] = useState<Facility[]>([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('paid-hotels');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterContacts();
  }, [contacts, selectedContactCategory]);

  const filterContacts = () => {
    if (selectedContactCategory === 'all') {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(contacts.filter(contact => contact.category === selectedContactCategory));
    }
  };

  const checkAdminAccess = async () => {
    try {
      const adminSession = localStorage.getItem('adminSession');
      
      if (!adminSession) {
        navigate('/admin');
        return;
      }

      const sessionData = JSON.parse(adminSession);
      
      if (sessionData.username !== 'MMCMUZAFFARPUR' || !sessionData.isAdmin) {
        localStorage.removeItem('adminSession');
        navigate('/admin');
        return;
      }

      setIsAdmin(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      localStorage.removeItem('adminSession');
      navigate('/admin');
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchCrowdStatuses(),
      fetchEvents(),
      fetchFacilities(),
      fetchContacts(),
      fetchManagedFacilities()
    ]);
  };

  const fetchCrowdStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('crowd_status')
        .select('*')
        .order('location');

      if (error) {
        console.error('Error fetching crowd statuses:', error);
        return;
      }

      const typedData: CrowdStatus[] = (data || []).map(item => ({
        id: item.id,
        location: item.location,
        status: item.status as 'low' | 'medium' | 'high',
        status_color: item.status_color as 'green' | 'yellow' | 'red',
        description: item.description || ''
      }));

      setCrowdStatuses(typedData);
    } catch (error) {
      console.error('Error fetching crowd statuses:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('facility_type');

      if (error) {
        console.error('Error fetching facilities:', error);
        return;
      }

      setFacilities(data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('contact_type');

      if (error) {
        console.error('Error fetching contacts:', error);
        return;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchManagedFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .in('facility_type', ['paid-hotels', 'atm', 'parking', 'bhandara'])
        .order('facility_type');

      if (error) {
        console.error('Error fetching managed facilities:', error);
        return;
      }

      setManagedFacilities(data || []);
    } catch (error) {
      console.error('Error fetching managed facilities:', error);
    }
  };

  const addFacility = async () => {
    if (!facilityType || !facilityName) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('facilities')
        .insert([{
          facility_type: facilityType,
          name: facilityName,
          contact_number: facilityContact || null,
          location_name: facilityLocationName || null,
          google_maps_link: facilityMapsLink || null,
          is_active: true
        }]);

      if (error) {
        console.error('Error adding facility:', error);
        toast.error(`Failed to add facility: ${error.message}`);
        return;
      }

      toast.success('Facility added successfully');
      setFacilityType('');
      setFacilityName('');
      setFacilityContact('');
      setFacilityLocationName('');
      setFacilityMapsLink('');
      await fetchFacilities();
    } catch (error) {
      console.error('Error adding facility:', error);
      toast.error('Failed to add facility');
    }
  };

  const addContact = async () => {
    if (!contactType || !contactName || !contactPhone) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          contact_type: contactType,
          name: contactName,
          phone: contactPhone,
          email: contactEmail || null,
          designation: contactDesignation || null,
          category: contactCategory,
          is_active: true
        }]);

      if (error) {
        console.error('Error adding contact:', error);
        toast.error(`Failed to add contact: ${error.message}`);
        return;
      }

      toast.success('Contact added successfully');
      setContactType('');
      setContactName('');
      setContactPhone('');
      setContactEmail('');
      setContactDesignation('');
      setContactCategory('general');
      await fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact');
    }
  };

  const addEvent = async () => {
    if (!eventTitle || !eventDate || !eventTime) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          title: eventTitle,
          description: eventDescription || null,
          date: eventDate,
          time: eventTime,
          event_type: eventType,
          location: eventLocation || null,
          is_active: true
        }]);

      if (error) {
        console.error('Error adding event:', error);
        toast.error(`Failed to add event: ${error.message}`);
        return;
      }

      toast.success('Event added successfully');
      setEventTitle('');
      setEventDescription('');
      setEventDate('');
      setEventTime('');
      setEventType('general');
      setEventLocation('');
      await fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const updateCrowdStatus = async () => {
    if (!selectedLocation || !selectedStatus) {
      toast.error('Please select location and status');
      return;
    }

    try {
      const statusColor = selectedStatus === 'low' ? 'green' : 
                         selectedStatus === 'medium' ? 'yellow' : 'red';

      const existingStatus = crowdStatuses.find(cs => cs.location === selectedLocation);
      
      if (existingStatus) {
        const { error } = await supabase
          .from('crowd_status')
          .update({
            status: selectedStatus,
            status_color: statusColor,
            description: crowdDescription || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingStatus.id);

        if (error) {
          console.error('Error updating crowd status:', error);
          toast.error(`Failed to update crowd status: ${error.message}`);
          return;
        }
      } else {
        const { error } = await supabase
          .from('crowd_status')
          .insert([{
            location: selectedLocation,
            status: selectedStatus,
            status_color: statusColor,
            description: crowdDescription || null
          }]);

        if (error) {
          console.error('Error inserting crowd status:', error);
          toast.error(`Failed to update crowd status: ${error.message}`);
          return;
        }
      }

      toast.success('Crowd status updated successfully');
      setSelectedLocation('');
      setSelectedStatus('low');
      setCrowdDescription('');
      await fetchCrowdStatuses();
    } catch (error) {
      console.error('Error updating crowd status:', error);
      toast.error('Failed to update crowd status');
    }
  };

  const toggleEventStatus = async (eventId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_active: !currentStatus })
        .eq('id', eventId);

      if (error) {
        console.error('Error updating event status:', error);
        toast.error('Failed to update event status');
        return;
      }

      toast.success('Event status updated');
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };

  const deleteFacility = async (facilityId: string) => {
    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', facilityId);

      if (error) {
        console.error('Error deleting facility:', error);
        toast.error('Failed to delete facility');
        return;
      }

      toast.success('Facility deleted successfully');
      await fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
        return;
      }

      toast.success('Event deleted successfully');
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete contact');
        return;
      }

      toast.success('Contact deleted successfully');
      await fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const addManagedFacility = async () => {
    if (!selectedFacilityType || !facilityName) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('facilities')
        .insert([{
          facility_type: selectedFacilityType,
          name: facilityName,
          contact_number: facilityContact || null,
          location_name: facilityLocationName || null,
          google_maps_link: facilityMapsLink || null,
          is_active: true
        }]);

      if (error) {
        console.error('Error adding managed facility:', error);
        toast.error(`Failed to add facility: ${error.message}`);
        return;
      }

      toast.success('Facility added successfully');
      setFacilityName('');
      setFacilityContact('');
      setFacilityLocationName('');
      setFacilityMapsLink('');
      await fetchManagedFacilities();
    } catch (error) {
      console.error('Error adding managed facility:', error);
      toast.error('Failed to add facility');
    }
  };

  const deleteManagedFacility = async (facilityId: string) => {
    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', facilityId);

      if (error) {
        console.error('Error deleting managed facility:', error);
        toast.error('Failed to delete facility');
        return;
      }

      toast.success('Facility deleted successfully');
      await fetchManagedFacilities();
    } catch (error) {
      console.error('Error deleting managed facility:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-orange-800">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-red-800">Access denied. You are not authorized to view this page.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-800">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="crowd" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="crowd">Crowd Status</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="managed-facilities">Managed Facilities</TabsTrigger>
          </TabsList>

          <TabsContent value="crowd" className="space-y-6">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100">
                <CardTitle className="text-orange-800">Crowd Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-orange-700">Location</label>
                  <Input
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    placeholder="Enter location name"
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-orange-700">Status</label>
                  <Select value={selectedStatus} onValueChange={(value: 'low' | 'medium' | 'high') => setSelectedStatus(value)}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-orange-700">Description</label>
                  <Textarea
                    value={crowdDescription}
                    onChange={(e) => setCrowdDescription(e.target.value)}
                    placeholder="Optional description"
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <Button onClick={updateCrowdStatus} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  Update Status
                </Button>
              </CardContent>
            </Card>

            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-pink-100">
                <CardTitle className="text-orange-800">Current Crowd Statuses</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {crowdStatuses.map((status) => (
                    <div key={status.id} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-gradient-to-r from-orange-50 to-pink-50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${
                          status.status_color === 'green' ? 'bg-green-500' :
                          status.status_color === 'yellow' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-orange-800">{status.location}</p>
                          <p className="text-sm text-orange-600">{status.description}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        status.status_color === 'green' ? 'bg-green-100 text-green-700' :
                        status.status_color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {status.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
                <CardTitle className="text-purple-800">Add New Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-700">Event Title *</label>
                    <Input
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-700">Event Type</label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="ritual">Ritual</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-700">Date *</label>
                    <Input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-purple-700">Time *</label>
                    <Input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-700">Location</label>
                  <Input
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Enter event location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-700">Description</label>
                  <Textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Enter event description"
                  />
                </div>
                <Button onClick={addEvent} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Add Event
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
                <CardTitle className="text-purple-800">Current Events</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="border border-purple-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-purple-800">{event.title}</h3>
                          <p className="text-sm text-purple-600">{event.description}</p>
                          <p className="text-xs text-purple-500 mt-1">
                            {event.date} at {event.time} | {event.location}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant={event.is_active ? "default" : "outline"}
                            onClick={() => toggleEventStatus(event.id, event.is_active)}
                          >
                            {event.is_active ? 'Active' : 'Inactive'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteEvent(event.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-6">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-pink-100">
                <CardTitle className="text-blue-800">Add New Facility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-700">Facility Type *</label>
                    <Select value={facilityType} onValueChange={setFacilityType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drinking-water">Drinking Water</SelectItem>
                        <SelectItem value="toilet">Toilet</SelectItem>
                        <SelectItem value="bathroom">Bathroom</SelectItem>
                        <SelectItem value="rest-room">Rest Room</SelectItem>
                        <SelectItem value="dharamshala">Dharamshala</SelectItem>
                        <SelectItem value="shivir">Shivir</SelectItem>
                        <SelectItem value="health-centre">Health Centre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-700">Facility Name *</label>
                    <Input
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      placeholder="Enter facility name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-700">Contact Number</label>
                    <Input
                      value={facilityContact}
                      onChange={(e) => setFacilityContact(e.target.value)}
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-700">Location Name</label>
                    <Input
                      value={facilityLocationName}
                      onChange={(e) => setFacilityLocationName(e.target.value)}
                      placeholder="Enter location name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-700">Google Maps Link</label>
                  <Input
                    value={facilityMapsLink}
                    onChange={(e) => setFacilityMapsLink(e.target.value)}
                    placeholder="Enter Google Maps link"
                  />
                </div>
                <Button onClick={addFacility} className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600">
                  Add Facility
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-pink-100">
                <CardTitle className="text-blue-800">Current Facilities</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilities.map((facility) => (
                    <div key={facility.id} className="border border-blue-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-pink-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-blue-800">{facility.name}</h3>
                          <p className="text-sm text-blue-600 capitalize">{facility.facility_type.replace('-', ' ')}</p>
                          <p className="text-xs text-blue-500">{facility.location_name}</p>
                          <p className="text-xs text-blue-500">{facility.contact_number}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteFacility(facility.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100 to-pink-100">
                <CardTitle className="text-green-800">Add New Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-green-700">Contact Type *</label>
                    <Input
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value)}
                      placeholder="e.g., emergency, admin, medical"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-green-700">Name *</label>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Enter contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-green-700">Phone *</label>
                    <Input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-green-700">Email</label>
                    <Input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-green-700">Designation</label>
                    <Input
                      value={contactDesignation}
                      onChange={(e) => setContactDesignation(e.target.value)}
                      placeholder="Enter designation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-green-700">Category *</label>
                    <Select value={contactCategory} onValueChange={setContactCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="district_admin">District Admin</SelectItem>
                        <SelectItem value="mmc_admin">MMC Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addContact} className="w-full bg-gradient-to-r from-green-500 to-pink-500 hover:from-green-600 hover:to-pink-600">
                  Add Contact
                </Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100 to-pink-100">
                <CardTitle className="text-green-800 flex items-center justify-between">
                  Current Contacts
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={selectedContactCategory === 'all' ? "default" : "outline"}
                      onClick={() => setSelectedContactCategory('all')}
                      className="text-xs"
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedContactCategory === 'district_admin' ? "default" : "outline"}
                      onClick={() => setSelectedContactCategory('district_admin')}
                      className="text-xs"
                    >
                      District Admin
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedContactCategory === 'mmc_admin' ? "default" : "outline"}
                      onClick={() => setSelectedContactCategory('mmc_admin')}
                      className="text-xs"
                    >
                      MMC Admin
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {filteredContacts.map((contact) => (
                    <div key={contact.id} className="border border-green-200 rounded-lg p-4 bg-gradient-to-r from-green-50 to-pink-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-green-800">{contact.name}</h3>
                          <p className="text-sm text-green-600">{contact.designation}</p>
                          <p className="text-xs text-green-500">{contact.contact_type} | {contact.phone}</p>
                          {contact.email && <p className="text-xs text-green-500">{contact.email}</p>}
                          <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium ${
                            contact.category === 'district_admin' ? 'bg-blue-100 text-blue-700' :
                            contact.category === 'mmc_admin' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {contact.category === 'district_admin' ? 'District Admin' :
                             contact.category === 'mmc_admin' ? 'MMC Admin' : 'General'}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteContact(contact.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="managed-facilities" className="space-y-6">
            <Card className="border-indigo-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-100 to-pink-100">
                <CardTitle className="text-indigo-800">Manage Facilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-indigo-700">Facility Type *</label>
                    <Select value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid-hotels">Paid Hotels</SelectItem>
                        <SelectItem value="atm">ATM</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                        <SelectItem value="bhandara">Bhandara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-indigo-700">Facility Name *</label>
                    <Input
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      placeholder="Enter facility name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-indigo-700">Contact Number</label>
                    <Input
                      value={facilityContact}
                      onChange={(e) => setFacilityContact(e.target.value)}
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-indigo-700">Location Name</label>
                    <Input
                      value={facilityLocationName}
                      onChange={(e) => setFacilityLocationName(e.target.value)}
                      placeholder="Enter location name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-indigo-700">Google Maps Link</label>
                  <Input
                    value={facilityMapsLink}
                    onChange={(e) => setFacilityMapsLink(e.target.value)}
                    placeholder="Enter Google Maps link"
                  />
                </div>
                <Button onClick={addManagedFacility} className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600">
                  Add Facility
                </Button>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-100 to-pink-100">
                <CardTitle className="text-indigo-800">Current Managed Facilities</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {['paid-hotels', 'atm', 'parking', 'bhandara'].map((type) => (
                    <div key={type}>
                      <h3 className="font-semibold text-indigo-800 mb-2 capitalize">
                        {type.replace('-', ' ')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {managedFacilities
                          .filter(facility => facility.facility_type === type)
                          .map((facility) => (
                            <div key={facility.id} className="border border-indigo-200 rounded-lg p-3 bg-gradient-to-r from-indigo-50 to-pink-50">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-indigo-800">{facility.name}</h4>
                                  {facility.contact_number && (
                                    <p className="text-xs text-indigo-600">{facility.contact_number}</p>
                                  )}
                                  {facility.location_name && (
                                    <p className="text-xs text-indigo-500">{facility.location_name}</p>
                                  )}
                                  {facility.google_maps_link && (
                                    <a 
                                      href={facility.google_maps_link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline"
                                    >
                                      View on Maps
                                    </a>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteManagedFacility(facility.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                      {managedFacilities.filter(facility => facility.facility_type === type).length === 0 && (
                        <p className="text-sm text-gray-500 italic">No facilities added yet</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
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
  is_active: boolean;
}

const AdminDashboard: React.FC = () => {
  const [crowdStatuses, setCrowdStatuses] = useState<CrowdStatus[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
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
  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    checkAdminAccess();
    fetchAllData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.email !== 'harsh171517@gmail.com') {
        navigate('/admin');
        return;
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/admin');
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchCrowdStatuses(),
      fetchEvents(),
      fetchFacilities(),
      fetchContacts()
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

  const addFacility = async () => {
    if (!facilityType || !facilityName) {
      toast({
        title: "Error",
        description: "Please fill required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Attempting to add facility:', {
        facility_type: facilityType,
        name: facilityName,
        contact_number: facilityContact || null,
        location_name: facilityLocationName || null,
        google_maps_link: facilityMapsLink || null
      });

      const { data, error } = await supabase
        .from('facilities')
        .insert([{
          facility_type: facilityType,
          name: facilityName,
          contact_number: facilityContact || null,
          location_name: facilityLocationName || null,
          google_maps_link: facilityMapsLink || null,
          is_active: true
        }])
        .select();

      if (error) {
        console.error('Supabase error adding facility:', error);
        throw error;
      }

      console.log('Facility added successfully:', data);

      toast({
        title: "Success",
        description: "Facility added successfully"
      });

      setFacilityType('');
      setFacilityName('');
      setFacilityContact('');
      setFacilityLocationName('');
      setFacilityMapsLink('');
      await fetchFacilities();
    } catch (error) {
      console.error('Error adding facility:', error);
      toast({
        title: "Error",
        description: `Failed to add facility: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const addContact = async () => {
    if (!contactType || !contactName || !contactPhone) {
      toast({
        title: "Error",
        description: "Please fill required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Attempting to add contact:', {
        contact_type: contactType,
        name: contactName,
        phone: contactPhone,
        email: contactEmail || null,
        designation: contactDesignation || null
      });

      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          contact_type: contactType,
          name: contactName,
          phone: contactPhone,
          email: contactEmail || null,
          designation: contactDesignation || null,
          is_active: true
        }])
        .select();

      if (error) {
        console.error('Supabase error adding contact:', error);
        throw error;
      }

      console.log('Contact added successfully:', data);

      toast({
        title: "Success",
        description: "Contact added successfully"
      });

      setContactType('');
      setContactName('');
      setContactPhone('');
      setContactEmail('');
      setContactDesignation('');
      await fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: `Failed to add contact: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const addEvent = async () => {
    if (!eventTitle || !eventDate || !eventTime) {
      toast({
        title: "Error",
        description: "Please fill required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Attempting to add event:', {
        title: eventTitle,
        description: eventDescription || null,
        date: eventDate,
        time: eventTime,
        event_type: eventType,
        location: eventLocation || null
      });

      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: eventTitle,
          description: eventDescription || null,
          date: eventDate,
          time: eventTime,
          event_type: eventType,
          location: eventLocation || null,
          is_active: true
        }])
        .select();

      if (error) {
        console.error('Supabase error adding event:', error);
        throw error;
      }

      console.log('Event added successfully:', data);

      toast({
        title: "Success",
        description: "Event added successfully"
      });

      setEventTitle('');
      setEventDescription('');
      setEventDate('');
      setEventTime('');
      setEventType('general');
      setEventLocation('');
      await fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Error",
        description: `Failed to add event: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const updateCrowdStatus = async () => {
    if (!selectedLocation || !selectedStatus) {
      toast({
        title: "Error",
        description: "Please select location and status",
        variant: "destructive"
      });
      return;
    }

    try {
      const statusColor = selectedStatus === 'low' ? 'green' : 
                         selectedStatus === 'medium' ? 'yellow' : 'red';

      console.log('Attempting to update crowd status:', {
        location: selectedLocation,
        status: selectedStatus,
        status_color: statusColor,
        description: crowdDescription || null
      });

      const existingStatus = crowdStatuses.find(cs => cs.location === selectedLocation);
      
      if (existingStatus) {
        const { data, error } = await supabase
          .from('crowd_status')
          .update({
            status: selectedStatus,
            status_color: statusColor,
            description: crowdDescription || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingStatus.id)
          .select();

        if (error) {
          console.error('Supabase error updating crowd status:', error);
          throw error;
        }

        console.log('Crowd status updated successfully:', data);
      } else {
        const { data, error } = await supabase
          .from('crowd_status')
          .insert([{
            location: selectedLocation,
            status: selectedStatus,
            status_color: statusColor,
            description: crowdDescription || null
          }])
          .select();

        if (error) {
          console.error('Supabase error inserting crowd status:', error);
          throw error;
        }

        console.log('Crowd status inserted successfully:', data);
      }

      toast({
        title: "Success",
        description: "Crowd status updated successfully"
      });

      await fetchCrowdStatuses();
      setSelectedLocation('');
      setSelectedStatus('low');
      setCrowdDescription('');
    } catch (error) {
      console.error('Error updating crowd status:', error);
      toast({
        title: "Error",
        description: `Failed to update crowd status: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const toggleEventStatus = async (eventId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_active: !currentStatus })
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event status updated"
      });

      fetchEvents();
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

      if (error) throw error;

      toast({
        title: "Success",
        description: "Facility deleted successfully"
      });

      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-orange-800">Loading admin dashboard...</div>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="crowd">Crowd Status</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
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
                        <Button
                          size="sm"
                          variant={event.is_active ? "default" : "outline"}
                          onClick={() => toggleEventStatus(event.id, event.is_active)}
                        >
                          {event.is_active ? 'Active' : 'Inactive'}
                        </Button>
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
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-green-700">Designation</label>
                  <Input
                    value={contactDesignation}
                    onChange={(e) => setContactDesignation(e.target.value)}
                    placeholder="Enter designation"
                  />
                </div>
                <Button onClick={addContact} className="w-full bg-gradient-to-r from-green-500 to-pink-500 hover:from-green-600 hover:to-pink-600">
                  Add Contact
                </Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100 to-pink-100">
                <CardTitle className="text-green-800">Current Contacts</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="border border-green-200 rounded-lg p-4 bg-gradient-to-r from-green-50 to-pink-50">
                      <div>
                        <h3 className="font-semibold text-green-800">{contact.name}</h3>
                        <p className="text-sm text-green-600">{contact.designation}</p>
                        <p className="text-xs text-green-500">{contact.contact_type} | {contact.phone}</p>
                        {contact.email && <p className="text-xs text-green-500">{contact.email}</p>}
                      </div>
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


import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FacilityDetail = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  const facilityData = {
    'ambulance': {
      title: 'Ambulance Services',
      icon: '🚑',
      description: 'Emergency medical assistance available 24/7 during the mela period.',
      contact: '+91-9876543210',
      location: 'Near Main Entrance Gate',
      features: ['24/7 Availability', 'Trained Medical Staff', 'Emergency Equipment', 'Quick Response']
    },
    'police-station': {
      title: 'Police Station',
      icon: '👮',
      description: 'Security and law enforcement services for visitor safety.',
      contact: '+91-9876543211',
      location: 'Central Security Post',
      features: ['24/7 Security', 'Lost & Found', 'Emergency Response', 'Crowd Management']
    },
    'toilet': {
      title: 'Public Toilets',
      icon: '🚻',
      description: 'Clean and well-maintained restroom facilities.',
      contact: 'Maintenance: +91-9876543212',
      location: 'Multiple locations throughout the mela',
      features: ['Clean Facilities', 'Regular Maintenance', 'Accessibility Features', 'Hand Washing']
    },
    'parking': {
      title: 'Parking Areas',
      icon: '🅿️',
      description: 'Designated parking spaces for vehicles of all types.',
      contact: 'Parking Help: +91-9876543213',
      location: 'Multiple parking zones',
      features: ['Two Wheeler Parking', 'Four Wheeler Parking', 'Bus Parking', 'Security Available']
    },
    'health-centre': {
      title: 'Health Centre',
      icon: '🏥',
      description: 'Medical facility providing basic healthcare services.',
      contact: '+91-9876543214',
      location: 'Near Information Center',
      features: ['First Aid', 'Basic Treatment', 'Medicine Availability', 'Qualified Doctors']
    },
    'atm': {
      title: 'ATM Services',
      icon: '🏧',
      description: 'Banking and cash withdrawal facilities.',
      contact: 'Bank Support: 1800-xxx-xxxx',
      location: 'Near Main Market Area',
      features: ['24/7 Cash Withdrawal', 'Multiple Bank ATMs', 'Balance Inquiry', 'Mini Statements']
    },
    'fire-brigade': {
      title: 'Fire Brigade',
      icon: '🚒',
      description: 'Fire safety and emergency response services.',
      contact: '+91-9876543215',
      location: 'Emergency Services Area',
      features: ['Fire Safety', 'Emergency Response', 'Rescue Operations', 'Safety Equipment']
    },
    'gallery': {
      title: 'Photo Gallery',
      icon: '🖼️',
      description: 'View beautiful moments captured during the mela.',
      contact: 'Gallery Admin: +91-9876543216',
      location: 'Information Center',
      features: ['Daily Photos', 'Event Highlights', 'Download Options', 'Contest Entries']
    }
  };

  const facility = facilityData[type as keyof typeof facilityData] || {
    title: 'Facility Information',
    icon: '📍',
    description: 'Detailed information about this facility.',
    contact: 'Contact information not available',
    location: 'Location details',
    features: ['Service 1', 'Service 2', 'Service 3', 'Service 4']
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="text-white">
            ← 
          </button>
          <h1 className="text-lg font-semibold">{facility.title}</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Facility Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 card-gradient rounded-2xl flex items-center justify-center">
              <span className="text-3xl">{facility.icon}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{facility.title}</h2>
            <p className="text-gray-600">{facility.description}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-lg">📞</span>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{facility.contact}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-lg">📍</span>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-800">{facility.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Services</h3>
          <div className="grid grid-cols-2 gap-3">
            {facility.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Map</h3>
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <span className="text-4xl mb-2 block">🗺️</span>
              <p className="text-sm">Interactive map coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetail;


import React from 'react';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const navigate = useNavigate();

  const events = [
    {
      date: 'Jul 13',
      time: '2:00 PM',
      title: 'श्रावणी मेला उद्घाटन',
      description: 'श्री विजय कुमार सिन्हा \(उपमुख्यमंत्री बिहार\) द्वारा उद्घाटन',
      type: 'सांस्कृतिक'
    },
    {
      date: 'Jul 14',
      time: '4:00 AM',
      title: 'पहली सोमवारी',
      description: 'जलार्पण',
      type: 'धार्मिक'
    },
    {
      date: 'Jul 21',
      time: '5:00 AM',
      title: 'दूसरी सोमवारी',
      description: 'जलार्पण',
      type: 'धार्मिक'
    },
    {
      date: 'Jul 28',
      time: '5:00 AM',
      title: 'तिसरी सोमवारी',
      description: 'जलार्पण',
      type: 'धार्मिक'
    },
     {
      date: 'Aug 4',
      time: '5:00 AM',
      title: 'चौथी सोमवारी',
      description: 'जलार्पण',
      type: 'धार्मिक'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="text-white">
            ← 
          </button>
          <h1 className="text-lg font-semibold">श्रावणी मेला कार्यक्रम</h1>
        </div>
      </div>

      
        {/* Current Event */}
       

        {/* Upcoming Events */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">कार्यक्रम</h3>
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="text-center min-w-[60px]">
                    <div className="app-gradient text-white rounded-lg px-2 py-1">
                      <div className="text-xs font-medium">{event.date}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{event.time}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.type === 'ritual' ? 'bg-purple-100 text-purple-700' :
                      event.type === 'cultural' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

       
        
       // </div>
     </div>
    </div>
  );
};

export default Events;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FacilitySection = () => {
  const facilities = [
    {
      name: 'Drinking Water',
      description: 'Clean drinking water stations',
      icon: '💧'
    },
    {
      name: 'Toilets',
      description: 'Clean public facilities',
      icon: '🚻'
    },
    {
      name: 'Parking',
      description: 'Secure vehicle parking',
      icon: '🅿️'
    },
    {
      name: 'Food Courts',
      description: 'Various food options',
      icon: '🍽️'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Available Facilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((facility, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-3xl mb-2">{facility.icon}</div>
                <CardTitle className="text-lg text-gray-800">{facility.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{facility.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitySection;

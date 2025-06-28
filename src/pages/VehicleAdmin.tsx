
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Search, Plus } from "lucide-react";
import VehicleRegistrationForm from "@/components/VehicleRegistrationForm";
import VehicleSearch from "@/components/VehicleSearch";
import { useLanguage } from "@/contexts/LanguageContext";

const VehicleAdmin = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Car className="h-10 w-10 text-blue-600" />
            {t('vehicle_admin_panel')}
          </h1>
          <p className="text-gray-600">{t('manage_vehicle_registrations')}</p>
        </div>

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="register" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('register_vehicle')}
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t('search_vehicle')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>{t('register_new_vehicle')}</CardTitle>
                <CardDescription>
                  {t('register_new_vehicle_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleRegistrationForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>{t('search_vehicle')}</CardTitle>
                <CardDescription>
                  {t('search_vehicle_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleSearch />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VehicleAdmin;

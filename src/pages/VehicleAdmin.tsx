
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Search, Plus } from "lucide-react";
import VehicleRegistrationForm from "@/components/VehicleRegistrationForm";
import VehicleSearch from "@/components/VehicleSearch";

const VehicleAdmin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Car className="h-10 w-10 text-blue-600" />
            Vehicle Admin Panel
          </h1>
          <p className="text-gray-600">Manage vehicle registrations and parking status</p>
        </div>

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="register" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Register Vehicle
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Vehicle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register New Vehicle</CardTitle>
                <CardDescription>
                  Register a new vehicle in the parking system
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
                <CardTitle>Search Vehicle</CardTitle>
                <CardDescription>
                  Search for a registered vehicle using vehicle ID
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

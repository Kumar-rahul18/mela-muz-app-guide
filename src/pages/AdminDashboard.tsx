
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, FileText, MessageSquare, Camera, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import AdminFeedbackViewer from '@/components/AdminFeedbackViewer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalFeedbacks: 0,
    totalPhotoSubmissions: 0,
    totalComplaints: 0,
    totalVehicles: 0,
  });

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = () => {
      const adminSession = localStorage.getItem('adminSession');
      if (!adminSession) {
        navigate('/admin');
        return;
      }

      try {
        const sessionData = JSON.parse(adminSession);
        if (sessionData.username !== 'MMCMUZAFFARPUR' || !sessionData.isAdmin) {
          navigate('/admin');
          return;
        }
      } catch (error) {
        navigate('/admin');
        return;
      }
    };

    checkAdminStatus();
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      // Fetch contacts count
      const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      // Fetch feedbacks count
      const { count: feedbacksCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true });

      // Fetch photo submissions count
      const { count: photoSubmissionsCount } = await supabase
        .from('photo_contest_submissions')
        .select('*', { count: 'exact', head: true });

      // Fetch complaints count
      const { count: complaintsCount } = await supabase
        .from('complaints')
        .select('*', { count: 'exact', head: true });

      // Fetch vehicles count
      const { count: vehiclesCount } = await supabase
        .from('vehicle_registrations')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalContacts: contactsCount || 0,
        totalFeedbacks: feedbacksCount || 0,
        totalPhotoSubmissions: photoSubmissionsCount || 0,
        totalComplaints: complaintsCount || 0,
        totalVehicles: vehiclesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/')} className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-red-600">
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContacts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Photo Submissions</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPhotoSubmissions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComplaints}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="feedbacks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feedbacks">User Feedbacks</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feedbacks" className="mt-6">
            <AdminFeedbackViewer />
          </TabsContent>
          
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Overview of all system components and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalFeedbacks}</div>
                      <div className="text-sm text-blue-700">User Feedbacks</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.totalContacts}</div>
                      <div className="text-sm text-green-700">Total Contacts</div>
                    </div>
                  </div>
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

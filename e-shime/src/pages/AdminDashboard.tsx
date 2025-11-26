import { motion } from 'motion/react';
import { Users, MessageSquare, TrendingUp, AlertCircle, Calendar, FileText, BarChart3 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  darkMode: boolean;
}

const stats = [
  { label: "Total Users", value: "2,847", change: "+12%", icon: <Users className="h-6 w-6" />, color: "bg-blue-500" },
  { label: "Active Therapists", value: "24", change: "+2", icon: <Users className="h-6 w-6" />, color: "bg-green-500" },
  { label: "Chat Sessions", value: "1,523", change: "+8%", icon: <MessageSquare className="h-6 w-6" />, color: "bg-purple-500" },
  { label: "Crisis Interventions", value: "18", change: "-3", icon: <AlertCircle className="h-6 w-6" />, color: "bg-red-500" },
];

const userActivityData = [
  { month: 'May', users: 1200 },
  { month: 'Jun', users: 1500 },
  { month: 'Jul', users: 1800 },
  { month: 'Aug', users: 2100 },
  { month: 'Sep', users: 2400 },
  { month: 'Oct', users: 2650 },
  { month: 'Nov', users: 2847 },
];

const moodDistributionData = [
  { name: 'Happy', value: 35, color: '#10b981' },
  { name: 'Calm', value: 25, color: '#3b82f6' },
  { name: 'Neutral', value: 20, color: '#fbbf24' },
  { name: 'Sad', value: 15, color: '#f97316' },
  { name: 'Anxious', value: 5, color: '#ef4444' },
];

const recentUsers = [
  { id: 1, name: "User #2847", joined: "Nov 5, 2025", status: "Active", sessions: 3 },
  { id: 2, name: "User #2846", joined: "Nov 5, 2025", status: "Active", sessions: 1 },
  { id: 3, name: "User #2845", joined: "Nov 4, 2025", status: "Active", sessions: 5 },
  { id: 4, name: "User #2844", joined: "Nov 4, 2025", status: "Inactive", sessions: 2 },
  { id: 5, name: "User #2843", joined: "Nov 3, 2025", status: "Active", sessions: 7 },
];

const therapistData = [
  { id: 1, name: "Dr. Amani Uwase", sessions: 45, rating: 4.9, status: "Available" },
  { id: 2, name: "Dr. Jean Mugabo", sessions: 38, rating: 4.8, status: "In Session" },
  { id: 3, name: "Dr. Grace Mutesi", sessions: 52, rating: 4.9, status: "Available" },
  { id: 4, name: "Dr. David Nkusi", sessions: 31, rating: 4.7, status: "Off Duty" },
];

export function AdminDashboard({ darkMode }: AdminDashboardProps) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#F5F5DC]'} transition-colors duration-300 pb-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>
            Admin Dashboard
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Platform overview and management
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.color} text-white p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  {stat.label}
                </p>
                <p className={`text-2xl ${darkMode ? 'text-white' : 'text-black'}`}>
                  {stat.value}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-6`}>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className={`h-5 w-5 ${darkMode ? 'text-beige' : 'text-black'}`} />
                <h3 className={darkMode ? 'text-white' : 'text-black'}>
                  User Growth
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis
                      dataKey="month"
                      stroke={darkMode ? '#9ca3af' : '#6b7280'}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke={darkMode ? '#9ca3af' : '#6b7280'}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Mood Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} p-6`}>
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className={`h-5 w-5 ${darkMode ? 'text-beige' : 'text-black'}`} />
                <h3 className={darkMode ? 'text-white' : 'text-black'}>
                  Mood Distribution
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moodDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <Tabs defaultValue="users" className="p-6">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="therapists">Therapists</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users">
                <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                  Recent Users
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>User ID</TableHead>
                        <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Joined</TableHead>
                        <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Status</TableHead>
                        <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Sessions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {user.name}
                          </TableCell>
                          <TableCell className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {user.joined}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {user.sessions}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Therapists Tab */}
              <TabsContent value="therapists">
                <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                  Therapist Management
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Name</TableHead>
                        <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Sessions</TableHead>
                        <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Rating</TableHead>
                        <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {therapistData.map((therapist) => (
                        <TableRow key={therapist.id}>
                          <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {therapist.name}
                          </TableCell>
                          <TableCell className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {therapist.sessions}
                          </TableCell>
                          <TableCell className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            ⭐ {therapist.rating}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              therapist.status === 'Available'
                                ? 'bg-green-100 text-green-800'
                                : therapist.status === 'In Session'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {therapist.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports">
                <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                  Platform Reports
                </h3>
                <div className="space-y-4">
                  <Card className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`${darkMode ? 'text-white' : 'text-black'} mb-1`}>
                          Weekly Activity Report
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Generated on Nov 5, 2025
                        </p>
                      </div>
                      <FileText className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                  </Card>
                  <Card className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`${darkMode ? 'text-white' : 'text-black'} mb-1`}>
                          Monthly User Engagement
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          October 2025
                        </p>
                      </div>
                      <FileText className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                  </Card>
                  <Card className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`${darkMode ? 'text-white' : 'text-black'} mb-1`}>
                          Crisis Intervention Summary
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Last 30 days
                        </p>
                      </div>
                      <AlertCircle className={`h-6 w-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content">
                <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-4`}>
                  Content Moderation
                </h3>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-8 text-center`}>
                  <FileText className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No pending content moderation items
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

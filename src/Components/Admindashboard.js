// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   LayoutDashboard, 
//   Users, 
//   Car, 
//   MapPin, 
//   Settings, 
//   LogOut, 
//   ChevronLeft,
//   ChevronRight,
//   Loader2
// } from 'lucide-react';
// import '../CSS/Admindashboard.css';
// import '../Styles.css'

// const AdminDashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalDrivers, setTotalDrivers] = useState(0);
//   const [totalRides, setTotalRides] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const usersResponse = await fetch('http://localhost:5000/api/user/count');
//         const driversResponse = await fetch('http://localhost:5000/api/driver/count');
//         const ridesResponse = await fetch('http://localhost:5000/api/rides/count');

//         if (!usersResponse.ok || !driversResponse.ok || !ridesResponse.ok) {
//           throw new Error('Failed to fetch one or more resources');
//         }

//         const usersData = await usersResponse.json();
//         const driversData = await driversResponse.json();
//         const ridesData = await ridesResponse.json();

//         setTotalUsers(usersData.count);
//         setTotalDrivers(driversData.count);
//         setTotalRides(ridesData.count);
//         setLoading(false);
//       } catch (error) {
//         setError('Error fetching data. Please try again later.');
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900">
//         <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-red-400 bg-red-900 bg-opacity-20 rounded-lg">
//         {error}
//       </div>
//     );
//   }

//   const stats = [
//     {
//       title: "Total Users",
//       value: totalUsers,
//       icon: Users,
//     },
//     {
//       title: "Total Drivers",
//       value: totalDrivers,
//       icon: Car,
//     },
//     {
//       title: "Total Rides",
//       value: totalRides,
//       icon: MapPin,
//     },
//   ];

//   const menuItems = [
//     { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
//     { title: 'Users', icon: <Users size={20} />, path: '/admin-users' },
//     { title: 'Drivers', icon: <Car size={20} />, path: '/admin-drivers' },
//     { title: 'Rides', icon: <MapPin size={20} />, path: '/admin-rides' },
//     { title: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
//   ];

//   return (
//     <div className="admin-dashboard flex">
//       {/* Sidebar */}
//       <div 
//         className={`relative min-h-screen border-r border-gray-200 bg-black/70 transition-all duration-300 ease-in-out
//           ${isCollapsed ? 'w-20' : 'w-64'}`}
//       >
//         {/* Toggle Button */}
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="absolute -right-3 top-6 bg-white border border-gray-200 text-gray-600 
//             rounded-full p-1.5 shadow-sm hover:bg-gray-50 transition-colors duration-200"
//         >
//           {isCollapsed ? 
//             <ChevronRight size={16} /> : 
//             <ChevronLeft size={16} />
//           }
//         </button>

//         {/* Header */}
//         <div className="p-6 border-b border-gray-200">
//           <h2 className={`text-xl font-bold text-black/90 overflow-hidden whitespace-nowrap
//             transition-all duration-300 ${isCollapsed ? 'scale-0' : 'scale-100'}`}>
//             Admin Panel
//           </h2>
//         </div>

//         {/* Navigation */}
//         <nav className="px-3 py-4">
//           <ul className="space-y-1">
//             {menuItems.map((item, index) => (
//               <li key={index}>
//                 <Link 
//                   to={item.path}
//                   className="flex items-center gap-4 p-3 rounded-lg text-black/90
//                     hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 
//                     group relative overflow-hidden"
//                 >
//                   <span className="transition-transform duration-200 group-hover:scale-110 relative z-10">
//                     {item.icon}
//                   </span>
//                   <span className={`whitespace-nowrap transition-all duration-300 font-medium relative z-10
//                     ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
//                     {item.title}
//                   </span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Logout Button */}
//         <div className="absolute bottom-8 w-full px-4">
//           <button 
//             className="flex items-center gap-4 w-full p-3 rounded-lg 
//               text-black/90 hover:text-yellow-600 hover:bg-yellow-50
//               transition-all duration-200 group"
//           >
//             <span className="transition-transform duration-200 group-hover:scale-110">
//               <LogOut size={20} />
//             </span>
//             <span className={`whitespace-nowrap transition-all duration-300 font-medium
//               ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
//               Logout
//             </span>
//           </button>
//         </div>

//         {/* Subtle Bottom Border */}
//         <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
//       </div>

//       {/* Dashboard Content */}
//       <div className="dashboard-content flex-grow p-6">
//         <div className="min-h-screen bg-black/70 p-6">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-2 text-white">
//               Welcome to Admin Dashboard
//             </h1>
//             <p className="text-gray-400">
//               Monitor and manage your platform's activity
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {stats.map((stat, index) => (
//               <div 
//                 key={index} 
//                 className="bg-gray-600 p-6 rounded-lg shadow-xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-gray-700 border border-gray-700"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium mb-1 text-gray-400">
//                       {stat.title}
//                     </p>
//                     <p className="text-3xl font-bold text-yellow-500">
//                       {stat.value.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="p-4 rounded-full bg-gray-600 bg-opacity-50">
//                     <stat.icon className="w-6 h-6 text-yellow-500" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Overview Panel */}
//             <div className="bg-gray-600 rounded-lg shadow-xl border border-gray-99900">
//               <div className="p-6">
//                 <h2 className="text-xl font-bold mb-4 text-white">
//                   Quick Overview
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="p-4 rounded-lg bg-gray-900 bg-opacity-50">
//                     <p className="text-sm font-medium text-gray-400">
//                       Platform Status
//                     </p>
//                     <div className="flex items-center mt-1">
//                       <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
//                       <p className="text-lg text-white">Active</p>
//                     </div>
//                   </div>
//                   <div className="p-4 rounded-lg bg-gray-900 bg-opacity-50">
//                     <p className="text-sm font-medium text-gray-400">
//                       Last Updated
//                     </p>
//                     <p className="text-lg text-white mt-1">
//                       {new Date().toLocaleTimeString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Activity Panel */}
//             <div className="bg-gray-600 rounded-lg shadow-xl border border-gray-700">
//               <div className="p-6">
//                 <h2 className="text-xl font-bold mb-4 text-white">
//                   Recent Activity
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="p-4 rounded-lg bg-gray-900 bg-opacity-50">
//                     <p className="text-sm font-medium text-gray-400">
//                       User Registrations
//                     </p>
//                     <p className="text-lg text-white mt-1">
//                       {totalUsers} new registrations today
//                     </p>
//                   </div>
//                   <div className="p-4 rounded-lg bg-gray-900 bg-opacity-50">
//                     <p className="text-sm font-medium text-gray-400">
//                       Rides Completed
//                     </p>
//                     <p className="text-lg text-white mt-1">
//                       {totalRides} rides completed today
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import '../Styles.css';
import ManageDrivers from './ManageDrivers';
import ManageRides from './ManageRides';
import ManageUsers from './ManageUsers';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

const AdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeContent, setActiveContent] = useState("Dashboard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch('http://localhost:5000/api/user/count');
        const driversResponse = await fetch('http://localhost:5000/api/driver/count');
        const ridesResponse = await fetch('http://localhost:5000/api/rides/count');

        if (!usersResponse.ok || !driversResponse.ok || !ridesResponse.ok) {
          throw new Error('Failed to fetch one or more resources');
        }

        const usersData = await usersResponse.json();
        const driversData = await driversResponse.json();
        const ridesData = await ridesResponse.json();

        setTotalUsers(usersData.count);
        setTotalDrivers(driversData.count);
        setTotalRides(ridesData.count);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data. Please try again later.');
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-900 bg-opacity-20 rounded-lg">
        {error}
      </div>
    );
  }

  const stats = [
    { title: "Total Users", value: totalUsers, icon: Users },
    { title: "Total Drivers", value: totalDrivers, icon: Car },
    { title: "Total Rides", value: totalRides, icon: MapPin },
  ];

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard },
    { title: 'Users', icon: Users },
    { title: 'Drivers', icon: Car },
    { title: 'Rides', icon: MapPin },
    { title: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeContent) {
      case "Dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome to Admin Dashboard</h1>
            <p className="text-gray-400">Monitor and manage your platform's activity</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-600 p-6 rounded-lg shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-700 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-400">{stat.title}</p>
                      <p className="text-3xl font-bold text-yellow-500">{stat.value.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-full bg-gray-600 bg-opacity-50">
                      <stat.icon className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "Users":
        return <ManageUsers />;
      case "Drivers":
        return <ManageDrivers />;
      case "Rides":
        return <ManageRides />;
      case "Settings":
        return <div className="text-white">Settings content goes here...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard flex">
      {/* Sidebar */}
      <div className={`relative min-h-screen border-r border-gray-200 bg-black/70 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 text-gray-600 rounded-full p-1.5 shadow-sm hover:bg-gray-50 transition-colors duration-200"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="p-6 border-b border-gray-200">
          <h2 className={`text-xl font-bold text-black/90 transition-all duration-300 ${isCollapsed ? 'scale-0' : 'scale-100'}`}>
            Admin Panel
          </h2>
        </div>

        <nav className="px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button 
                  onClick={() => setActiveContent(item.title)}
                  className="flex items-center gap-4 p-3 rounded-lg text-black/90 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 group"
                >
                  <item.icon size={20} />
                  <span className={`whitespace-nowrap font-medium ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-8 w-full px-4">
          <button className="flex items-center gap-4 w-full p-3 rounded-lg text-black/90 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-200 group">
            <LogOut size={20} />
            <span className={`whitespace-nowrap font-medium ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content flex-grow p-6 bg-black/70">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;

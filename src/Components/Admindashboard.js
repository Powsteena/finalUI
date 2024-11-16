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
  Loader2,
} from 'lucide-react';

const AdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeContent, setActiveContent] = useState('Dashboard');

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
        <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
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
    { title: 'Total Users', value: totalUsers, icon: Users },
    { title: 'Total Drivers', value: totalDrivers, icon: Car },
    { title: 'Total Rides', value: totalRides, icon: MapPin },
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
      case 'Dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4 text-white">Admin Dashboard</h1>
            <p className="text-gray-100">Monitor and manage platform activity</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-black p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-t-4 border-yellow-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-400">{stat.title}</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-full bg-gray-900">
                      <stat.icon className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Users':
        return <ManageUsers />;
      case 'Drivers':
        return <ManageDrivers />;
      case 'Rides':
        return <ManageRides />;
      case 'Settings':
        return <div className="text-black">Settings content goes here...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard flex bg-black/80 min-h-screen">
      {/* Sidebar */}
      <div
        className={`relative border-r border-gray-200 bg-black text-white transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-yellow-600 text-black rounded-full p-1.5 shadow-md hover:bg-yellow-600 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="p-6 border-b border-gray-700">
          <h2
            className={`text-2xl font-bold transition-all duration-300 ${
              isCollapsed ? 'scale-0' : 'scale-100'
            }`}
          >
            Admin Panel
          </h2>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveContent(item.title)}
              className="flex items-center gap-5 p-3 rounded-lg text-white hover: transition-colors"
            >
              <item.icon size={24} className="text-yellow-600" />
              <span
                className={`whitespace-nowrap font-medium transition-all ${
                  isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                }`}
              >
                {item.title}
              </span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 w-full px-4">
          <button className="flex items-center gap-4 w-full p-3 rounded-lg text-white hover:bg-yellow-600 transition-colors">
            <LogOut size={24} className="text-yellow-600" />
            <span
              className={`whitespace-nowrap font-medium transition-all ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content flex-grow p-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;



// import React, { useState, useEffect } from 'react';
// import '../Styles.css';
// import ManageDrivers from './ManageDrivers';
// import ManageRides from './ManageRides';
// import ManageUsers from './ManageUsers';
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

// const AdminDashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalDrivers, setTotalDrivers] = useState(0);
//   const [totalRides, setTotalRides] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeContent, setActiveContent] = useState("Dashboard");

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
//         <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
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
//     { title: "Total Users", value: totalUsers, icon: Users },
//     { title: "Total Drivers", value: totalDrivers, icon: Car },
//     { title: "Total Rides", value: totalRides, icon: MapPin },
//   ];

//   const menuItems = [
//     { title: 'Dashboard', icon: LayoutDashboard },
//     { title: 'Users', icon: Users },
//     { title: 'Drivers', icon: Car },
//     { title: 'Rides', icon: MapPin },
//     { title: 'Settings', icon: Settings },
//   ];

//   const renderContent = () => {
//     switch (activeContent) {
//       case "Dashboard":
//         return (
//           <div>
//             <h1 className="text-3xl font-bold mb-2 text-white">Welcome to Admin Dashboard</h1>
//             <p className="text-gray-400">Monitor and manage your platform's activity</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//               {stats.map((stat, index) => (
//                 <div key={index} className="bg-gray-600 p-6 rounded-lg shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-700 border border-gray-700">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium mb-1 text-gray-400">{stat.title}</p>
//                       <p className="text-3xl font-bold text-yellow-600">{stat.value.toLocaleString()}</p>
//                     </div>
//                     <div className="p-4 rounded-full bg-gray-600 bg-opacity-50">
//                       <stat.icon className="w-6 h-6 text-yellow-600" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       case "Users":
//         return <ManageUsers />;
//       case "Drivers":
//         return <ManageDrivers />;
//       case "Rides":
//         return <ManageRides />;
//       case "Settings":
//         return <div className="text-white">Settings content goes here...</div>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="admin-dashboard flex">
//       {/* Sidebar */}
//       <div className={`relative min-h-screen border-r border-gray-200 bg-white/70 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="absolute -right-3 top-6 bg-white border border-gray-200 text-gray-600 rounded-full p-1.5 shadow-sm hover:bg-gray-50 transition-colors duration-200"
//         >
//           {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
//         </button>

//         <div className="p-6 border-b border-gray-200">
//           <h2 className={`text-xl font-bold text-black/90 transition-all duration-300 ${isCollapsed ? 'scale-0' : 'scale-100'}`}>
//             Admin Panel
//           </h2>
//         </div>

//         <nav className="px-3 py-4">
//           <ul className="space-y-1">
//             {menuItems.map((item, index) => (
//               <li key={index}>
//                 <button 
//                   onClick={() => setActiveContent(item.title)}
//                   className="flex items-center gap-4 p-3 rounded-lg text-black/90 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 group"
//                 >
//                   <item.icon size={20} />
//                   <span className={`whitespace-nowrap font-medium ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{item.title}</span>
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         <div className="absolute bottom-8 w-full px-4">
//           <button className="flex items-center gap-4 w-full p-3 rounded-lg text-black/90 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-200 group">
//             <LogOut size={20} />
//             <span className={`whitespace-nowrap font-medium ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Logout</span>
//           </button>
//         </div>
//       </div>

//       {/* Dashboard Content */}
//       <div className="dashboard-content flex-grow p-6 bg-white/70">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

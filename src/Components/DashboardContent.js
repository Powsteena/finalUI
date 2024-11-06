// import React, { useState, useEffect } from 'react';

// const DashboardContent = () => {
//   // State to store counts and loading/error state
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [totalDrivers, setTotalDrivers] = useState(0);
//   const [totalRides, setTotalRides] = useState(0);
//   const [loading, setLoading] = useState(true);  // Track loading state
//   const [error, setError] = useState(null);      // Track error state

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Update with the full URL including the port number
//         const usersResponse = await fetch('http://localhost:5000/api/user/count');
//         const driversResponse = await fetch('http://localhost:5000/api/driver/count');
//         const ridesResponse = await fetch('http://localhost:5000/api/ride-request/count');

//         // Check if responses are not OK (status code other than 2xx)
//         if (!usersResponse.ok || !driversResponse.ok || !ridesResponse.ok) {
//           throw new Error('Failed to fetch one or more resources');
//         }

//         // Parse the JSON data
//         const usersData = await usersResponse.json();
//         const driversData = await driversResponse.json();
//         const ridesData = await ridesResponse.json();

//         // Set the state with the fetched counts
//         setTotalUsers(usersData.count);
//         setTotalDrivers(driversData.count);
//         setTotalRides(ridesData.count);
//         setLoading(false); // Set loading to false after data is fetched
//       } catch (error) {
//         setError('Error fetching data. Please try again later.');
//         console.error('Error fetching data:', error);
//         setLoading(false); // Set loading to false in case of error
//       }
//     };

//     fetchData();
//   }, []);

//   // Show loading state
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Show error message if there's an error
//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="container mt-4">
//       <h1>Welcome to the Admin Dashboard</h1>
//       <p>Here you can manage users, drivers, and rides.</p>

//       <div className="row">
//         <div className="col-md-4">
//           <div className="card mb-4 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Total Users</h5>
//               <p className="card-text">{totalUsers}</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="card mb-4 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Total Drivers</h5>
//               <p className="card-text">{totalDrivers}</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="card mb-4 shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Total Rides</h5>
//               <p className="card-text">{totalRides}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardContent;

// import React, { useState, useEffect } from 'react';
// import { Users, Car, MapPin, Loader2 } from 'lucide-react';

// const DashboardContent = () => {
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
//         const ridesResponse = await fetch('http://localhost:5000/api/ride-request/count');

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
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#FA7E0A' }} />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-red-500 bg-red-100 rounded-lg">
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

//   return (
//     <div className="p-6">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold mb-2" style={{ color: '#530c0c' }}>
//           Welcome to Admin Dashboard
//         </h1>
//         <p className="text-gray-600">
//           Monitor and manage your platform's activity
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {stats.map((stat, index) => (
//           <div 
//             key={index} 
//             className="p-6 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:scale-105"
//             style={{ backgroundColor: '#530c0c' }}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium mb-1" style={{ color: '#FA7E0A' }}>
//                   {stat.title}
//                 </p>
//                 <p className="text-3xl font-bold" style={{ color: '#FA7E0A' }}>
//                   {stat.value.toLocaleString()}
//                 </p>
//               </div>
//               <div 
//                 className="p-4 rounded-full" 
//                 style={{ backgroundColor: 'rgba(250, 126, 10, 0.1)' }}
//               >
//                 <stat.icon 
//                   className="w-6 h-6" 
//                   style={{ color: '#FA7E0A' }} 
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Additional Content Section */}
//       <div className="mt-8 p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#530c0c' }}>
//         <h2 className="text-xl font-bold mb-4" style={{ color: '#FA7E0A' }}>
//           Quick Overview
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="p-4 rounded-lg bg-white bg-opacity-5">
//             <p className="text-sm font-medium" style={{ color: '#FA7E0A' }}>
//               Platform Status
//             </p>
//             <p className="text-lg mt-1 text-white">
//               Active
//             </p>
//           </div>
//           <div className="p-4 rounded-lg bg-white bg-opacity-5">
//             <p className="text-sm font-medium" style={{ color: '#FA7E0A' }}>
//               Last Updated
//             </p>
//             <p className="text-lg mt-1 text-white">
//               {new Date().toLocaleTimeString()}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardContent;


import React, { useState, useEffect } from 'react';
import { Users, Car, MapPin, Loader2 } from 'lucide-react';

const DashboardContent = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
    },
    {
      title: "Total Drivers",
      value: totalDrivers,
      icon: Car,
    },
    {
      title: "Total Rides",
      value: totalRides,
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-black/70 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-gray-400">
          Monitor and manage your platform's activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-gray-600 p-6 rounded-lg shadow-xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-gray-700 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1 text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-yellow-500">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-full bg-gray-600 bg-opacity-50">
                <stat.icon className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview Panel */}
        <div className="bg-gray-600 rounded-lg shadow-xl border border-gray-99900">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Quick Overview
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-900 bg-opacity-50">
                <p className="text-sm font-medium text-gray-400">
                  Platform Status
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-lg text-white">Active</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-900 bg-opacity-50">
                <p className="text-sm font-medium text-gray-400">
                  Last Updated
                </p>
                <p className="text-lg text-white mt-1">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Panel */}
        <div className="bg-gray-600 rounded-lg shadow-xl border border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900 bg-opacity-50">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-yellow-500 mr-3" />
                  <p className="text-gray-300">New User Registration</p>
                </div>
                <span className="text-sm text-gray-400">5m ago</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900 bg-opacity-50">
                <div className="flex items-center">
                  <Car className="w-5 h-5 text-yellow-500 mr-3" />
                  <p className="text-gray-300">New Driver Onboarded</p>
                </div>
                <span className="text-sm text-gray-400">15m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
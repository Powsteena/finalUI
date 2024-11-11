// import React from 'react';
// import MatchingRides from './MatchingRides';
// import Footer from './Footer';
// import Navbar from './Navbar';

// const DriverPanel = () => (
//     <div>
//       <Navbar />
//         <h1>Driver Panel</h1>
//         <MatchingRides />
//         <Footer />
//     </div>
// );

// export default DriverPanel;

import React, { useState } from 'react';
import MatchingRides from './MatchingRides';
import CompletedRides from './CompletedRides';
import Footer from './Footer';
import Navbar from './Navbar';

const DriverPanel = () => {
    const [activeTab, setActiveTab] = useState('matching'); // default tab

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <div className="flex-grow container mx-auto px-15 py-14 mt-10"> {/* Added margin-top to give space after navbar */}
                
                {/* Tabs for Matching Rides and Completed Rides */}
                <div className="flex justify-center space-x-4 mb-6">
                    <button 
                        className={`py-2 px-4 text-lg font-semibold ${activeTab === 'matching' ? 'text-white bg-black/90' : 'text-yellow-600 bg-white'} border border-red-600 rounded-md hover:bg-white-700 transition duration-200`} 
                        onClick={() => setActiveTab('matching')}
                    >
                       Rides
                    </button>
                    <button 
                        className={`py-2 px-4 text-lg font-semibold ${activeTab === 'completed' ? 'text-white bg-black/90' : 'text-yellow-600 bg-white'} border border-red-600 rounded-md hover:bg-white-700 transition duration-200`} 
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed Rides
                    </button>
                </div>

                {/* Conditionally Render Matching or Completed Rides */}
                <div className="bg-white p-4 shadow-lg rounded-lg">
                    {activeTab === 'matching' ? <MatchingRides /> : <CompletedRides />}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DriverPanel;

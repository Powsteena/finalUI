import React from 'react';
import MatchingRides from './MatchingRides';
import Footer from './Footer';
import Navbar from './Navbar';

const DriverPanel = () => (
    <div>
      <Navbar />
        <h1>Driver Panel</h1>
        <MatchingRides />
        <Footer />
    </div>
);

export default DriverPanel;

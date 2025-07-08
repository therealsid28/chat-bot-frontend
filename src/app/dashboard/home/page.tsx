import DashboardStats from '@/components/DashboardStats';
import React from 'react';

function DashboardHome() {
  return (
    <div className="container mx-auto px-4 py-4 md:px-12 2xl:max-w-[1400px]">
      <h2 className="text-2xl font-semibold tracking-wide pb-6">Dashboard</h2>
      <DashboardStats />
    </div>
  );
}

export default DashboardHome;

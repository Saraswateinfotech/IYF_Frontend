


'use client';
import { useEffect, useState } from 'react';
import CallingSystem from 'components/allifycomponents/callingSystem';
import FrontlinerCallingSystem from 'components/allifycomponents/FrontlinerDas/Frontliner';
import AdminDas from 'components/allifycomponents/adminDas';
import FacilitatorDas from 'components/allifycomponents/facilitatorDas';

const Dashboard = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  return (
    <div className="mt-8">
      <div className="mt-8">
        {role === 'coordinator' ? (
          <div></div>
        ) : role === 'frontliner' ? (
          <div className="mt-14">
            <FrontlinerCallingSystem />
          </div>
        ) : role === 'admin' ? (
          <div className="mt-10">
            <AdminDas/>
          </div>
        ) : role === 'facilitator' ? (
          <div className="mt-10">
            <FacilitatorDas/>
          </div>
        ): (
          <div className="mt-10">
            <CallingSystem />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

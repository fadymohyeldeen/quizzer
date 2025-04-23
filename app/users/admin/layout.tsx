import React from 'react';
import SideBar from '@/app/components/SideBar';
const UsersLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <SideBar>
        <main>
          {children}
        </main>
      </SideBar>

    </div>
  );
};

export default UsersLayout;
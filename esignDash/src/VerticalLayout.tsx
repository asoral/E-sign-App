import { Outlet } from 'react-router-dom';
import Navbar_vertical from './components/Navbar_vertical';

const VerticalLayout = () => {
  return (
  <>
     <div className="h-screen flex"> 
      <div className="w-4/10 p-4 dark:bg-gray-200">
        <Navbar_vertical />
      </div>
      <div className="w-3/10 p-4 overflow-hidden">
        <Outlet />
      </div>
   </div>
  </>
  );
};

export default VerticalLayout;
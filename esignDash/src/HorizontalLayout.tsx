import { Outlet } from 'react-router-dom';
import Navbar_horizontal from './components/Navbar_horizontal';

const HorizontalLayout = () => {
  return (
    <div>
      <Navbar_horizontal />
      <Outlet />
    </div>
  );
};

export default HorizontalLayout;
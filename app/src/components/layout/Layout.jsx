import { Box } from '@mui/material';
import NavBar from './NavBar';

const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
      <Box component="main" sx={{ p: 3 }}>{children}</Box>
    </>
  );
};

export default Layout;

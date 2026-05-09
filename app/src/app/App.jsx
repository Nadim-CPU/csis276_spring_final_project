import { Route, Routes, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Layout from '../components/layout/Layout';
import { routes } from './routes';
import { useAuth } from '../stores/hooks/useAuth';
import { useSocketSync } from '../stores/hooks/useSocketSync';

function App() {
  const { user } = useAuth();
  useSocketSync();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Layout>
        <Routes>
          {routes.map(({ path, element: Page, type }) => {
            if (type === 'public') return <Route key={path} path={path} element={user && path === '/' ? <Navigate to="/dashboard" replace /> : <Page />} />;
            if (type === 'auth') return <Route key={path} path={path} element={user ? <Navigate to="/dashboard" replace /> : <Page />} />;
            if (type === 'protected') return <Route key={path} path={path} element={user ? <Page /> : <Navigate to="/login" replace />} />;
            return null;
          })}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Container>
  );
}

export default App;



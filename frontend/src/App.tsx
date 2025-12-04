import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateRFP from './pages/CreateRFP';
import VendorManagement from './pages/VendorManagement';
import RFPDetails from './pages/RFPDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreateRFP />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="rfp/:id" element={<RFPDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

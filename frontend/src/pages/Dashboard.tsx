import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import api from '../lib/api';
import StatsCards from '../components/dashboard/StatsCards';
import RFPList from '../components/dashboard/RFPList';

const Dashboard = () => {
  const [rfps, setRfps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRFPs();
  }, []);

  const fetchRFPs = async () => {
    try {
      const response = await api.get('/rfps');
      setRfps(response.data);
    } catch (error) {
      console.error('Failed to fetch RFPs', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            RFP Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage your procurement requests efficiently</p>
        </div>
        <Link
          to="/create"
          className="btn-primary flex items-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Create New RFP
        </Link>
      </div>

      <StatsCards rfps={rfps} />

      <RFPList rfps={rfps} />
    </div>
  );
};

export default Dashboard;


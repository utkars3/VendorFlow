import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, Send } from 'lucide-react';
import api from '../lib/api';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SENT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CLOSED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Clock className="w-4 h-4" />;
      case 'SENT':
        return <Send className="w-4 h-4" />;
      case 'CLOSED':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Draft RFPs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {rfps.filter(r => r.status === 'DRAFT').length}
              </p>
            </div>
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sent RFPs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {rfps.filter(r => r.status === 'SENT').length}
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Send className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed RFPs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {rfps.filter(r => r.status === 'CLOSED').length}
              </p>
            </div>
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* RFPs List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">All RFPs</h2>
        
        {rfps.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No RFPs Yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first RFP</p>
            <Link to="/create" className="btn-primary inline-flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Create Your First RFP
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {rfps.map((rfp) => (
              <Link
                key={rfp.id}
                to={`/rfp/${rfp.id}`}
                className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1 group border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {rfp.title}
                      </h3>
                      <span className={`status-badge border flex items-center gap-1.5 ${getStatusColor(rfp.status)}`}>
                        {getStatusIcon(rfp.status)}
                        {rfp.status}
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-3">{rfp.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(rfp.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {rfp.title.charAt(0)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

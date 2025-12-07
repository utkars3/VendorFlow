import { useEffect, useState } from 'react';
import { Users, Plus } from 'lucide-react';
import api from '../lib/api';
import VendorList from '../components/vendors/VendorList';
import AddVendorModal from '../components/vendors/AddVendorModal';

const VendorManagement = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    contactName: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Failed to fetch vendors', error);
    }
  };

  const handleAddVendor = async () => {
    if (!newVendor.name || !newVendor.email) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/vendors', newVendor);
      setShowAddModal(false);
      setNewVendor({ name: '', email: '', contactName: '' });
      fetchVendors();
    } catch (error) {
      console.error('Failed to add vendor', error);
      alert('Failed to add vendor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        {/* Add Vendor Button - Top Right */}
        <div className="absolute top-0 right-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Vendor
          </button>
        </div>

        {/* Centered Title & Stats */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Vendor Management
            </h1>
            <p className="text-gray-600">Manage your vendor relationships and partnerships</p>
          </div>

          {/* Inline Stats */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl px-8 py-4 shadow-lg text-white">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-indigo-100 text-xs font-medium uppercase tracking-wide">Total Vendors</p>
                <p className="text-3xl font-bold">{vendors.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VendorList 
        vendors={vendors} 
        onAddVendor={() => setShowAddModal(true)} 
      />

      <AddVendorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newVendor={newVendor}
        setNewVendor={setNewVendor}
        onSubmit={handleAddVendor}
        submitting={submitting}
      />
    </div>
  );
};

export default VendorManagement;


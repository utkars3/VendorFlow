import { useEffect, useState } from 'react';
import { Users, Plus, Mail, User, Loader2 } from 'lucide-react';
import api from '../lib/api';

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Vendor Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your vendor relationships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Vendor
        </button>
      </div>

      {/* Stats */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-indigo-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Vendors</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{vendors.length}</p>
          </div>
          <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Users className="w-7 h-7 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      {vendors.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Vendors Yet</h3>
          <p className="text-gray-600 mb-6">Add your first vendor to get started</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Your First Vendor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                  {vendor.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{vendor.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                    {vendor.contactName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{vendor.contactName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border-2 border-indigo-500/30 ring-4 ring-indigo-500/10 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Add New Vendor
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  placeholder="Acme Corporation"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  placeholder="vendor@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={newVendor.contactName}
                  onChange={(e) => setNewVendor({ ...newVendor, contactName: e.target.value })}
                  placeholder="John Doe"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleAddVendor}
                disabled={submitting}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Vendor
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;

import { Loader2, Plus } from 'lucide-react';

interface NewVendor {
  name: string;
  email: string;
  contactName: string;
}

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  newVendor: NewVendor;
  setNewVendor: (vendor: NewVendor) => void;
  onSubmit: () => void;
  submitting: boolean;
}

const AddVendorModal = ({
  isOpen,
  onClose,
  newVendor,
  setNewVendor,
  onSubmit,
  submitting,
}: AddVendorModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-10 shadow-2xl border-2 border-indigo-500/30 ring-4 ring-indigo-500/10 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center">
          Add New Vendor
        </h3>
        <p className="text-gray-500 text-center mb-8">Fill in the vendor details below</p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vendor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newVendor.name}
              onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              placeholder="Acme Corporation"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={newVendor.email}
              onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
              placeholder="vendor@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
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
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
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
  );
};

export default AddVendorModal;

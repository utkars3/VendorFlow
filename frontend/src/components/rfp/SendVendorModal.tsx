import { Loader2, Send, CheckCircle2 } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  email: string;
}

interface SendVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: Vendor[];
  selectedVendors: string[];
  onVendorSelect: (vendorId: string, checked: boolean) => void;
  onSend: () => void;
  sending: boolean;
}

const SendVendorModal = ({
  isOpen,
  onClose,
  vendors,
  selectedVendors,
  onVendorSelect,
  onSend,
  sending,
}: SendVendorModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-10 shadow-2xl border-2 border-indigo-500/30 ring-4 ring-indigo-500/10 animate-slideUp flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 text-center">
          Select Vendors
        </h3>
        <p className="text-gray-500 text-center mb-8">Choose which vendors to send this RFP to</p>
        
        <div className="overflow-y-auto space-y-3 mb-8 pr-2 custom-scrollbar">
          {vendors.map((vendor) => (
            <label
              key={vendor.id}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                selectedVendors.includes(vendor.id)
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                selectedVendors.includes(vendor.id)
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-gray-300 bg-white'
              }`}>
                {selectedVendors.includes(vendor.id) && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
              </div>
              <input
                type="checkbox"
                checked={selectedVendors.includes(vendor.id)}
                onChange={(e) => onVendorSelect(vendor.id, e.target.checked)}
                className="hidden"
              />
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                {vendor.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold ${selectedVendors.includes(vendor.id) ? 'text-indigo-900' : 'text-gray-900'}`}>
                  {vendor.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{vendor.email}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            disabled={sending || selectedVendors.length === 0}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send ({selectedVendors.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendVendorModal;

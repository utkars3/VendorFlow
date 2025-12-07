import { Mail, User } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  email: string;
  contactName?: string;
}

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard = ({ vendor }: VendorCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1">
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
  );
};

export default VendorCard;

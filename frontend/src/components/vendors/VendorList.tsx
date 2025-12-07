import { Users, Plus } from 'lucide-react';
import VendorCard from './VendorCard';

interface VendorListProps {
  vendors: any[];
  onAddVendor: () => void;
}

const VendorList = ({ vendors, onAddVendor }: VendorListProps) => {
  if (vendors.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Vendors Yet</h3>
        <p className="text-gray-600 mb-6">Add your first vendor to get started</p>
        <button
          onClick={onAddVendor}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Your First Vendor
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
};

export default VendorList;

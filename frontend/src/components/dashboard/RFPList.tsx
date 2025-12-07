import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import RFPCard from './RFPCard';

interface RFPListProps {
  rfps: any[];
}

const RFPList = ({ rfps }: RFPListProps) => {
  return (
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
            <RFPCard key={rfp.id} rfp={rfp} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RFPList;

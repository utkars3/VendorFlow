import { Clock, CheckCircle2, IndianRupee } from 'lucide-react';

interface Proposal {
  id: string;
  vendor: {
    name: string;
  };
  receivedAt: string;
  parsedData: string;
  content: string;
}

interface ProposalCardProps {
  proposal: Proposal;
}

const ProposalCard = ({ proposal }: ProposalCardProps) => {
  let parsedDetails = null;
  try {
    parsedDetails = JSON.parse(proposal.parsedData);
  } catch (e) {}

  return (
    <div className="glass-card rounded-2xl p-8 hover:shadow-2xl transition-all duration-200">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {proposal.vendor?.name?.charAt(0) || 'V'}
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">{proposal.vendor?.name || 'Unknown Vendor'}</h4>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Received: {new Date(proposal.receivedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      </div>

      {parsedDetails && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {parsedDetails.price && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-700 mb-1">
                <IndianRupee className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Price</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{typeof parsedDetails.price === 'object' 
                  ? (parsedDetails.price.amount || parsedDetails.price.value || parsedDetails.price.total || parsedDetails.price.price || JSON.stringify(parsedDetails.price))
                  : parsedDetails.price}
              </p>
            </div>
          )}
          {parsedDetails.deliveryTime && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Delivery</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {typeof parsedDetails.deliveryTime === 'object' 
                  ? JSON.stringify(parsedDetails.deliveryTime) 
                  : parsedDetails.deliveryTime}
              </p>
            </div>
          )}
          {parsedDetails.warranty && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Warranty</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {typeof parsedDetails.warranty === 'object' 
                  ? JSON.stringify(parsedDetails.warranty) 
                  : parsedDetails.warranty}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <p className="text-sm font-semibold text-gray-600 mb-2">Original Proposal</p>
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{proposal.content}</p>
      </div>
    </div>
  );
};

export default ProposalCard;

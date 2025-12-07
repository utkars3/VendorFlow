import { Package, Loader2, Sparkles, Mail } from 'lucide-react';
import ProposalCard from './ProposalCard';

interface ProposalListProps {
  proposals: any[];
  onCompare: () => void;
  comparing: boolean;
}

const ProposalList = ({ proposals, onCompare, comparing }: ProposalListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-indigo-600" />
          Proposals ({proposals?.length || 0})
        </h3>
        {proposals?.length > 0 && (
          <button
            onClick={onCompare}
            disabled={comparing}
            className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 shadow-lg hover:shadow-xl hover:shadow-fuchsia-500/30 transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {comparing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI Compare & Recommend
              </>
            )}
          </button>
        )}
      </div>

      {(!proposals || proposals.length === 0) ? (
        <div className="glass-card rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No proposals received yet</h3>
          <p className="text-gray-600">Proposals will appear here once vendors respond</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalList;

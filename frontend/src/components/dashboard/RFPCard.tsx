import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

interface RFPCardProps {
  rfp: any;
}

const RFPCard = ({ rfp }: RFPCardProps) => {
  return (
    <Link
      to={`/rfp/${rfp.id}`}
      className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1 group border border-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {rfp.title}
            </h3>
            <StatusBadge status={rfp.status} />
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
  );
};

export default RFPCard;

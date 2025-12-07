import { Clock, RefreshCw, Send } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

interface RFPHeaderProps {
  rfp: any;
  onCheckEmails: () => void;
  checking: boolean;
  onOpenSendModal: () => void;
}

const RFPHeader = ({ rfp, onCheckEmails, checking, onOpenSendModal }: RFPHeaderProps) => {
  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {rfp.title.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{rfp.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <StatusBadge status={rfp.status} />
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(rfp.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCheckEmails}
            disabled={checking}
            className="px-4 py-2 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-indigo-500 hover:text-indigo-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            Check Emails
          </button>
          <button
            onClick={onOpenSendModal}
            className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4" />
            Send to Vendors
          </button>
        </div>
      </div>
    </div>
  );
};

export default RFPHeader;

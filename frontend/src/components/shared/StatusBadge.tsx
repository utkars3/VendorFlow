import { Clock, Send, CheckCircle2, FileText } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SENT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CLOSED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Clock className="w-4 h-4" />;
      case 'SENT':
        return <Send className="w-4 h-4" />;
      case 'CLOSED':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <span className={`status-badge border flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status}
    </span>
  );
};

export default StatusBadge;

import { Clock, Send, CheckCircle2 } from 'lucide-react';

interface StatsCardsProps {
  rfps: any[];
}

const StatsCards = ({ rfps }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-card rounded-2xl p-6 border-l-4 border-amber-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Draft RFPs</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {rfps.filter(r => r.status === 'DRAFT').length}
            </p>
          </div>
          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
            <Clock className="w-7 h-7 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Sent RFPs</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {rfps.filter(r => r.status === 'SENT').length}
            </p>
          </div>
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
            <Send className="w-7 h-7 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border-l-4 border-emerald-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Closed RFPs</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {rfps.filter(r => r.status === 'CLOSED').length}
            </p>
          </div>
          <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

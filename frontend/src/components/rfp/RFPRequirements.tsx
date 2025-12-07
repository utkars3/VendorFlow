import { FileText } from 'lucide-react';

interface RFPRequirementsProps {
  description: string;
  structuredData: string;
}

const RFPRequirements = ({ description, structuredData }: RFPRequirementsProps) => {
  return (
    <div className="glass-card rounded-2xl p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        Requirements
      </h3>
      <p className="text-gray-700 whitespace-pre-wrap mb-4">{description}</p>
      {structuredData && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <p className="text-sm font-semibold text-gray-600 mb-2">Structured Data</p>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
            {structuredData}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RFPRequirements;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Loader2 } from 'lucide-react';
import api from '../lib/api';

const CreateRFP = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [structuredData, setStructuredData] = useState<any>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setGenerating(true);
    try {
      const response = await api.post('/rfps/generate', { description });
      setStructuredData(response.data.structuredData);
    } catch (error) {
      console.error('Failed to generate RFP', error);
      alert('Failed to generate RFP structure');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const response = await api.post('/rfps', {
        title: structuredData.title || 'Untitled RFP',
        description,
        structuredData,
      });
      navigate(`/rfp/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create RFP', error);
      alert('Failed to create RFP');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Request For Proposal
        </h1>
        {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <FileText className="w-8 h-8 text-white" />
        </div> */}
        <p className="text-gray-600">Describe your requirements in natural language and let AI structure it for you</p>
      </div>

      {/* Input Section */}
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Describe Your Requirements
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: I need 50 laptops with 16GB RAM and 512GB SSD, delivery by end of month..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 min-h-[200px] resize-none"
            disabled={generating || creating}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!description.trim() || generating || creating}
          className="w-full px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate RFP Structure
            </>
          )}
        </button>
      </div>

      {/* Preview Section */}
      {structuredData && (
        <div className="glass-card rounded-2xl p-8 space-y-6 border-2 border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI-Generated Structure</h3>
              <p className="text-sm text-gray-600">Review and create your RFP</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {JSON.stringify(structuredData, null, 2)}
            </pre>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStructuredData(null)}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              Regenerate
            </button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Create RFP
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRFP;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, Send, Sparkles, FileText, Clock, Mail, DollarSign, Package, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

const RFPDetails = () => {
  const { id } = useParams();
  const [rfp, setRfp] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [comparison, setComparison] = useState<any>(null);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);

  useEffect(() => {
    fetchRFP();
    fetchVendors();
  }, [id]);

  const fetchRFP = async () => {
    try {
      const response = await api.get(`/rfps/${id}`);
      setRfp(response.data);
    } catch (error) {
      console.error('Failed to fetch RFP', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Failed to fetch vendors', error);
    }
  };

  const handleSend = async () => {
    if (selectedVendors.length === 0) return;
    setSending(true);
    try {
      await api.post(`/rfps/${id}/send`, { vendorIds: selectedVendors });
      setShowSendModal(false);
      fetchRFP();
      alert('RFP sent successfully!');
    } catch (error) {
      console.error('Failed to send RFP', error);
      alert('Failed to send RFP');
    } finally {
      setSending(false);
    }
  };

  const handleCheckEmails = async () => {
    setChecking(true);
    try {
      const response = await api.post('/rfps/check-emails');
      fetchRFP();
      
      if (response.data.count === 0) {
        alert('No new emails found.');
      } else {
        alert(`Found ${response.data.count} new email(s). ${response.data.results?.length || 0} proposal(s) processed.`);
      }
    } catch (error: any) {
      console.error('Failed to check emails', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.hint || 'Failed to check emails. Please check your email configuration.';
      alert(errorMsg);
    } finally {
      setChecking(false);
    }
  };

  const handleCompare = async () => {
    setComparing(true);
    try {
      const response = await api.post(`/rfps/${id}/compare`);
      setComparison(response.data);
    } catch (error) {
      console.error('Failed to compare proposals', error);
    } finally {
      setComparing(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!rfp) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">RFP not found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
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
                  <span className={`status-badge border flex items-center gap-1.5 ${getStatusColor(rfp.status)}`}>
                    {rfp.status}
                  </span>
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
              onClick={handleCheckEmails}
              disabled={checking}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              Check Emails
            </button>
            <button
              onClick={() => setShowSendModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send to Vendors
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="glass-card rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Requirements
        </h3>
        <p className="text-gray-700 whitespace-pre-wrap mb-4">{rfp.description}</p>
        {rfp.structuredData && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Structured Data</p>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {rfp.structuredData}
            </pre>
          </div>
        )}
      </div>

      {/* AI Comparison */}
      {comparison && (
        <div className="glass-card rounded-2xl p-8 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">AI Recommendation</h3>
              <p className="text-sm text-gray-600">Powered by Gemini AI</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <p className="font-semibold text-lg text-gray-900 mb-2">
              Recommended: {comparison.recommendation}
            </p>
            <p className="text-gray-700">{comparison.reasoning}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {comparison.comparisons?.map((comp: any, i: number) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-900">{comp.vendorName}</span>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {comp.score}/100
                  </span>
                </div>
                <p className="text-sm text-gray-600">{comp.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proposals */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            Proposals ({rfp.proposals?.length || 0})
          </h3>
          {rfp.proposals?.length > 0 && (
            <button
              onClick={handleCompare}
              disabled={comparing}
              className="btn-primary flex items-center gap-2"
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

        {(!rfp.proposals || rfp.proposals.length === 0) ? (
          <div className="glass-card rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No proposals received yet</h3>
            <p className="text-gray-600">Proposals will appear here once vendors respond</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {rfp.proposals.map((proposal: any) => {
              let parsedDetails = null;
              try {
                parsedDetails = JSON.parse(proposal.parsedData);
              } catch (e) {}

              return (
                <div key={proposal.id} className="glass-card rounded-2xl p-8 hover:shadow-2xl transition-all duration-200">
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
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase">Price</span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">₹{parsedDetails.price}</p>
                        </div>
                      )}
                      {parsedDetails.deliveryTime && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center gap-2 text-blue-700 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase">Delivery</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{parsedDetails.deliveryTime}</p>
                        </div>
                      )}
                      {parsedDetails.warranty && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                          <div className="flex items-center gap-2 text-purple-700 mb-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase">Warranty</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{parsedDetails.warranty}</p>
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
            })}
          </div>
        )}
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900">Select Vendors</h3>
              <p className="text-sm text-gray-600 mt-1">Choose which vendors to send this RFP to</p>
            </div>
            <div className="overflow-y-auto p-6 space-y-2" style={{ maxHeight: '400px' }}>
              {vendors.map((vendor) => (
                <label
                  key={vendor.id}
                  className="flex items-center gap-4 p-4 hover:bg-indigo-50 rounded-xl cursor-pointer border-2 border-transparent hover:border-indigo-200 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVendors([...selectedVendors, vendor.id]);
                      } else {
                        setSelectedVendors(selectedVendors.filter(id => id !== vendor.id));
                      }
                    }}
                    className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                  />
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                    {vendor.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{vendor.name}</p>
                    <p className="text-sm text-gray-500 truncate">{vendor.email}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="p-6 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || selectedVendors.length === 0}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send to {selectedVendors.length} Vendor{selectedVendors.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFPDetails;

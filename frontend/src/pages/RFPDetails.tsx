import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import api from '../lib/api';
import RFPHeader from '../components/rfp/RFPHeader';
import RFPRequirements from '../components/rfp/RFPRequirements';
import AIComparison from '../components/rfp/AIComparison';
import ProposalList from '../components/rfp/ProposalList';
import SendVendorModal from '../components/rfp/SendVendorModal';

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

  const handleVendorSelect = (vendorId: string, checked: boolean) => {
    if (checked) {
      setSelectedVendors([...selectedVendors, vendorId]);
    } else {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
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
      <RFPHeader 
        rfp={rfp} 
        onCheckEmails={handleCheckEmails} 
        checking={checking} 
        onOpenSendModal={() => setShowSendModal(true)} 
      />

      <RFPRequirements 
        description={rfp.description} 
        structuredData={rfp.structuredData} 
      />

      <AIComparison comparison={comparison} />

      <ProposalList 
        proposals={rfp.proposals} 
        onCompare={handleCompare} 
        comparing={comparing} 
      />

      <SendVendorModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        vendors={vendors}
        selectedVendors={selectedVendors}
        onVendorSelect={handleVendorSelect}
        onSend={handleSend}
        sending={sending}
      />
    </div>
  );
};

export default RFPDetails;


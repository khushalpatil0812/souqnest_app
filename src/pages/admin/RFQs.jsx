import React, { useState } from 'react';
import { FiEye, FiMessageSquare, FiMail, FiPhone, FiUser, FiPackage, FiRefreshCw } from 'react-icons/fi';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { useRFQs, useUpdateRFQStatus } from '../../hooks/useRFQs';

const RFQs = () => {
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // React Query hooks
  const { data: rfqs = [], isLoading: loading, error: queryError, refetch } = useRFQs();
  const updateStatusMutation = useUpdateRFQStatus();

  const error = queryError ? queryError.response?.data?.message || 'Failed to fetch RFQs' : null;

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      alert('Status updated successfully!');
      setIsModalOpen(false);
      setSelectedRFQ(null);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleViewRFQ = (rfq) => {
    setSelectedRFQ(rfq);
    setIsModalOpen(true);
  };

  // Filter using UPPERCASE statuses (matching backend enum)
  const filteredRfqs = statusFilter === 'all'
    ? rfqs
    : rfqs.filter(r => r.status === statusFilter);

  // Status badge mapping (backend sends PENDING / RESPONDED)
  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'warning',
      RESPONDED: 'primary',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status || 'PENDING'}
      </Badge>
    );
  };

  // Get items summary for table display
  const getItemsSummary = (rfq) => {
    const items = rfq.items || [];
    if (items.length === 0) return 'No items';
    if (items.length === 1) {
      return items[0].product?.name || 'Product';
    }
    return `${items[0].product?.name || 'Product'} +${items.length - 1} more`;
  };

  const getTotalQuantity = (rfq) => {
    const items = rfq.items || [];
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  const columns = [
    {
      label: 'Company',
      key: 'companyName',
      render: (row) => (
        <div className="flex items-center gap-2">
          <FiUser className="text-gray-400" />
          <span className="font-medium">{row.companyName || 'N/A'}</span>
        </div>
      )
    },
    {
      label: 'Contact',
      key: 'contactName',
      render: (row) => (
        <div>
          <div className="font-medium">{row.contactName || 'N/A'}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <FiMail size={10} /> {row.email}
          </div>
        </div>
      )
    },
    {
      label: 'Items',
      key: 'items',
      render: (row) => (
        <div>
          <div className="font-medium text-sm">{getItemsSummary(row)}</div>
          <div className="text-xs text-gray-500">
            {(row.items || []).length} item(s) · Qty: {getTotalQuantity(row)}
          </div>
        </div>
      )
    },
    {
      label: 'Country',
      key: 'country',
      render: (row) => row.country || 'N/A'
    },
    {
      label: 'Status',
      key: 'status',
      render: (row) => getStatusBadge(row.status)
    },
    {
      label: 'Date',
      key: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => handleViewRFQ(row)}
          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <FiEye size={16} className="text-blue-600" />
        </button>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-secondary-text">Loading RFQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-text">RFQ Management</h1>
          <p className="text-secondary-text mt-1">Manage customer quote requests</p>
        </div>
        <div className="flex gap-3 items-center">
          <Badge variant="warning">Pending: {rfqs.filter(r => r.status === 'PENDING').length}</Badge>
          <Badge variant="primary">Responded: {rfqs.filter(r => r.status === 'RESPONDED').length}</Badge>
          <Badge variant="default">Total: {rfqs.length}</Badge>
          <Button variant="outline" onClick={() => refetch()}>
            <FiRefreshCw className="inline mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Status Filter - only PENDING and RESPONDED */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'PENDING', label: 'Pending' },
          { key: 'RESPONDED', label: 'Responded' },
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setStatusFilter(filter.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === filter.key
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {rfqs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <FiMessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-secondary-text mb-2">No RFQs found</p>
          <p className="text-sm text-gray-500">Customer quote requests will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <Table columns={columns} data={filteredRfqs} />
        </div>
      )}

      {/* RFQ Detail Modal */}
      {selectedRFQ && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedRFQ(null); }}
          title="RFQ Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Contact info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Company</label>
                <p className="text-primary-text font-medium">{selectedRFQ.companyName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Contact Name</label>
                <p className="text-primary-text font-medium">{selectedRFQ.contactName || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-secondary-text mb-1">
                  <FiMail size={14} /> Email
                </label>
                <p className="text-primary-text">{selectedRFQ.email}</p>
              </div>
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-secondary-text mb-1">
                  <FiPhone size={14} /> Phone
                </label>
                <p className="text-primary-text">{selectedRFQ.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Country</label>
                <p className="text-primary-text">{selectedRFQ.country || 'N/A'}</p>
              </div>
            </div>

            {/* Items (cart) */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-secondary-text mb-2">
                <FiPackage size={14} /> Requested Items
              </label>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">#</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">Product</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedRFQ.items || []).length > 0 ? (
                      selectedRFQ.items.map((item, idx) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="px-4 py-2 text-sm">{idx + 1}</td>
                          <td className="px-4 py-2 text-sm font-medium">
                            {item.product?.name || `Product #${item.productId}`}
                          </td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500">No items</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-secondary-text mb-1">Current Status</label>
              {getStatusBadge(selectedRFQ.status)}
            </div>

            {/* Message */}
            {selectedRFQ.message && (
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Message</label>
                <p className="text-primary-text bg-gray-50 p-4 rounded-lg">{selectedRFQ.message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <select
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue={selectedRFQ.status}
                onChange={(e) => {
                  const rfqId = selectedRFQ.id || selectedRFQ._id;
                  handleUpdateStatus(rfqId, e.target.value);
                }}
              >
                <option value="PENDING">Pending</option>
                <option value="RESPONDED">Responded</option>
              </select>
              <a
                href={`mailto:${selectedRFQ.email}?subject=Re: Your RFQ Request`}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiMessageSquare /> Send Email Response
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RFQs;

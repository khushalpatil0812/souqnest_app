import React, { useState } from 'react';
import { FiEye, FiCheck, FiX } from 'react-icons/fi';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const Partners = () => {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const partners = [
    { 
      id: 1, 
      company: 'Tech Solutions Inc.', 
      contact: 'Sarah Johnson',
      email: 'sarah@techsolutions.com',
      phone: '+1-555-0123',
      country: 'USA',
      industry: 'Electronics',
      status: 'pending',
      date: '2026-02-14',
      description: 'Leading electronics manufacturer looking to expand B2B presence.',
      products: 'Circuit Boards, Sensors, Microcontrollers',
      annualRevenue: '$5M - $10M',
    },
    { 
      id: 2, 
      company: 'Global Machinery Ltd.', 
      contact: 'Michael Chen',
      email: 'michael@globalmachinery.com',
      phone: '+86-10-1234-5678',
      country: 'China',
      industry: 'Industrial Machinery',
      status: 'approved',
      date: '2026-02-10',
      description: 'Established machinery supplier with 20+ years experience.',
      products: 'CNC Machines, Lathes, Milling Equipment',
      annualRevenue: '$10M - $50M',
    },
    { 
      id: 3, 
      company: 'Eco Textiles Co.', 
      contact: 'Emma Davis',
      email: 'emma@ecotextiles.com',
      phone: '+91-22-9876-5432',
      country: 'India',
      industry: 'Textiles',
      status: 'rejected',
      date: '2026-02-12',
      description: 'Sustainable textile manufacturer specializing in organic fabrics.',
      products: 'Cotton Fabric, Denim, Organic Textiles',
      annualRevenue: '$1M - $5M',
    },
  ];

  const handleView = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const columns = [
    { label: 'Company', key: 'company' },
    { label: 'Contact', key: 'contact' },
    { label: 'Country', key: 'country' },
    { label: 'Industry', key: 'industry' },
    { 
      label: 'Status', 
      key: 'status',
      render: (row) => getStatusBadge(row.status)
    },
    { label: 'Date', key: 'date' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleView(row)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <FiEye size={16} className="text-blue-600" />
          </button>
          {row.status === 'pending' && (
            <>
              <button 
                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                title="Approve"
              >
                <FiCheck size={16} className="text-green-600" />
              </button>
              <button 
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Reject"
              >
                <FiX size={16} className="text-red-600" />
              </button>
            </>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-text">Partner Applications</h1>
        <div className="flex gap-3">
          <Badge variant="warning">Pending: {partners.filter(p => p.status === 'pending').length}</Badge>
          <Badge variant="success">Approved: {partners.filter(p => p.status === 'approved').length}</Badge>
        </div>
      </div>

      <Table columns={columns} data={partners} />

      {selectedPartner && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPartner(null);
          }}
          title="Partner Application Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-primary-text">{selectedPartner.company}</h2>
              {getStatusBadge(selectedPartner.status)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Contact Person</label>
                <p className="text-primary-text font-medium">{selectedPartner.contact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Email</label>
                <p className="text-primary-text">{selectedPartner.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Phone</label>
                <p className="text-primary-text">{selectedPartner.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Country</label>
                <p className="text-primary-text">{selectedPartner.country}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Industry</label>
                <p className="text-primary-text font-medium">{selectedPartner.industry}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Annual Revenue</label>
                <p className="text-primary-text font-medium">{selectedPartner.annualRevenue}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-text mb-1">Products/Services</label>
              <p className="text-primary-text bg-gray-50 p-3 rounded-lg">{selectedPartner.products}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-text mb-1">Company Description</label>
              <p className="text-primary-text bg-gray-50 p-3 rounded-lg">{selectedPartner.description}</p>
            </div>

            {selectedPartner.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button>
                  <FiCheck className="inline mr-2" /> Approve Application
                </Button>
                <Button variant="danger">
                  <FiX className="inline mr-2" /> Reject Application
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Partners;

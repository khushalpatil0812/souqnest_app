import React, { useState } from 'react';
import { FiEye, FiCheck } from 'react-icons/fi';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';

const ContactForms = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const messages = [
    { 
      id: 1, 
      name: 'Alice Williams', 
      email: 'alice@company.com',
      phone: '+1-555-1234',
      subject: 'Inquiry about bulk order pricing',
      message: 'Hi, I am interested in placing a bulk order for industrial valves. Could you please provide pricing details and lead times?',
      status: 'new',
      date: '2026-02-14',
      time: '10:30 AM',
    },
    { 
      id: 2, 
      name: 'Bob Martinez', 
      email: 'bob@manufacturing.com',
      phone: '+1-555-5678',
      subject: 'Technical support needed',
      message: 'We are facing some issues with the product catalog search functionality. Can someone help us troubleshoot?',
      status: 'contacted',
      date: '2026-02-13',
      time: '02:15 PM',
    },
    { 
      id: 3, 
      name: 'Carol Zhang', 
      email: 'carol@export.com',
      phone: '+86-10-8765-4321',
      subject: 'Partnership opportunity',
      message: 'We are a trading company looking to partner with your platform. Please share partnership details.',
      status: 'new',
      date: '2026-02-13',
      time: '09:45 AM',
    },
    { 
      id: 4, 
      name: 'David Kumar', 
      email: 'david@suppliers.in',
      phone: '+91-11-9876-5432',
      subject: 'Question about listing products',
      message: 'How can I list my products on your platform? What are the requirements and fees?',
      status: 'contacted',
      date: '2026-02-12',
      time: '04:20 PM',
    },
  ];

  const handleView = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const columns = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Subject', key: 'subject' },
    { 
      label: 'Status', 
      key: 'status',
      render: (row) => (
        <Badge variant={row.status === 'new' ? 'warning' : 'success'}>
          {row.status}
        </Badge>
      )
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
            title="View Message"
          >
            <FiEye size={16} className="text-blue-600" />
          </button>
          {row.status === 'new' && (
            <button 
              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
              title="Mark as Contacted"
            >
              <FiCheck size={16} className="text-green-600" />
            </button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-text">Contact Form Submissions</h1>
        <div className="flex gap-3">
          <Badge variant="warning">New: {messages.filter(m => m.status === 'new').length}</Badge>
          <Badge variant="success">Contacted: {messages.filter(m => m.status === 'contacted').length}</Badge>
        </div>
      </div>

      <Table columns={columns} data={messages} />

      {selectedMessage && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMessage(null);
          }}
          title="Message Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-primary-text">{selectedMessage.name}</h2>
                <p className="text-sm text-secondary-text mt-1">
                  {selectedMessage.date} at {selectedMessage.time}
                </p>
              </div>
              <Badge variant={selectedMessage.status === 'new' ? 'warning' : 'success'}>
                {selectedMessage.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Email</label>
                <p className="text-primary-text">{selectedMessage.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Phone</label>
                <p className="text-primary-text">{selectedMessage.phone}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-text mb-1">Subject</label>
              <p className="text-primary-text font-medium">{selectedMessage.subject}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-text mb-1">Message</label>
              <div className="text-primary-text bg-gray-50 p-4 rounded-lg leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              {selectedMessage.status === 'new' && (
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  <FiCheck className="inline mr-2" /> Mark as Contacted
                </button>
              )}
              <a 
                href={`mailto:${selectedMessage.email}`}
                className="px-6 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Send Email Reply
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactForms;

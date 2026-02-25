import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const Listings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const listings = [
    { 
      id: 1, 
      company: 'TechManufacture Co.', 
      category: 'Manufacturing', 
      location: 'USA',
      featured: true,
      verified: true,
      authorized: true,
      date: '2026-02-10'
    },
    { 
      id: 2, 
      company: 'Global Chemicals Ltd.', 
      category: 'Chemicals', 
      location: 'Germany',
      featured: false,
      verified: true,
      authorized: false,
      date: '2026-02-09'
    },
    { 
      id: 3, 
      company: 'Asian Electronics Hub', 
      category: 'Electronics', 
      location: 'China',
      featured: true,
      verified: true,
      authorized: true,
      date: '2026-02-08'
    },
  ];

  const columns = [
    { label: 'Company', key: 'company' },
    { label: 'Category', key: 'category' },
    { label: 'Location', key: 'location' },
    { 
      label: 'Badges', 
      key: 'badges',
      render: (row) => (
        <div className="flex gap-2">
          {row.featured && <Badge variant="featured">Featured</Badge>}
          {row.verified && <Badge variant="verified">Verified</Badge>}
          {row.authorized && <Badge variant="primary">Authorized</Badge>}
        </div>
      )
    },
    { label: 'Date', key: 'date' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiEdit size={16} className="text-blue-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiTrash2 size={16} className="text-red-600" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-text">Listings Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <FiPlus className="inline mr-2" /> Add New Listing
        </Button>
      </div>

      <Table columns={columns} data={listings} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Listing"
      >
                          {/* Category */}
                          {supplier.category && (
                            <div className="slc-tag-group">
                              <span className="slc-tag slc-tag-blue">
                                <FiGrid size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                {typeof supplier.category === 'string' ? supplier.category : supplier.category.name}
                              </span>
                            </div>
                          )}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Category</label>
            <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Manufacturing</option>
              <option>Electronics</option>
              <option>Chemicals</option>
              <option>Textiles</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Location</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter location"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Verified</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Authorized</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button>Save Listing</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Listings;

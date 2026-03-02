import React, { useState } from 'react';
import { demoProducts, demoIndustries } from '../../data/dummy';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const Listings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Demo supplier mapping for product and industry
  const demoSupplierMap = {
    'TechManufacture Co.': {
      products: demoProducts.filter(p => p.category.name === 'Manufacturing').map(p => p.name),
      industries: demoIndustries.filter(i => i.name === 'Industrial Equipment').map(i => i.name)
    },
    'Global Chemicals Ltd.': {
      products: demoProducts.filter(p => p.category.name === 'Chemicals').map(p => p.name),
      industries: demoIndustries.filter(i => i.name === 'Chemicals & Materials').map(i => i.name)
    },
    'Asian Electronics Hub': {
      products: demoProducts.filter(p => p.category.name === 'Electronics').map(p => p.name),
      industries: demoIndustries.filter(i => i.name === 'Consumer Electronics').map(i => i.name)
    }
  };

  const listings = [
    { 
      id: 1, 
      company: 'TechManufacture Co.', 
      category: 'Manufacturing', 
      location: 'USA',
      featured: true,
      verified: true,
      authorized: true,
      date: '2026-02-10',
      products: demoSupplierMap['TechManufacture Co.'].products,
      industries: demoSupplierMap['TechManufacture Co.'].industries
    },
    { 
      id: 2, 
      company: 'Global Chemicals Ltd.', 
      category: 'Chemicals', 
      location: 'Germany',
      featured: false,
      verified: true,
      authorized: false,
      date: '2026-02-09',
      products: demoSupplierMap['Global Chemicals Ltd.'].products,
      industries: demoSupplierMap['Global Chemicals Ltd.'].industries
    },
    { 
      id: 3, 
      company: 'Asian Electronics Hub', 
      category: 'Electronics', 
      location: 'China',
      featured: true,
      verified: true,
      authorized: true,
      date: '2026-02-08',
      products: demoSupplierMap['Asian Electronics Hub'].products,
      industries: demoSupplierMap['Asian Electronics Hub'].industries
    },
  ];

  const columns = [
    { label: 'Company', key: 'company' },
    { label: 'Category', key: 'category' },
    { label: 'Location', key: 'location' },
    {
      label: 'Products',
      key: 'products',
      render: (row) => (
        <span>{row.products && row.products.length > 0 ? row.products.join(', ') : '-'}</span>
      )
    },
    {
      label: 'Industries',
      key: 'industries',
      render: (row) => (
        <span>{row.industries && row.industries.length > 0 ? row.industries.join(', ') : '-'}</span>
      )
    },
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
        <div className="flex gap-3">
          <button
            className="listings-search-btn flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold border border-blue-600 bg-white text-blue-600 shadow-sm hover:bg-blue-50 transition-all"
            style={{ minWidth: 0, height: '28px', width: '90px', borderRadius: '18px', fontSize: '12px', padding: '0 12px' }}
          >
            Search Supplier
          </button>
          <Button onClick={() => setIsModalOpen(true)}>
            <FiPlus className="inline mr-2" /> Add New Listing
          </Button>
        </div>
      </div>

      <Table columns={columns} data={listings} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Listing"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Company Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter company name"
            />
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save Listing</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Listings;

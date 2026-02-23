import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiUpload, FiSearch, FiRefreshCw, FiBriefcase } from 'react-icons/fi';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import SupplierBulkUpload from './SupplierBulkUpload';
import { supplierApi, industryApi, extractArray } from '../../services/api';

const Suppliers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Industry assignment state
  const [selectedIndustryIds, setSelectedIndustryIds] = useState([]);
  const [supplierForIndustry, setSupplierForIndustry] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    websiteUrl: '',
    supplierType: 'MANUFACTURER',
    description: '',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    isFeatured: false,
    isAuthorizedPartner: false,
    isVerified: false,
  });

  useEffect(() => {
    fetchSuppliers();
    fetchIndustries();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierApi.getAll();
      const suppliersData = extractArray(response);

      // Fetch industries for each supplier
      const suppliersWithIndustries = await Promise.all(
        suppliersData.map(async (supplier) => {
          try {
            const indRes = await supplierApi.getIndustries(supplier.id);
            return { ...supplier, industries: extractArray(indRes) };
          } catch {
            return { ...supplier, industries: [] };
          }
        })
      );

      setSuppliers(suppliersWithIndustries);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch suppliers');
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await industryApi.getAll();
      setIndustries(extractArray(response));
    } catch (err) {
      console.error('Failed to load industries:', err);
    }
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(s =>
    s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.isFeatured && !editMode) {
      if (!window.confirm('⭐ Are you sure you want to mark this supplier as FEATURED?')) return;
    }

    try {
      const submitData = {
        companyName: formData.companyName.trim(),
        supplierType: formData.supplierType,
        isFeatured: formData.isFeatured,
        isAuthorizedPartner: formData.isAuthorizedPartner,
        isVerified: formData.isVerified,
      };

      if (formData.websiteUrl?.trim()) submitData.websiteUrl = formData.websiteUrl.trim();
      if (formData.description?.trim()) submitData.description = formData.description.trim();
      if (formData.logoUrl?.trim()) submitData.logoUrl = formData.logoUrl.trim();
      if (formData.contactEmail?.trim()) submitData.contactEmail = formData.contactEmail.trim();
      if (formData.contactPhone?.trim()) submitData.contactPhone = formData.contactPhone.trim();

      if (editMode) {
        await supplierApi.update(selectedSupplierId, submitData);
        alert('Supplier updated successfully!');
      } else {
        await supplierApi.create(submitData);
        alert('Supplier created successfully!');
      }

      setIsModalOpen(false);
      resetForm();
      fetchSuppliers();
    } catch (err) {
      console.error('Supplier submission error:', err);
      const errors = err.response?.data?.errors;
      let errorMessage = err.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} supplier`;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        errorMessage += ':\n' + errors.map(e => `- ${e.message || e}`).join('\n');
      }
      alert(errorMessage);
    }
  };

  const handleAdd = () => {
    setEditMode(false);
    setSelectedSupplierId(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (supplier) => {
    setEditMode(true);
    setSelectedSupplierId(supplier.id);
    setFormData({
      companyName: supplier.companyName,
      websiteUrl: supplier.websiteUrl || '',
      supplierType: supplier.supplierType,
      description: supplier.description || '',
      logoUrl: supplier.logoUrl || '',
      contactEmail: supplier.contactEmail || '',
      contactPhone: supplier.contactPhone || '',
      isFeatured: supplier.isFeatured,
      isAuthorizedPartner: supplier.isAuthorizedPartner,
      isVerified: supplier.isVerified,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierApi.delete(id);
        alert('Supplier deleted successfully!');
        fetchSuppliers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete supplier');
      }
    }
  };

  // Industry management
  const openIndustryModal = (supplier) => {
    setSupplierForIndustry(supplier);
    setSelectedIndustryIds(supplier.industries?.map(i => i.industryId || i.id) || []);
    setIsIndustryModalOpen(true);
  };

  const handleIndustryToggle = (industryId) => {
    setSelectedIndustryIds(prev =>
      prev.includes(industryId)
        ? prev.filter(id => id !== industryId)
        : [...prev, industryId]
    );
  };

  const handleSaveIndustries = async () => {
    try {
      await supplierApi.updateIndustries(supplierForIndustry.id, { industryIds: selectedIndustryIds });
      alert('Industries updated successfully!');
      setIsIndustryModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      console.error('Failed to update industries:', err);
      alert(err.response?.data?.message || 'Failed to update industries');
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      websiteUrl: '',
      supplierType: 'MANUFACTURER',
      description: '',
      logoUrl: '',
      contactEmail: '',
      contactPhone: '',
      isFeatured: false,
      isAuthorizedPartner: false,
      isVerified: false,
    });
    setEditMode(false);
    setSelectedSupplierId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const columns = [
    {
      label: 'Company Name',
      key: 'companyName',
      render: (row) => (
        <div>
          <div className="font-semibold text-primary-text">{row.companyName}</div>
          {row.contactEmail && <div className="text-xs text-gray-500">{row.contactEmail}</div>}
        </div>
      )
    },
    { label: 'Website', key: 'websiteUrl', render: (row) => row.websiteUrl ? (
      <a href={row.websiteUrl} target="_blank" rel="noreferrer" className="text-primary-600 text-sm hover:underline truncate block max-w-[200px]">
        {row.websiteUrl}
      </a>
    ) : <span className="text-gray-400 text-sm">N/A</span> },
    { label: 'Type', key: 'supplierType', render: (row) => (
      <Badge variant="default">{row.supplierType?.replace('_', ' ')}</Badge>
    )},
    {
      label: 'Industries',
      key: 'industries',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.industries && row.industries.length > 0 ? (
            row.industries.slice(0, 3).map((ind, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {ind.industry?.name || ind.name || 'Industry'}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No industries</span>
          )}
          {row.industries && row.industries.length > 3 && (
            <span className="text-xs text-gray-500">+{row.industries.length - 3} more</span>
          )}
        </div>
      )
    },
    {
      label: 'Status',
      key: 'status',
      render: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.isFeatured && <Badge variant="featured">Featured</Badge>}
          {row.isVerified && <Badge variant="verified">Verified</Badge>}
          {row.isAuthorizedPartner && <Badge variant="primary">Authorized</Badge>}
        </div>
      )
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-1">
          <button onClick={() => openIndustryModal(row)} className="p-2 hover:bg-indigo-50 rounded-lg transition-colors" title="Manage Industries">
            <FiBriefcase size={16} className="text-indigo-600" />
          </button>
          <button onClick={() => handleEdit(row)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
            <FiEdit size={16} className="text-blue-600" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <FiTrash2 size={16} className="text-red-600" />
          </button>
        </div>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-secondary-text">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-text">Supplier Management</h1>
          <p className="text-sm text-secondary-text mt-1">Manage suppliers and their industry associations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchSuppliers}>
            <FiRefreshCw className="inline mr-2" /> Refresh
          </Button>
          <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
            <FiUpload className="inline mr-2" /> Bulk Upload
          </Button>
          <Button onClick={handleAdd}>
            <FiPlus className="inline mr-2" /> Add New Supplier
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-blue-100 text-sm font-medium">Total Suppliers</p>
          <h3 className="text-3xl font-bold mt-1">{suppliers.length}</h3>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-green-100 text-sm font-medium">Verified</p>
          <h3 className="text-3xl font-bold mt-1">{suppliers.filter(s => s.isVerified).length}</h3>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-yellow-100 text-sm font-medium">Featured</p>
          <h3 className="text-3xl font-bold mt-1">{suppliers.filter(s => s.isFeatured).length}</h3>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-indigo-100 text-sm font-medium">Industries</p>
          <h3 className="text-3xl font-bold mt-1">{industries.length}</h3>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-border p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search suppliers by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-secondary-text mt-2">
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {!error && filteredSuppliers.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <p className="text-secondary-text mb-4">No suppliers found</p>
          <Button onClick={handleAdd}><FiPlus className="inline mr-2" /> Add First Supplier</Button>
        </div>
      )}

      {filteredSuppliers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <Table columns={columns} data={filteredSuppliers} />
        </div>
      )}

      {/* Create/Edit Supplier Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editMode ? 'Edit Supplier' : 'Add New Supplier'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Company Name *</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter company name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Website URL</label>
              <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://www.example.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Supplier Type *</label>
              <select name="supplierType" value={formData.supplierType} onChange={handleChange} required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="MANUFACTURER">Manufacturer</option>
                <option value="TRADER">Trader</option>
                <option value="CONTRACTOR">Contractor</option>
                <option value="SERVICE_PROVIDER">Service Provider</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Logo URL</label>
              <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/logo.png" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Contact Email</label>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="contact@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-text mb-1">Contact Phone</label>
              <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+91 9876543210" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="4" placeholder="Company description..."></textarea>
          </div>

          <div className="flex gap-6 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="rounded w-4 h-4" />
              <span className="text-sm font-medium">Featured Supplier</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange} className="rounded w-4 h-4" />
              <span className="text-sm font-medium">Verified</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" name="isAuthorizedPartner" checked={formData.isAuthorizedPartner} onChange={handleChange} className="rounded w-4 h-4" />
              <span className="text-sm font-medium">Authorized Partner</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit">{editMode ? 'Update Supplier' : 'Create Supplier'}</Button>
            <Button variant="outline" type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Industry Assignment Modal */}
      <Modal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        title={`Manage Industries — ${supplierForIndustry?.companyName || ''}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-text">Select the industries this supplier operates in:</p>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {industries.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No industries available. Create industries first.</p>
            ) : (
              industries.map(industry => {
                const indId = industry.id || industry._id;
                const isSelected = selectedIndustryIds.includes(indId);
                return (
                  <label key={indId}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input type="checkbox" checked={isSelected} onChange={() => handleIndustryToggle(indId)}
                      className="rounded w-4 h-4 text-indigo-600" />
                    <div>
                      <span className="font-medium text-sm">{industry.name}</span>
                      {industry.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{industry.description}</p>
                      )}
                    </div>
                  </label>
                );
              })
            )}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-gray-500">{selectedIndustryIds.length} selected</span>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsIndustryModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveIndustries}>Save Industries</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Bulk Upload Modal */}
      <SupplierBulkUpload
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSuccess={() => fetchSuppliers()}
      />
    </div>
  );
};

export default Suppliers;

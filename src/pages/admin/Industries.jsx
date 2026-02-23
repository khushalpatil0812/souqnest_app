import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit, FiSearch, FiRefreshCw, FiBriefcase } from 'react-icons/fi';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useIndustries, useCreateIndustry, useUpdateIndustry, useDeleteIndustry } from '../../hooks/useIndustries';

const Industries = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });

  // React Query hooks
  const { data: industries = [], isLoading: loading, error: queryError, refetch } = useIndustries();
  const createIndustryMutation = useCreateIndustry();
  const updateIndustryMutation = useUpdateIndustry();
  const deleteIndustryMutation = useDeleteIndustry();

  const error = queryError ? queryError.response?.data?.message || 'Failed to fetch industries' : null;

  // Filter industries based on search
  const filteredIndustries = industries.filter(industry => 
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (industry.description && industry.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate stats
  const stats = {
    total: industries.length,
    filtered: filteredIndustries.length,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.name.trim()) {
      alert('Industry name is required');
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
      };

      if (formData.description && formData.description.trim()) {
        submitData.description = formData.description.trim();
      }
      if (formData.icon && formData.icon.trim()) {
        submitData.icon = formData.icon.trim();
      }

      console.log('Submitting industry:', submitData);
      
      if (editMode) {
        await updateIndustryMutation.mutateAsync({ id: selectedIndustryId, data: submitData });
        alert('Industry updated successfully!');
      } else {
        await createIndustryMutation.mutateAsync(submitData);
        alert('Industry created successfully!');
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(`Failed to ${editMode ? 'update' : 'create'} industry:`, err);
      const errors = err.response?.data?.errors;
      let errorMessage = err.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} industry`;
      
      if (errors && Array.isArray(errors) && errors.length > 0) {
        errorMessage += '\n\nDetails:\n' + errors.map(e => `• ${e.path}: ${e.message}`).join('\n');
      }
      
      alert(errorMessage);
    }
  };

  const handleDelete = async (id, industry) => {
    const confirmMessage = `Are you sure you want to delete "${industry.name}"?\n\n⚠️ Warning: This may affect suppliers and products linked to this industry.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteIndustryMutation.mutateAsync(id);
        alert('Industry deleted successfully!');
      } catch (err) {
        console.error('Failed to delete industry:', err);
        const errorMsg = err.response?.data?.message || 'Failed to delete industry';
        alert(`Failed to delete industry:\n\n${errorMsg}`);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
    });
    setEditMode(false);
    setSelectedIndustryId(null);
  };

  const handleEdit = (industry) => {
    const industryId = industry._id || industry.id;
    setEditMode(true);
    setSelectedIndustryId(industryId);
    setFormData({
      name: industry.name,
      description: industry.description || '',
      icon: industry.icon || '',
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-secondary-text">Loading industries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-text">Industries</h1>
          <p className="text-sm text-secondary-text mt-1">Manage industry categories for suppliers and products</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => refetch()}>
            <FiRefreshCw className="inline mr-2" /> Refresh
          </Button>
          <Button onClick={handleAdd}>
            <FiPlus className="inline mr-2" /> Add Industry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Industries</p>
              <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <FiBriefcase size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Active Sectors</p>
              <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <FiBriefcase size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Categories</p>
              <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <FiBriefcase size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-border p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search industries by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-secondary-text mt-2">
            Showing <span className="font-semibold text-primary-text">{stats.filtered}</span> of <span className="font-semibold text-primary-text">{stats.total}</span> industries
          </p>
        )}
      </div>

      {filteredIndustries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <p className="text-secondary-text mb-4">
            {industries.length === 0 ? 'No industries found' : 'No industries match your search'}
          </p>
          {industries.length === 0 && (
            <Button onClick={handleAdd}>
              <FiPlus className="inline mr-2" /> Create First Industry
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndustries.map((industry) => {
            const industryId = industry._id || industry.id;
            return (
              <div
                key={industryId}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border-2 border-blue-100 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {industry.icon && (
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <span className="text-4xl">{industry.icon}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{industry.name}</h3>
                      {industry.description && (
                        <p className="text-sm text-gray-600 italic">{industry.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(industry)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit industry"
                    >
                      <FiEdit size={18} className="text-blue-600" />
                    </button>
                    <button 
                      onClick={() => handleDelete(industryId, industry)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete industry"
                    >
                      <FiTrash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editMode ? 'Edit Industry' : 'Add New Industry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Industry Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Agriculture, Manufacturing, Technology"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Icon (Emoji)</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="🏭"
              maxLength="10"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Add an emoji icon</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="Industry description..."
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit">
              {editMode ? 'Update Industry' : 'Save Industry'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Industries;

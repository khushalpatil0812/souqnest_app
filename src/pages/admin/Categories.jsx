import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiChevronRight, FiPackage, FiExternalLink, FiSearch, FiRefreshCw, FiUpload, FiX } from 'react-icons/fi';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { categoryApi, productApi, extractArray } from '../../services/api';

const Categories = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    imageUrl: '',
    parentId: null,
  });
  const [imageInputMethod, setImageInputMethod] = useState('url'); // 'url' or 'file'
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch categories and products on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAll();
      console.log('Categories fetched:', response);
      setCategories(extractArray(response));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll();
      console.log('Products fetched:', response);
      setProducts(extractArray(response));
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(cat => 
    !cat.parentId && (
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate stats
  const parentCategories = categories.filter(cat => !cat.parentId);
  const subcategories = categories.filter(cat => cat.parentId);
  const stats = {
    total: categories.length,
    parents: parentCategories.length,
    subcategories: subcategories.length,
    productsCount: products.length,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    if (!formData.slug || !formData.slug.trim()) {
      alert('Category slug is required');
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
      };

      // Add optional fields if provided
      if (formData.description && formData.description.trim()) {
        submitData.description = formData.description.trim();
      }
      if (formData.icon && formData.icon.trim()) {
        submitData.icon = formData.icon.trim();
      }
      if (formData.imageUrl && formData.imageUrl.trim()) {
        submitData.imageUrl = formData.imageUrl.trim();
      }
      if (formData.parentId) {
        submitData.parentId = formData.parentId;
      }

      console.log('Submitting category:', submitData);
      console.log('Edit mode:', editMode);
      console.log('Selected category ID:', selectedCategoryId);
      
      if (editMode) {
        // Make sure we have a valid ID (handle both _id and id)
        const categoryId = selectedCategoryId;
        console.log('Updating category with ID:', categoryId);
        await categoryApi.update(categoryId, submitData);
        alert('Category updated successfully!');
      } else {
        await categoryApi.create(submitData);
        alert('Category created successfully!');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      console.error('Error response:', err.response?.data);
      
      const errors = err.response?.data?.errors;
      let errorMessage = err.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} category`;
      
      if (errors && Array.isArray(errors) && errors.length > 0) {
        errorMessage += '\n\nDetails:\n' + errors.map(e => `• ${e.path}: ${e.message}`).join('\n');
      }
      
      alert(errorMessage);
    }
  };

  const handleDelete = async (id, category) => {
    // Check if category has subcategories
    const hasSubcategories = categories.some(cat => {
      const parentId = cat.parentId?._id || cat.parentId?.id || cat.parentId;
      return String(parentId) === String(id);
    });
    
    if (hasSubcategories) {
      alert(`Cannot delete "${category.name}" because it has subcategories.\n\nPlease delete all subcategories first.`);
      return;
    }
    
    const confirmMessage = `Are you sure you want to delete "${category.name}"?\n\n⚠️ Warning: This will also affect any products in this category.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await categoryApi.delete(id);
        alert('Category deleted successfully!');
        fetchCategories();
      } catch (err) {
        console.error('Failed to delete category:', err);
        const errorMsg = err.response?.data?.message || 'Failed to delete category';
        
        // Check for dependency errors
        if (errorMsg.toLowerCase().includes('product') || errorMsg.toLowerCase().includes('depend')) {
          alert(`Cannot delete category:\n\n${errorMsg}\n\nPlease move or delete all products in this category first.`);
        } else {
          alert(`Failed to delete category:\n\n${errorMsg}`);
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, name: value, slug }));
    } else if (name === 'parentId') {
      // Handle parentId - convert empty string to null
      setFormData(prev => ({ ...prev, [name]: value === '' ? null : value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '',
      imageUrl: '',
      parentId: null,
    });
    setEditMode(false);
    setSelectedCategoryId(null);
    setImagePreview(null);
    setImageInputMethod('url');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file selection for category image
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      // Convert file to base64 URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result;
        setFormData(prev => ({ ...prev, imageUrl: base64Url }));
        setImagePreview(base64Url);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop for category image
  const handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        handleImageFileChange({ target: { files: dataTransfer.files } });
      }
    }
  };

  const handleEdit = (category) => {
    console.log('Editing category:', category);
    // Handle both _id (MongoDB) and id
    const categoryId = category._id || category.id;
    console.log('Category ID for edit:', categoryId);
    
    setEditMode(true);
    setSelectedCategoryId(categoryId);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      parentId: category.parentId || null,
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
          <p className="mt-4 text-secondary-text">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchCategories}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-text">Categories</h1>
          <p className="text-sm text-secondary-text mt-1">Manage your product categories and hierarchy</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { fetchCategories(); fetchProducts(); }}>
            <FiRefreshCw className="inline mr-2" /> Refresh
          </Button>
          <Button onClick={handleAdd}>
            <FiPlus className="inline mr-2" /> Add New Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Categories</p>
              <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <FiPackage size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Parent Categories</p>
              <h3 className="text-3xl font-bold mt-1">{stats.parents}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <FiPackage size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Subcategories</p>
              <h3 className="text-3xl font-bold mt-1">{stats.subcategories}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <FiChevronRight size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Products</p>
              <h3 className="text-3xl font-bold mt-1">{stats.productsCount}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <FiPackage size={24} />
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
            placeholder="Search categories by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-secondary-text mt-2">
            Showing <span className="font-semibold text-primary-text">{filteredCategories.length}</span> of <span className="font-semibold text-primary-text">{stats.parents}</span> parent categories
          </p>
        )}
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <p className="text-secondary-text mb-4">
            {categories.length === 0 ? 'No categories found' : 'No categories match your search'}
          </p>
          {categories.length === 0 && (
            <Button onClick={handleAdd}>
              <FiPlus className="inline mr-2" /> Create First Category
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Display parent categories */}
          {filteredCategories.map((category) => {
            const categoryId = category._id || category.id;
            const subcategories = categories.filter(cat => {
              const parentId = cat.parentId?._id || cat.parentId?.id || cat.parentId;
              return String(parentId) === String(categoryId);
            });
            const hasSubcategories = subcategories.length > 0;
            
            // Get products for this category
            const categoryProducts = products.filter(p => {
              const prodCatId = p.categoryId?._id || p.categoryId?.id || p.categoryId;
              return String(prodCatId) === String(categoryId);
            });
            
            return (
              <div
                key={categoryId}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border-2 border-blue-100 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-200"
              >
                {/* Category Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center space-x-4 flex-1">
                    {category.icon && (
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <span className="text-5xl">{category.icon}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold text-gray-800">{category.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Parent
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Slug:</span> {category.slug}
                      </p>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-2 italic">{category.description}</p>
                      )}
                      <div className="flex gap-3 mt-2">
                        {hasSubcategories && (
                          <span className="inline-flex items-center text-xs font-semibold text-purple-700">
                            <FiChevronRight className="mr-1" size={14} />
                            {subcategories.length} Subcategor{subcategories.length === 1 ? 'y' : 'ies'}
                          </span>
                        )}
                        {categoryProducts.length > 0 && (
                          <span className="inline-flex items-center text-xs font-semibold text-green-700">
                            <FiPackage className="mr-1" size={14} />
                            {categoryProducts.length} Product{categoryProducts.length === 1 ? '' : 's'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="p-2.5 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit category"
                    >
                      <FiEdit size={20} className="text-blue-600" />
                    </button>
                    <button 
                      onClick={() => handleDelete(categoryId, category)}
                      className={`p-2.5 rounded-lg transition-colors ${
                        hasSubcategories 
                          ? 'bg-gray-100 cursor-not-allowed' 
                          : 'hover:bg-red-100'
                      }`}
                      title={hasSubcategories ? 'Cannot delete - has subcategories' : 'Delete category'}
                      disabled={hasSubcategories}
                    >
                      <FiTrash2 size={20} className={hasSubcategories ? 'text-gray-400' : 'text-red-600'} />
                    </button>
                  </div>
                </div>
                
                {/* Subcategories Section */}
                {hasSubcategories && (
                  <div className="mt-5 pt-5 border-t-2 border-purple-100">
                    <h4 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <div className="bg-purple-100 p-1.5 rounded">
                        <FiChevronRight size={16} className="text-purple-600" />
                      </div>
                      Subcategories ({subcategories.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {subcategories.map((sub) => {
                        const subId = sub._id || sub.id;
                        const subProducts = products.filter(p => {
                          const prodCatId = p.categoryId?._id || p.categoryId?.id || p.categoryId;
                          return String(prodCatId) === String(subId);
                        });
                        
                        return (
                          <div
                            key={subId}
                            className="bg-white border-2 border-purple-100 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <FiChevronRight size={16} className="text-purple-600" />
                                  <span className="font-semibold text-gray-800">{sub.name}</span>
                                </div>
                                <p className="text-xs text-gray-500 ml-6">
                                  Slug: {sub.slug}
                                </p>
                                {subProducts.length > 0 && (
                                  <div className="flex items-center gap-1 ml-6 mt-2">
                                    <FiPackage size={12} className="text-green-600" />
                                    <span className="text-xs font-medium text-green-700">
                                      {subProducts.length} product{subProducts.length > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => handleEdit(sub)}
                                  className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit subcategory"
                                >
                                  <FiEdit size={14} className="text-blue-600" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(subId, sub)}
                                  className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                  title="Delete subcategory"
                                >
                                  <FiTrash2 size={14} className="text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Products in this category */}
                {categoryProducts.length > 0 && (
                  <div className="mt-5 pt-5 border-t-2 border-green-100">
                    <h4 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
                      <div className="bg-green-100 p-1.5 rounded">
                        <FiPackage size={16} className="text-green-600" />
                      </div>
                      Products ({categoryProducts.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryProducts.map((product) => {
                        const productId = product._id || product.id;
                        const inrPrice = product.prices?.find(p => p.currency === 'INR');
                        return (
                          <div
                            key={productId}
                            className="bg-white border-2 border-green-100 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => navigate('/admin/products')}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <FiPackage size={14} className="text-green-600" />
                                  <span className="font-semibold text-gray-800 text-sm group-hover:text-green-700 transition-colors">
                                    {product.name}
                                  </span>
                                </div>
                                {inrPrice && (
                                  <p className="text-sm font-bold text-green-700 ml-6">
                                    ₹{inrPrice.amount.toLocaleString('en-IN')}
                                  </p>
                                )}
                                {product.supplier && (
                                  <p className="text-xs text-gray-500 ml-6 mt-1">
                                    by {product.supplier?.companyName || 'Unknown'}
                                  </p>
                                )}
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate('/admin/products');
                                }}
                                className="p-1.5 hover:bg-green-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="View in Products"
                              >
                                <FiExternalLink size={14} className="text-green-600" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
        title={editMode ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Category Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter category name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="category-slug"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated from name, can be edited</p>
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
            <label className="block text-sm font-medium text-primary-text mb-2">Category Image</label>
            
            {/* Toggle between URL and File Upload */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageInputMethod('url')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  imageInputMethod === 'url'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📎 Paste URL (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setImageInputMethod('file')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  imageInputMethod === 'file'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📤 Upload File
              </button>
            </div>

            {/* URL Input Method */}
            {imageInputMethod === 'url' && (
              <div>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">✓ Recommended: Fast and reliable</p>
              </div>
            )}

            {/* File Upload Method */}
            {imageInputMethod === 'file' && (
              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">Drag and drop image here</p>
                <p className="text-xs text-gray-500 mt-1">or click to select (Max 5MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="mt-3 relative">
                <div className="p-2 border border-border rounded-lg bg-gray-50">
                  <img
                    src={formData.imageUrl}
                    alt="Category preview"
                    className="max-h-32 object-cover rounded mx-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                    setImagePreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="Category description..."
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Parent Category</label>
            <select 
              name="parentId"
              value={formData.parentId || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">None (Top Level Category)</option>
              {categories
                .filter(c => {
                  const catId = c._id || c.id;
                  return !c.parentId && (!editMode || catId !== selectedCategoryId);
                })
                .map(cat => {
                  const catId = cat._id || cat.id;
                  return (
                    <option key={catId} value={catId}>{cat.name}</option>
                  );
                })}
            </select>
            <p className="text-xs text-gray-500 mt-1">Optional: Make this a subcategory</p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit">
              {editMode ? 'Update Category' : 'Save Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;

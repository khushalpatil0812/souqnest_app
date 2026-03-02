import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiRefreshCw, FiUpload, FiX, FiList, FiHelpCircle, FiLayers } from 'react-icons/fi';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { productApi, categoryApi, extractArray } from '../../services/api';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    overview: '',
    categoryId: '',
    isActive: true,
    imageUrl: '',
    priceINR: '',
    priceSAR: '',
  });
  const [imageInputMethod, setImageInputMethod] = useState('url'); // 'url' or 'file'
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Specifications state (array of { key, value } pairs)
  const [specifications, setSpecifications] = useState([]);
  // Features state (array of { title, description } items)
  const [features, setFeatures] = useState([]);
  // FAQs state (array of { question, answer } items)
  const [faqs, setFaqs] = useState([]);
  // Active form tab
  const [formTab, setFormTab] = useState('basic');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll();
      console.log('Admin Products raw response:', response);
      const extracted = extractArray(response);
      console.log('Admin Products extracted:', extracted.length, 'items');
      setProducts(extracted);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error('Failed to load products:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(extractArray(response));
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  // Separate parent categories and subcategories
  const parentCategories = categories.filter(c => !c.parentId);
  const getSubcategories = (parentId) => categories.filter(c => {
    const pid = c.parentId?.id || c.parentId;
    return String(pid) === String(parentId);
  });

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory ||
      (product.categoryId?.id || product.categoryId) === filterCategory ||
      (product.category?.id) === filterCategory;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && product.isActive) ||
      (filterStatus === 'inactive' && !product.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    filtered: filteredProducts.length,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.name.trim()) {
      alert('Product name is required'); return;
    }
    if (!formData.slug || !formData.slug.trim()) {
      alert('Product slug is required'); return;
    }
    if (!formData.categoryId) {
      alert('Please select a category'); return;
    }
    if (!editMode && (!formData.priceINR || parseFloat(formData.priceINR) <= 0)) {
      alert('Please enter a valid price in INR (greater than 0)'); return;
    }

    try {
      const dataToSend = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        categoryId: formData.categoryId,
        isActive: formData.isActive,
      };

      if (formData.overview && formData.overview.trim()) {
        dataToSend.overview = formData.overview.trim();
      }

      if (formData.imageUrl && formData.imageUrl.trim()) {
        dataToSend.imageUrl = formData.imageUrl.trim();
      }

      if (!editMode || (formData.priceINR && parseFloat(formData.priceINR) > 0)) {
        const prices = [{ amount: parseFloat(formData.priceINR), currency: 'INR' }];
        if (formData.priceSAR && parseFloat(formData.priceSAR) > 0) {
          prices.push({ amount: parseFloat(formData.priceSAR), currency: 'SAR' });
        }
        dataToSend.prices = prices;
      }

      let productId = selectedProductId;

      if (editMode) {
        await productApi.update(selectedProductId, dataToSend);
      } else {
        const createRes = await productApi.create(dataToSend);
        // Extract created product ID from response
        productId = createRes?.id || createRes?.data?.id || createRes?._id || createRes?.data?._id;
        console.log('Created product ID:', productId);
      }

      // Save specifications, features, and FAQs if product ID is available
      if (productId) {
        const savePromises = [];

        // Save specifications if any
        const validSpecs = specifications.filter(s => s.key && s.key.trim() && s.value && s.value.trim());
        if (validSpecs.length > 0) {
          savePromises.push(
            productApi.updateSpecifications(productId, { specifications: validSpecs.map(s => ({ key: s.key.trim(), value: s.value.trim() })) })
              .catch(err => console.error('Failed to save specifications:', err))
          );
        }

        // Save features if any
        const validFeatures = features.filter(f => f.title && f.title.trim());
        if (validFeatures.length > 0) {
          savePromises.push(
            productApi.updateFeatures(productId, { features: validFeatures.map(f => ({ title: f.title.trim(), description: f.description?.trim() || '' })) })
              .catch(err => console.error('Failed to save features:', err))
          );
        }

        // Save FAQs if any
        const validFaqs = faqs.filter(f => f.question && f.question.trim() && f.answer && f.answer.trim());
        if (validFaqs.length > 0) {
          savePromises.push(
            productApi.updateFaqs(productId, { faqs: validFaqs.map(f => ({ question: f.question.trim(), answer: f.answer.trim() })) })
              .catch(err => console.error('Failed to save FAQs:', err))
          );
        }

        if (savePromises.length > 0) {
          await Promise.all(savePromises);
        }
      }

      alert(`Product ${editMode ? 'updated' : 'created'} successfully!`);
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      const errors = err.response?.data?.errors;
      let errorMessage = err.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} product`;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        errorMessage += ':\n' + errors.map(e => {
          if (typeof e === 'string') return `- ${e}`;
          return `- ${e.field || e.path || 'Field'}: ${e.message || e.msg || JSON.stringify(e)}`;
        }).join('\n');
      }
      alert(errorMessage);
    }
  };

  const handleEdit = (product) => {
    const productId = product._id || product.id;
    const inrPrice = product.prices?.find(p => p.currency === 'INR');
    const sarPrice = product.prices?.find(p => p.currency === 'SAR');

    setEditMode(true);
    setSelectedProductId(productId);
    setFormData({
      name: product.name,
      slug: product.slug,
      overview: product.overview || '',
      categoryId: product.category?.id || product.categoryId?.id || product.categoryId || '',
      isActive: product.isActive,
      imageUrl: product.imageUrl || '',
      priceINR: inrPrice ? String(inrPrice.amount) : '',
      priceSAR: sarPrice ? String(sarPrice.amount) : '',
    });
    setFormTab('basic');

    // Load existing specifications
    setSpecifications(
      Array.isArray(product.specifications) && product.specifications.length > 0
        ? product.specifications.map(s => ({ key: s.key || '', value: s.value || '' }))
        : []
    );

    // Load existing features
    if (productId) {
      productApi.getFeatures(productId)
        .then(res => {
          const feats = extractArray(res);
          setFeatures(feats.length > 0 ? feats.map(f => ({ title: f.title || '', description: f.description || '' })) : []);
        })
        .catch(() => setFeatures(Array.isArray(product.features) ? product.features.map(f => ({ title: f.title || '', description: f.description || '' })) : []));
    }

    // Load existing FAQs
    setFaqs(
      Array.isArray(product.faqs) && product.faqs.length > 0
        ? product.faqs.map(f => ({ question: f.question || '', answer: f.answer || '' }))
        : []
    );

    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Delete failed: No product ID provided');
      alert('Cannot delete: Product ID is missing');
      return;
    }
    console.log('Attempting to delete product with ID:', id);
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.delete(id);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete product:', err);
        console.error('Delete URL attempted:', `/products/${id}`);
        console.error('Error response:', err.response?.data);
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleToggleStatus = async (product) => {
    const id = product._id || product.id;
    if (!id) {
      setError('Cannot toggle status: Product ID is missing');
      return;
    }
    try {
      await productApi.update(id, { isActive: !product.isActive });
      fetchProducts();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      console.error('Toggle status failed:', errMsg);
      setError('Failed to update product status: ' + errMsg);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', overview: '', categoryId: '', isActive: true, imageUrl: '', priceINR: '', priceSAR: '' });
    setEditMode(false);
    setSelectedProductId(null);
    setImagePreview(null);
    setImageInputMethod('url');
    setSpecifications([]);
    setFeatures([]);
    setFaqs([]);
    setFormTab('basic');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file selection for product image
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

  // Handle drag and drop for product image
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

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, name: value, slug }));
      return;
    }

    if (name === 'priceINR') {
      setFormData(prev => ({ ...prev, priceINR: value }));
      if (value && parseFloat(value) > 0) {
        try {
          const rate = await getExchangeRate('INR', 'SAR');
          const sarAmount = (parseFloat(value) * rate).toFixed(2);
          setFormData(prev => ({ ...prev, priceSAR: sarAmount }));
        } catch (error) {
          console.error('Currency conversion failed:', error);
        }
      } else {
        setFormData(prev => ({ ...prev, priceSAR: '' }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getExchangeRate = async (from, to) => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const data = await response.json();
      return data.rates[to] || 0.045;
    } catch {
      return 0.045;
    }
  };

  const columns = [
    {
      label: 'Product Name',
      key: 'name',
      render: (row) => (
        <div>
          <div className="font-semibold text-primary-text">{row.name}</div>
          <div className="text-xs text-gray-500">{row.slug}</div>
        </div>
      )
    },
    {
      label: 'Category',
      key: 'category',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.category?.name || 'N/A'}
        </span>
      )
    },
    {
      label: 'Price (INR)',
      key: 'price',
      render: (row) => {
        const inrPrice = row.prices?.find(p => p.currency === 'INR');
        return inrPrice ? (
          <div className="font-semibold text-green-700">
            ₹{inrPrice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        ) : <span className="text-gray-400">N/A</span>;
      }
    },
    {
      label: 'Price (SAR)',
      key: 'priceSAR',
      render: (row) => {
        const sarPrice = row.prices?.find(p => p.currency === 'SAR');
        return sarPrice ? (
          <div className="font-semibold text-purple-700">
            ﷼{sarPrice.amount.toLocaleString('en-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        ) : <span className="text-gray-400">N/A</span>;
      }
    },
    {
      label: 'Status',
      key: 'isActive',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleStatus(row)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${
              row.isActive ? 'bg-green-500' : 'bg-gray-300'
            }`}
            title={row.isActive ? 'Click to deactivate' : 'Click to activate'}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                row.isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-xs font-medium ${row.isActive ? 'text-green-600' : 'text-gray-500'}`}>
            {row.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    },
    {
      label: 'Date Added',
      key: 'createdAt',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      )
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit product">
            <FiEdit size={16} className="text-blue-600" />
          </button>
          <button onClick={() => handleDelete(row._id || row.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete product">
            <FiTrash2 size={16} className="text-red-600" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-text">Product Management</h1>
          <p className="text-sm text-secondary-text mt-1">Manage your product catalog and pricing</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchProducts}>
            <FiRefreshCw className="inline mr-2" /> Refresh
          </Button>
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
            <FiPlus className="inline mr-2" /> Add New Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-blue-100 text-sm font-medium">Total Products</p>
          <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-green-100 text-sm font-medium">Active Products</p>
          <h3 className="text-3xl font-bold mt-1">{stats.active}</h3>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-orange-100 text-sm font-medium">Inactive Products</p>
          <h3 className="text-3xl font-bold mt-1">{stats.inactive}</h3>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-lg shadow-md">
          <p className="text-purple-100 text-sm font-medium">Categories</p>
          <h3 className="text-3xl font-bold mt-1">{categories.length}</h3>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-border p-4">
        <h3 className="text-sm font-semibold text-primary-text mb-3 flex items-center gap-2">
          <FiFilter size={16} /> Filters & Search
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {parentCategories.map(cat => (
              <optgroup key={cat.id} label={cat.name}>
                <option value={cat.id}>{cat.name}</option>
                {getSubcategories(cat.id).map(sub => (
                  <option key={sub.id} value={sub.id}>&nbsp;&nbsp;↳ {sub.name}</option>
                ))}
              </optgroup>
            ))}
          </select>

          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? status === 'active' ? 'bg-green-600 text-white' : status === 'inactive' ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {(searchTerm || filterCategory || filterStatus !== 'all') && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm text-secondary-text">
              Showing <span className="font-semibold text-primary-text">{stats.filtered}</span> of <span className="font-semibold text-primary-text">{stats.total}</span> products
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      {loading && (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-secondary-text">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-border">
          <p className="text-secondary-text mb-4">
            {products.length === 0 ? 'No products found. Add your first product!' : 'No products match your filters.'}
          </p>
          {products.length === 0 && (
            <Button onClick={() => setIsModalOpen(true)}>
              <FiPlus className="inline mr-2" /> Add First Product
            </Button>
          )}
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <Table columns={columns} data={filteredProducts} />
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editMode ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Tabs */}
          <div className="flex border-b border-border overflow-x-auto">
            {[
              { key: 'basic', label: 'Basic Info', icon: <FiEdit size={14} /> },
              { key: 'specifications', label: 'Specifications', icon: <FiLayers size={14} /> },
              { key: 'features', label: 'Features', icon: <FiList size={14} /> },
              { key: 'faqs', label: 'FAQs', icon: <FiHelpCircle size={14} /> },
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFormTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  formTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ======= BASIC INFO TAB ======= */}
          {formTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1">Product Name *</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-text mb-1">Slug *</label>
                <input
                  type="text" name="slug" value={formData.slug} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="product-slug"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from name, can be edited</p>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1">Category *</label>
                <select
                  name="categoryId" value={formData.categoryId} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Category</option>
                  {parentCategories.map(parent => (
                    <optgroup key={parent.id} label={`📁 ${parent.name}`}>
                      <option value={parent.id}>{parent.name} (Parent)</option>
                      {getSubcategories(parent.id).map(sub => (
                        <option key={sub.id} value={sub.id}>&nbsp;&nbsp;↳ {sub.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Product Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">Product Image</label>
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setImageInputMethod('url')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageInputMethod === 'url' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    📎 Paste URL
                  </button>
                  <button type="button" onClick={() => setImageInputMethod('file')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageInputMethod === 'file' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    📤 Upload File
                  </button>
                </div>
                {imageInputMethod === 'url' && (
                  <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/product.jpg" />
                )}
                {imageInputMethod === 'file' && (
                  <div onDrop={handleImageDrop} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <FiUpload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Drag and drop image here</p>
                    <p className="text-xs text-gray-500 mt-1">or click to select (Max 5MB)</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </div>
                )}
                {formData.imageUrl && (
                  <div className="mt-3 relative">
                    <div className="p-2 border border-border rounded-lg bg-gray-50">
                      <img src={formData.imageUrl} alt="Product preview" className="max-h-48 object-cover rounded mx-auto"
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <button type="button" onClick={() => { setFormData(prev => ({ ...prev, imageUrl: '' })); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors" title="Remove image">
                      <FiX size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">Product Price {!editMode && '*'}</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Auto-Currency Conversion:</strong> Enter price in INR (₹). SAR (﷼) will be automatically calculated.
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Price in INR (₹) {!editMode && '*'}</label>
                    <div className="flex gap-2">
                      <input type="number" name="priceINR" step="0.01" min="0.01" value={formData.priceINR} onChange={handleChange} required={!editMode}
                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter price in INR" />
                      <div className="px-4 py-2 bg-gray-100 border border-border rounded-lg text-gray-700 font-medium min-w-[80px] flex items-center justify-center">INR ₹</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Price in SAR (﷼) - Auto-calculated</label>
                    <div className="flex gap-2">
                      <input type="number" name="priceSAR" step="0.01" value={formData.priceSAR} readOnly disabled
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" placeholder="Will be auto-calculated from INR" />
                      <div className="px-4 py-2 bg-gray-100 border border-border rounded-lg text-gray-700 font-medium min-w-[80px] flex items-center justify-center">SAR ﷼</div>
                    </div>
                    {formData.priceSAR && <p className="text-xs text-green-600 mt-1">✓ Converted at real-time rate</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-text mb-1">Description</label>
                <textarea name="overview" value={formData.overview} onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="4" placeholder="Product description..."></textarea>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="rounded" />
                <label className="text-sm font-medium">Product is Active</label>
              </div>
            </div>
          )}

          {/* ======= SPECIFICATIONS TAB ======= */}
          {formTab === 'specifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <FiLayers size={16} /> Product Specifications
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Add key-value pairs like Material, Weight, Dimensions, etc.</p>
                </div>
                <button type="button" onClick={() => setSpecifications(prev => [...prev, { key: '', value: '' }])}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  <FiPlus size={14} /> Add Spec
                </button>
              </div>
              {specifications.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <FiLayers className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-sm text-gray-400">No specifications added yet</p>
                  <button type="button" onClick={() => setSpecifications([{ key: '', value: '' }])}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add first specification</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <input type="text" value={spec.key} placeholder="Key (e.g. Material)"
                        onChange={(e) => { const updated = [...specifications]; updated[idx].key = e.target.value; setSpecifications(updated); }}
                        className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input type="text" value={spec.value} placeholder="Value (e.g. Stainless Steel)"
                        onChange={(e) => { const updated = [...specifications]; updated[idx].value = e.target.value; setSpecifications(updated); }}
                        className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      <button type="button" onClick={() => setSpecifications(prev => prev.filter((_, i) => i !== idx))}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======= FEATURES TAB ======= */}
          {formTab === 'features' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <FiList size={16} /> Product Features
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Highlight key features of the product.</p>
                </div>
                <button type="button" onClick={() => setFeatures(prev => [...prev, { title: '', description: '' }])}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                  <FiPlus size={14} /> Add Feature
                </button>
              </div>
              {features.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <FiList className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-sm text-gray-400">No features added yet</p>
                  <button type="button" onClick={() => setFeatures([{ title: '', description: '' }])}
                    className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Add first feature</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {features.map((feat, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400">Feature #{idx + 1}</span>
                        <button type="button" onClick={() => setFeatures(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors" title="Remove">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                      <input type="text" value={feat.title} placeholder="Feature title"
                        onChange={(e) => { const updated = [...features]; updated[idx].title = e.target.value; setFeatures(updated); }}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      <textarea value={feat.description} placeholder="Feature description (optional)"
                        onChange={(e) => { const updated = [...features]; updated[idx].description = e.target.value; setFeatures(updated); }}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" rows="2"></textarea>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======= FAQS TAB ======= */}
          {formTab === 'faqs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <FiHelpCircle size={16} /> Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Add common questions and answers about the product.</p>
                </div>
                <button type="button" onClick={() => setFaqs(prev => [...prev, { question: '', answer: '' }])}
                  className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg text-sm font-medium hover:bg-violet-100 transition-colors">
                  <FiPlus size={14} /> Add FAQ
                </button>
              </div>
              {faqs.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <FiHelpCircle className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-sm text-gray-400">No FAQs added yet</p>
                  <button type="button" onClick={() => setFaqs([{ question: '', answer: '' }])}
                    className="mt-2 text-sm text-violet-600 hover:text-violet-700 font-medium">+ Add first FAQ</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400">FAQ #{idx + 1}</span>
                        <button type="button" onClick={() => setFaqs(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors" title="Remove">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                      <input type="text" value={faq.question} placeholder="Question"
                        onChange={(e) => { const updated = [...faqs]; updated[idx].question = e.target.value; setFaqs(updated); }}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      <textarea value={faq.answer} placeholder="Answer"
                        onChange={(e) => { const updated = [...faqs]; updated[idx].answer = e.target.value; setFaqs(updated); }}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" rows="3"></textarea>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit">{editMode ? 'Update Product' : 'Create Product'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;

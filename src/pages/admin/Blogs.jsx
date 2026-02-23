import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const Blogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const blogs = [
    { 
      id: 1, 
      title: 'Top 10 Manufacturing Trends in 2026', 
      author: 'Admin',
      category: 'Industry News',
      status: 'published',
      seoScore: 85,
      views: 1234,
      date: '2026-02-10',
    },
    { 
      id: 2, 
      title: 'How to Choose the Right Industrial Equipment', 
      author: 'Admin',
      category: 'Guides',
      status: 'published',
      seoScore: 92,
      views: 2456,
      date: '2026-02-08',
    },
    { 
      id: 3, 
      title: 'Understanding B2B E-Commerce for Manufacturers', 
      author: 'Admin',
      category: 'Business',
      status: 'draft',
      seoScore: 78,
      views: 0,
      date: '2026-02-12',
    },
  ];

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBlog(null);
    setIsModalOpen(true);
  };

  const getSEOBadge = (score) => {
    if (score >= 90) return <Badge variant="success">Excellent</Badge>;
    if (score >= 75) return <Badge variant="primary">Good</Badge>;
    if (score >= 60) return <Badge variant="warning">Fair</Badge>;
    return <Badge variant="danger">Poor</Badge>;
  };

  const columns = [
    { label: 'Title', key: 'title' },
    { label: 'Category', key: 'category' },
    { label: 'Author', key: 'author' },
    { 
      label: 'Status', 
      key: 'status',
      render: (row) => (
        <Badge variant={row.status === 'published' ? 'success' : 'default'}>
          {row.status}
        </Badge>
      )
    },
    {
      label: 'SEO Score',
      key: 'seoScore',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-primary-text font-medium">{row.seoScore}</span>
          {getSEOBadge(row.seoScore)}
        </div>
      )
    },
    { label: 'Views', key: 'views' },
    { label: 'Date', key: 'date' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(row)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FiEdit2 size={16} className="text-blue-600" />
          </button>
          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
            <FiTrash2 size={16} className="text-red-600" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-text">Blog Management</h1>
        <Button onClick={handleAdd}>
          <FiPlus className="inline mr-2" /> Add New Blog
        </Button>
      </div>

      <Table columns={columns} data={blogs} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBlog(null);
        }}
        title={selectedBlog ? 'Edit Blog' : 'Add New Blog'}
        size="lg"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">Title</label>
            <input
              type="text"
              defaultValue={selectedBlog?.title}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter blog title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-text mb-2">Category</label>
              <select 
                defaultValue={selectedBlog?.category}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Industry News</option>
                <option>Guides</option>
                <option>Business</option>
                <option>Technology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-text mb-2">Status</label>
              <select 
                defaultValue={selectedBlog?.status}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-text mb-2">Content</label>
            <textarea
              rows={6}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write your blog content here..."
            />
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-primary-text mb-3">SEO Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-text mb-2">Meta Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="SEO optimized title"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-secondary-text mb-2">Meta Description</label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Brief description for search engines"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-secondary-text mb-2">Keywords (comma separated)</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="manufacturing, B2B, industrial"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit">Save Blog</Button>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Blogs;

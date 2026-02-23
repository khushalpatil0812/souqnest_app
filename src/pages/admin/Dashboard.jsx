import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiPackage, FiGrid, FiMessageSquare,
  FiTrendingUp, FiBriefcase, FiRefreshCw, FiBarChart2,
  FiPieChart, FiArrowRight
} from 'react-icons/fi';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { dashboardApi, rfqApi, supplierApi, productApi, categoryApi, industryApi, extractArray, extractObject } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [productPopularity, setProductPopularity] = useState([]);
  const [rfqAnalytics, setRfqAnalytics] = useState(null);
  const [recentRFQs, setRecentRFQs] = useState([]);
  const [recentSuppliers, setRecentSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [fallbackCounts, setFallbackCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard metrics and supplementary data in parallel
      const [metricsRes, popularityRes, analyticsRes, rfqsRes, suppliersRes, productsRes, categoriesRes, industriesRes] = await Promise.all([
        dashboardApi.getMetrics().catch(() => null),
        dashboardApi.getProductPopularity().catch(() => null),
        dashboardApi.getRfqAnalytics().catch(() => null),
        rfqApi.getAll().catch(() => null),
        supplierApi.getAll().catch(() => null),
        productApi.getAll().catch(() => null),
        categoryApi.getAll().catch(() => null),
        industryApi.getAll().catch(() => null),
      ]);

      // Extract metrics (object) - handles { data: {...} } or flat object
      setMetrics(extractObject(metricsRes, {}));
      
      // Extract arrays
      setProductPopularity(extractArray(popularityRes));

      // RFQ analytics is an object with pending/responded counts
      setRfqAnalytics(extractObject(analyticsRes, {}));

      // Extract list data - no limit param so we get all items for counting
      const allRfqs = extractArray(rfqsRes);
      const allSuppliers = extractArray(suppliersRes);
      const allProducts = extractArray(productsRes);
      const allCategories = extractArray(categoriesRes);
      const allIndustries = extractArray(industriesRes);

      setRecentRFQs(allRfqs.slice(0, 5));
      setRecentSuppliers(allSuppliers.slice(0, 5));
      setCategories(allCategories);
      setIndustries(allIndustries);
      
      // Store full counts for fallback metrics
      setFallbackCounts({
        suppliers: allSuppliers.length,
        products: allProducts.length,
        rfqs: allRfqs.length,
        categories: allCategories.length,
        industries: allIndustries.length,
        pendingRfqs: allRfqs.filter(r => r.status === 'PENDING').length,
        respondedRfqs: allRfqs.filter(r => r.status === 'RESPONDED').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract stats: prefer directly counted data (always fresh) over metrics endpoint (may be cached)
  const getStatValue = (key, fallbackKey) => {
    // Prefer fallback counts from actual API data – these are always up-to-date
    if (fallbackKey && fallbackCounts[fallbackKey] !== undefined) return fallbackCounts[fallbackKey];
    // Then try metrics endpoint
    if (metrics && metrics[key] !== undefined) return metrics[key];
    if (metrics?.counts && metrics.counts[key] !== undefined) return metrics.counts[key];
    return 0;
  };

  const statsCards = [
    {
      title: 'Total Suppliers',
      value: (getStatValue('totalSuppliers', 'suppliers') || getStatValue('suppliers', 'suppliers') || recentSuppliers.length).toString(),
      icon: <FiUsers size={24} />,
      color: 'from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50 text-blue-600',
      onClick: () => navigate('/admin/suppliers')
    },
    {
      title: 'Total Products',
      value: (getStatValue('totalProducts', 'products') || getStatValue('products', 'products') || 0).toString(),
      icon: <FiPackage size={24} />,
      color: 'from-emerald-500 to-emerald-600',
      lightColor: 'bg-emerald-50 text-emerald-600',
      onClick: () => navigate('/admin/products')
    },
    {
      title: 'Categories',
      value: (getStatValue('totalCategories', 'categories') || getStatValue('categories', 'categories') || categories.length).toString(),
      icon: <FiGrid size={24} />,
      color: 'from-violet-500 to-violet-600',
      lightColor: 'bg-violet-50 text-violet-600',
      onClick: () => navigate('/admin/categories')
    },
    {
      title: 'Industries',
      value: (getStatValue('totalIndustries', 'industries') || getStatValue('industries', 'industries') || industries.length).toString(),
      icon: <FiBriefcase size={24} />,
      color: 'from-amber-500 to-amber-600',
      lightColor: 'bg-amber-50 text-amber-600',
      onClick: () => navigate('/admin/industries')
    },
    {
      title: 'Total RFQs',
      value: (getStatValue('totalRfqs', 'rfqs') || getStatValue('rfqs', 'rfqs') || 0).toString(),
      icon: <FiMessageSquare size={24} />,
      color: 'from-rose-500 to-rose-600',
      lightColor: 'bg-rose-50 text-rose-600',
      onClick: () => navigate('/admin/rfqs')
    },
  ];

  const rfqColumns = [
    {
      label: 'Company',
      key: 'companyName',
      render: (row) => row.companyName || 'N/A'
    },
    {
      label: 'Contact',
      key: 'contactName',
      render: (row) => row.contactName || 'N/A'
    },
    {
      label: 'Items',
      key: 'items',
      render: (row) => {
        const items = row.items || [];
        if (items.length === 0) return 'N/A';
        return `${items.length} product(s)`;
      }
    },
    {
      label: 'Status',
      key: 'status',
      render: (row) => (
        <Badge variant={row.status === 'PENDING' ? 'warning' : row.status === 'RESPONDED' ? 'primary' : 'default'}>
          {row.status || 'PENDING'}
        </Badge>
      )
    },
    {
      label: 'Date',
      key: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
  ];

  const supplierColumns = [
    { label: 'Name', key: 'companyName' },
    {
      label: 'Type',
      key: 'supplierType',
      render: (row) => <Badge variant="default">{row.supplierType?.replace('_', ' ') || 'N/A'}</Badge>
    },
    {
      label: 'Status',
      key: 'status',
      render: (row) => (
        <div className="flex gap-1">
          {row.isFeatured && <Badge variant="featured">Featured</Badge>}
          {row.isVerified && <Badge variant="verified">Verified</Badge>}
        </div>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600 mt-1">Overview of your platform</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" className="flex items-center gap-2">
          <FiRefreshCw size={16} /> Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            onClick={stat.onClick}
            className="cursor-pointer bg-white rounded-xl shadow-sm border border-neutral-200/60 p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.lightColor}`}>
                {stat.icon}
              </div>
              <FiArrowRight size={16} className="text-neutral-300 group-hover:text-neutral-500 transition-colors" />
            </div>
            <div className="text-3xl font-bold text-neutral-900 mb-0.5">{stat.value}</div>
            <div className="text-sm text-neutral-500">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFQ Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-primary-600" size={20} />
            <h2 className="text-lg font-bold text-neutral-900">RFQ Analytics</h2>
          </div>
          {rfqAnalytics && Object.keys(rfqAnalytics).length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-amber-700">
                    {rfqAnalytics.pending || rfqAnalytics.PENDING || fallbackCounts.pendingRfqs || 0}
                  </div>
                  <div className="text-sm text-amber-600">Pending RFQs</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">
                    {rfqAnalytics.responded || rfqAnalytics.RESPONDED || fallbackCounts.respondedRfqs || 0}
                  </div>
                  <div className="text-sm text-blue-600">Responded RFQs</div>
                </div>
              </div>
              {(rfqAnalytics.total !== undefined || fallbackCounts.rfqs > 0) && (
                <div className="text-sm text-neutral-500">
                  Total: {rfqAnalytics.total ?? fallbackCounts.rfqs ?? 0} requests
                </div>
              )}
            </div>
          ) : fallbackCounts.rfqs > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-amber-700">
                    {fallbackCounts.pendingRfqs || 0}
                  </div>
                  <div className="text-sm text-amber-600">Pending RFQs</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">
                    {fallbackCounts.respondedRfqs || 0}
                  </div>
                  <div className="text-sm text-blue-600">Responded RFQs</div>
                </div>
              </div>
              <div className="text-sm text-neutral-500">
                Total: {fallbackCounts.rfqs} requests
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <FiBarChart2 className="mx-auto mb-2" size={32} />
              <p className="text-sm">No analytics data yet</p>
            </div>
          )}
        </div>

        {/* Product Popularity */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-emerald-600" size={20} />
            <h2 className="text-lg font-bold text-neutral-900">Top Products</h2>
          </div>
          {productPopularity.length > 0 ? (
            <div className="space-y-3">
              {productPopularity.slice(0, 5).map((item, idx) => {
                // Handle various backend response shapes for product name
                const productName = item.name || item.productName || item.Product?.name || item.product?.name || 'Unknown';
                // Handle various count field names
                const requestCount = item.requestCount || item.request_count || item.count || item.rfqCount || item.totalQuantity || item.total_quantity || item.views || 0;
                return (
                  <div key={item.productId || item.id || idx} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-neutral-400 w-6">#{idx + 1}</span>
                      <span className="font-medium text-neutral-900 text-sm">{productName}</span>
                    </div>
                    <Badge variant="default">{requestCount} requests</Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <FiTrendingUp className="mx-auto mb-2" size={32} />
              <p className="text-sm">No popularity data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Categories & Industries Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiGrid className="text-violet-600" size={20} />
              <h2 className="text-lg font-bold text-neutral-900">Categories</h2>
            </div>
            <button
              onClick={() => navigate('/admin/categories')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Manage →
            </button>
          </div>
          {categories.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {/* Show parent categories */}
              {categories.filter(c => !c.parentId).slice(0, 8).map(cat => {
                const subcats = categories.filter(c => c.parentId === cat.id);
                return (
                  <div key={cat.id} className="border border-neutral-100 rounded-lg p-3">
                    <div className="font-medium text-neutral-900 text-sm flex items-center justify-between">
                      {cat.name}
                      {subcats.length > 0 && (
                        <span className="text-xs text-neutral-400">{subcats.length} sub</span>
                      )}
                    </div>
                    {subcats.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {subcats.slice(0, 4).map(sub => (
                          <span key={sub.id} className="inline-block px-2 py-0.5 bg-violet-50 text-violet-700 rounded text-xs">
                            {sub.name}
                          </span>
                        ))}
                        {subcats.length > 4 && (
                          <span className="text-xs text-neutral-400">+{subcats.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <FiGrid className="mx-auto mb-2" size={32} />
              <p className="text-sm">No categories yet</p>
            </div>
          )}
        </div>

        {/* Industries */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiBriefcase className="text-amber-600" size={20} />
              <h2 className="text-lg font-bold text-neutral-900">Industries</h2>
            </div>
            <button
              onClick={() => navigate('/admin/industries')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Manage →
            </button>
          </div>
          {industries.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
              {industries.map(ind => (
                <div key={ind.id} className="px-3 py-2 bg-amber-50 border border-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                  {ind.name}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <FiBriefcase className="mx-auto mb-2" size={32} />
              <p className="text-sm">No industries yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent RFQs */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200/60 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-neutral-200/60">
            <h2 className="text-lg font-bold text-neutral-900">Recent RFQs</h2>
            <button
              onClick={() => navigate('/admin/rfqs')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </button>
          </div>
          {recentRFQs.length > 0 ? (
            <Table columns={rfqColumns} data={recentRFQs} />
          ) : (
            <div className="text-center py-12">
              <FiMessageSquare className="mx-auto text-neutral-400 mb-3" size={40} />
              <p className="text-neutral-600">No recent RFQs</p>
            </div>
          )}
        </div>

        {/* Recent Suppliers */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200/60 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-neutral-200/60">
            <h2 className="text-lg font-bold text-neutral-900">Recent Suppliers</h2>
            <button
              onClick={() => navigate('/admin/suppliers')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </button>
          </div>
          {recentSuppliers.length > 0 ? (
            <Table columns={supplierColumns} data={recentSuppliers} />
          ) : (
            <div className="text-center py-12">
              <FiUsers className="mx-auto text-neutral-400 mb-3" size={40} />
              <p className="text-neutral-600">No recent suppliers</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

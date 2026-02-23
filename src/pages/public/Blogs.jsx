import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

const Blogs = () => {
  const featuredBlog = {
    id: 1,
    title: 'The Future of B2B Manufacturing: Trends to Watch in 2026',
    excerpt: 'Discover the latest trends reshaping the industrial manufacturing landscape, from AI integration to sustainable practices.',
    category: 'Industry Trends',
    date: 'Feb 10, 2026',
    readTime: '8 min read',
    image: '🏭',
  };

  const blogs = [
    {
      id: 2,
      title: 'How to Choose the Right Industrial Supplier',
      excerpt: 'A comprehensive guide to evaluating and selecting suppliers for your business needs.',
      category: 'Guides',
      date: 'Feb 8, 2026',
      readTime: '5 min read',
      image: '📋',
    },
    {
      id: 3,
      title: 'Supply Chain Optimization in the Digital Age',
      excerpt: 'Learn how digital tools and automation are transforming supply chain management.',
      category: 'Technology',
      date: 'Feb 5, 2026',
      readTime: '6 min read',
      image: '🔗',
    },
    {
      id: 4,
      title: 'Sustainable Manufacturing Practices',
      excerpt: 'Explore eco-friendly approaches that benefit both business and environment.',
      category: 'Sustainability',
      date: 'Feb 2, 2026',
      readTime: '7 min read',
      image: '🌱',
    },
    {
      id: 5,
      title: 'Quality Control Best Practices',
      excerpt: 'Essential strategies for maintaining product quality and consistency.',
      category: 'Quality',
      date: 'Jan 30, 2026',
      readTime: '5 min read',
      image: '✓',
    },
    {
      id: 6,
      title: 'International Trade Regulations 2026',
      excerpt: 'Stay updated on the latest import/export regulations and compliance requirements.',
      category: 'Regulations',
      date: 'Jan 28, 2026',
      readTime: '10 min read',
      image: '🌍',
    },
  ];

  const categories = ['All', 'Industry Trends', 'Guides', 'Technology', 'Sustainability', 'Quality'];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold font-heading text-primary-900 mb-4">
              Insights & Articles
            </h1>
            <p className="text-gray-600 text-lg">
              Stay informed with the latest industry news, guides, and expert insights
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Featured Blog */}
            <Card hover className="mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <span className="text-8xl">{featuredBlog.image}</span>
                </div>
                <div className="md:w-2/3">
                  <Badge variant="featured" className="mb-3">Featured</Badge>
                  <Badge variant="category" className="mb-3 ml-2">{featuredBlog.category}</Badge>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{featuredBlog.date}</span>
                    <span className="mx-2">•</span>
                    <FiClock className="mr-1" />
                    <span>{featuredBlog.readTime}</span>
                  </div>
                  <Link to={`/blog/${featuredBlog.id}`}>
                    <Button>
                      Read More <FiArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog) => (
                <Card key={blog.id} hover>
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-6xl">{blog.image}</span>
                  </div>
                  <Badge variant="category" className="mb-3">{blog.category}</Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{blog.date}</span>
                    <span className="mx-2">•</span>
                    <FiClock className="mr-1" />
                    <span>{blog.readTime}</span>
                  </div>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                  >
                    Read More <FiArrowRight className="ml-2" />
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm">1</button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">3</button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Search */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Search</h3>
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              />
            </Card>

            {/* Categories */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button className="text-gray-700 hover:text-primary-600 text-sm">
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Newsletter */}
            <Card className="bg-primary-900 text-white">
              <h3 className="font-bold mb-2">Subscribe to Newsletter</h3>
              <p className="text-sm text-gray-300 mb-4">
                Get the latest articles delivered to your inbox
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 rounded text-gray-900 text-sm mb-2"
              />
              <Button className="w-full bg-white text-primary-900 hover:bg-gray-100">
                Subscribe
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;

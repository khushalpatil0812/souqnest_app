import React, { useState } from 'react';
import { FiCheckCircle, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useCreateSupplier } from '../../hooks/useSuppliers';

const BecomePartner = () => {
  const initialFormState = {
    companyName: '',
    supplierType: '',
    industry: '',
    yearsInBusiness: '',
    companyDescription: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    businessAddress: '',
  };

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  
  // Use React Query mutation hook
  const createSupplierMutation = useCreateSupplier();

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const benefits = [
    {
      icon: <FiTrendingUp size={40} />,
      title: 'Expand Your Reach',
      description: 'Access thousands of buyers from around the world looking for your products and services.',
    },
    {
      icon: <FiUsers size={40} />,
      title: 'Verified Leads',
      description: 'Connect with verified businesses and decision-makers actively seeking suppliers.',
    },
    {
      icon: <FiAward size={40} />,
      title: 'Build Credibility',
      description: 'Showcase your certifications, products, and achievements to build trust with potential buyers.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Submit Application',
      description: 'Fill out the partnership form with your business details and documentation.',
    },
    {
      number: '2',
      title: 'Verification Process',
      description: 'Our team reviews your application and verifies your business credentials.',
    },
    {
      number: '3',
      title: 'Start Growing',
      description: 'Once approved, create your profile and start connecting with buyers worldwide.',
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const payload = {
      companyName: formData.companyName.trim(),
      supplierType: formData.supplierType,
      description: formData.companyDescription.trim() || undefined,
      websiteUrl: formData.website.trim() || undefined,
    };

    if (!payload.companyName || !payload.supplierType) {
      setError('Please complete the required fields before submitting.');
      return;
    }

    try {
      await createSupplierMutation.mutateAsync(payload);
      setSubmitted(true);
      setFormData(initialFormState);
      setError('');
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to submit application right now.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl font-bold font-heading mb-6">
              Become a Partner
            </h1>
            <p className="text-xl text-gray-200">
              Join thousands of suppliers on SouqNest and connect with businesses worldwide. 
              Grow your sales and expand your market reach.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-heading text-center text-primary-900 mb-12">
            Why Partner with Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <div className="text-primary-600 flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-heading text-center text-primary-900 mb-12">
            How It Works
          </h2>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary-200 transform -translate-y-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <Card className="text-center">
                    <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Form */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-heading text-center text-primary-900 mb-8">
            Partner Application Form
          </h2>

          {submitted ? (
            <Card className="text-center py-12">
              <FiCheckCircle className="text-green-500 mx-auto mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Application Submitted!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in becoming a partner. Our team will review your 
                application and get back to you within 2-3 business days.
              </p>
              <Button onClick={() => setSubmitted(false)}>
                Submit Another Application
              </Button>
            </Card>
          ) : (
            <Card>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Company Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Company Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="Your company name"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type *
                        </label>
                        <select
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          name="supplierType"
                          value={formData.supplierType}
                          onChange={handleInputChange}
                        >
                          <option value="">Select business type</option>
                          <option value="MANUFACTURER">Manufacturer</option>
                          <option value="TRADER">Trader</option>
                          <option value="CONTRACTOR">Contractor</option>
                          <option value="SERVICE_PROVIDER">Service Provider</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Industry *
                          </label>
                          <select
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                          >
                            <option value="">Select industry</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="electronics">Electronics</option>
                            <option value="chemicals">Chemicals</option>
                            <option value="textiles">Textiles</option>
                            <option value="machinery">Machinery</option>
                            <option value="automotive">Automotive</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years in Business *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                            placeholder="e.g., 10"
                            name="yearsInBusiness"
                            value={formData.yearsInBusiness}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Description *
                        </label>
                        <textarea
                          required
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="Brief description of your company and products/services"
                          name="companyDescription"
                          value={formData.companyDescription}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Person *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="Full name"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                            placeholder="email@company.com"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                            placeholder="+1 (555) 000-0000"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="https://www.yourcompany.com"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Address *
                        </label>
                        <textarea
                          required
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="Full business address"
                          name="businessAddress"
                          value={formData.businessAddress}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Business Documents
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business License
                        </label>
                        <input
                          type="file"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certifications (Optional)
                        </label>
                        <input
                          type="file"
                          multiple
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  {error && (
                    <p className="text-sm text-red-600 text-center">
                      {error}
                    </p>
                  )}

                  <Button type="submit" className="w-full py-4 text-lg" disabled={createSupplierMutation.isPending}>
                    {createSupplierMutation.isPending ? 'Submitting...' : 'Submit Application'}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </form>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default BecomePartner;

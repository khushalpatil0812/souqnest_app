import React, { useState, useRef } from 'react';
import { FiUpload, FiDownload, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { supplierApi } from '../../services/api';

const SupplierBulkUpload = ({ isOpen, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_EXTENSIONS = ['.xlsx', '.csv'];

  // Reset form state
  const resetForm = () => {
    setSelectedFile(null);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Validate file
  const validateFile = (file) => {
    if (!file) {
      return 'Please select a file';
    }

    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return 'Invalid file type. Only .xlsx and .csv files are allowed';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit';
    }

    return null;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError(null);
    setSuccess(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
  };

  // Handle file upload
  const handleUpload = async () => {
    // Validate file before upload
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await supplierApi.bulkUpload(formData);
      
      // Extract success information from response
      const totalInserted = response?.totalInserted || response?.data?.totalInserted || 0;
      
      setSuccess(`Suppliers imported successfully! Total Inserted: ${totalInserted}`);
      resetForm();
      
      // Notify parent component to refresh data
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error('Bulk upload error:', err);
      
      // Handle different error types
      if (err.response) {
        const status = err.response.status;
        const responseData = err.response.data;
        const message = responseData?.message || responseData?.error;
        
        // Handle validation errors specially
        if (status === 400 && responseData?.details?.errors) {
          const validationErrors = responseData.details.errors;
          let errorMsg = `❌ ${message}\n\n`;
          errorMsg += `Total Rows: ${responseData.details.totalRows}\n`;
          errorMsg += `Invalid Rows: ${responseData.details.invalidRows}\n\n`;
          errorMsg += 'Errors:\n';
          
          validationErrors.forEach((err, idx) => {
            errorMsg += `\nRow ${err.row}:\n`;
            err.errors.forEach(e => {
              errorMsg += `  • ${e}\n`;
            });
          });
          
          setError(errorMsg);
        } else {
          switch (status) {
            case 400:
              setError(message || 'Invalid file format or data validation failed');
              break;
            case 401:
              setError('Unauthorized. Please login again');
              break;
            case 413:
              setError('File too large. Maximum file size is 5MB');
              break;
            case 403:
              setError('Access denied. Admin privileges required');
              break;
            default:
              setError(message || 'Failed to upload file. Please try again');
          }
        }
      } else if (err.request) {
        setError('Network error. Please check your connection and ensure backend is running');
      } else {
        setError('Failed to upload file. Please try again');
      }
    } finally {
      setUploading(false);
    }
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const csvContent = 'companyName,websiteUrl,supplierType,description,logoUrl,isFeatured,isAuthorizedPartner,isVerified\n' +
      'ABC Engineering,https://abc.com,MANUFACTURER,Industrial panels manufacturer,,TRUE,FALSE,TRUE\n' +
      'XYZ Traders,https://xyz.com,TRADER,Electronic components trader,,FALSE,TRUE,TRUE\n' +
      'Tech Services Ltd,https://techservices.com,SERVICE_PROVIDER,IT consulting services,,FALSE,FALSE,FALSE';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'supplier_bulk_upload_template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Upload Suppliers" size="md">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Upload Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Download the template and fill in supplier details</li>
            <li>Only .xlsx and .csv files are accepted (use exact column names)</li>
            <li>Maximum file size: 5MB</li>
            <li>Maximum records: 100 per upload</li>
            <li><strong>Required:</strong> companyName, supplierType</li>
            <li><strong>Valid types:</strong> MANUFACTURER, TRADER, CONTRACTOR, SERVICE_PROVIDER</li>
          </ul>
        </div>

        {/* Download Template Button */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <FiDownload className="inline mr-2" /> Download Template
          </Button>
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-primary-text mb-2">
            Select File
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiUpload className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {selectedFile ? selectedFile.name : 'Click to select or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                .xlsx or .csv (max 5MB)
              </p>
            </label>
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && !error && (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-600" />
              <span className="text-sm text-green-800">{selectedFile.name}</span>
              <span className="text-xs text-green-600">
                ({(selectedFile.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <button
              onClick={resetForm}
              className="text-green-600 hover:text-green-800"
              disabled={uploading}
            >
              <FiX size={18} />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
              <pre className="text-xs text-red-800 whitespace-pre-wrap font-mono">{error}</pre>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-4">
            <FiCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={!selectedFile || uploading ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {uploading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Uploading...
              </>
            ) : (
              <>
                <FiUpload className="inline mr-2" /> Upload File
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SupplierBulkUpload;

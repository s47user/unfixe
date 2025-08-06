import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Bookmark, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Search,
  Copy,
  Mail,
  MessageCircle,
  Printer,
  Eye,
  FileText,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { DocumentService } from '../services/documentService';
import type { Document } from '../config/supabase';

const DocumentViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [documentError, setDocumentError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (id) {
      loadDocument(id);
    }
  }, [id]);

  useEffect(() => {
    if (document?.public_url && DocumentService.isViewableInBrowser(document.format)) {
      validateDocument();
    }
  }, [document]);

  const loadDocument = async (documentId: string) => {
    setLoading(true);
    try {
      const result = await DocumentService.getDocumentById(documentId);
      if (result.success && result.data) {
        setDocument(result.data);
      } else {
        setError(result.error || 'Document not found');
      }
    } catch (error) {
      setError('Error loading document');
    } finally {
      setLoading(false);
    }
  };

  const validateDocument = async () => {
    if (!document?.public_url) return;
    
    setIsValidating(true);
    setDocumentError('');
    
    try {
      const isValid = await DocumentService.validateDocumentUrl(document.public_url);
      if (!isValid) {
        setDocumentError('Document is currently unavailable or the link is broken.');
      }
    } catch (error) {
      setDocumentError('Unable to validate document accessibility.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDownload = () => {
    if (document) {
      DocumentService.downloadDocument(document);
    }
  };

  const handlePrint = () => {
    if (document?.public_url) {
      const printWindow = window.open(document.public_url, '_blank');
      printWindow?.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  const handleShare = (method: string) => {
    if (!document) return;

    const url = window.location.href;
    const title = document.title;
    const text = `Check out this document: ${title}`;

    switch (method) {
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`);
        break;
    }
    setShowShareMenu(false);
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const zoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Document Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'The requested document could not be found.'}
          </p>
          <Button onClick={() => navigate('/timeline')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Timeline
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/timeline')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {document.title}
                </h1>
                <p className="text-xs text-gray-500">
                  {document.name} • {DocumentService.formatFileSize(document.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search in document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48 h-8 text-sm"
                />
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Button variant="ghost" size="sm" onClick={zoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="px-2 text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <Button variant="ghost" size="sm" onClick={zoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={rotate}>
                <RotateCw className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-elevation-2 py-1 z-20">
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Viewer */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
          {document.public_url ? (
            DocumentService.isViewableInBrowser(document.format) ? (
              <div className="w-full h-full flex flex-col">
                {/* Document validation status */}
                {isValidating && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-blue-700 dark:text-blue-300">Validating document...</span>
                    </div>
                  </div>
                )}
                
                {/* Document error message */}
                {documentError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                          Document Access Issue
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                          {documentError}
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={validateDocument}>
                            Retry
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-1" />
                            Download Instead
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Document viewer */}
                <div 
                  className="flex-1 bg-white shadow-elevation-2 rounded-lg overflow-hidden"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                >
                  <iframe
                    src={DocumentService.getViewerUrl(document)}
                    className="w-full h-full border-0"
                    title={document.title}
                    onError={() => setDocumentError('Failed to load document viewer.')}
                    onLoad={() => setDocumentError('')}
                  />
                  
                  {/* Fallback message for browsers that don't support iframe */}
                  <noscript>
                    <div className="p-8 text-center">
                      <p className="text-gray-600 mb-4">
                        Your browser does not support inline document viewing.
                      </p>
                      <Button onClick={() => window.open(document.public_url, '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Document
                      </Button>
                    </div>
                  </noscript>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center min-w-[400px]">
                <div className="text-6xl mb-4">
                  {DocumentService.getFileTypeIcon(document.format)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {document.format.toUpperCase()} Document
                </h3>
                <p className="text-gray-600 mb-4">
                  This document format cannot be previewed in the browser.
                </p>
                <div className="space-y-2">
                  <Button onClick={handleDownload} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download to View
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(document.public_url, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div className="p-8 text-center min-w-[400px]">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Document Unavailable
              </h3>
              <p className="text-gray-600">
                The document file could not be loaded.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Document Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</label>
                <p className="text-gray-900 dark:text-white">{document.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">File Name</label>
                <p className="text-gray-900 dark:text-white text-sm break-all">{document.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Year</label>
                  <p className="text-gray-900 dark:text-white">{document.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Format</label>
                  <p className="text-gray-900 dark:text-white">{document.format}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Size</label>
                <p className="text-gray-900 dark:text-white">{DocumentService.formatFileSize(document.size)}</p>
              </div>
              
              {document.category && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</label>
                  <p className="text-gray-900 dark:text-white">{document.category}</p>
                </div>
              )}
              
              {document.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                  <p className="text-gray-900 dark:text-white text-sm">{document.description}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Added</label>
                <p className="text-gray-900 dark:text-white text-sm">
                  {new Date(document.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button fullWidth onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              
              <Button variant="outline" fullWidth onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              
              <Button variant="outline" fullWidth>
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmark
              </Button>
            </div>

            {/* Related Documents */}
            <div className="mt-8">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" fullWidth className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Similar Documents
                </Button>
                <Button variant="ghost" size="sm" fullWidth className="justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Search in Category
                </Button>
                <Button variant="ghost" size="sm" fullWidth className="justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Browse {document.year} Documents
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerPage;
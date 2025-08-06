import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  HelpCircle, 
  Book, 
  Video, 
  MessageCircle, 
  Mail, 
  Phone,
  Clock,
  Download,
  User,
  Lock,
  Settings,
  FileText,
  Monitor,
  Smartphone,
  Wifi,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

const SupportPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I create an account?',
      answer: 'To create an account, click the "Sign Up" button on the homepage. You\'ll need to use your university email address and create a secure password. After registration, you may need to verify your email address before accessing all features.'
    },
    {
      category: 'getting-started',
      question: 'What browsers are supported?',
      answer: 'The platform works best with modern browsers including Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. We recommend keeping your browser updated for the best experience and security.'
    },
    {
      category: 'account-profile',
      question: 'How do I change my password?',
      answer: 'Go to your Profile page and click on "Change Password" in the security section. You\'ll need to enter your current password and then your new password twice to confirm the change.'
    },
    {
      category: 'account-profile',
      question: 'Can I update my profile picture?',
      answer: 'Yes, you can upload a profile picture from your Profile page. Click on the camera icon next to your current picture and select a new image. Supported formats are JPG, PNG, and GIF with a maximum size of 5MB.'
    },
    {
      category: 'documents',
      question: 'What file types can I upload?',
      answer: 'You can upload PDF, DOC, and DOCX files. Each file must be smaller than 10MB. We recommend using PDF format for legal documents as it preserves formatting and is widely compatible.'
    },
    {
      category: 'documents',
      question: 'How do I organize my documents?',
      answer: 'Documents are automatically organized by year when you upload them. You can also add categories and descriptions to make them easier to find. Use the search function to quickly locate specific documents.'
    },
    {
      category: 'technical',
      question: 'The platform is loading slowly. What can I do?',
      answer: 'Slow loading can be caused by internet connection issues or browser problems. Try refreshing the page, clearing your browser cache, or switching to a different browser. If problems persist, contact technical support.'
    },
    {
      category: 'technical',
      question: 'I\'m getting an error when uploading files. What should I do?',
      answer: 'Check that your file is in a supported format (PDF, DOC, DOCX) and under 10MB. Ensure you have a stable internet connection. If the error persists, try uploading a different file or contact support with the error message.'
    },
    {
      category: 'mobile',
      question: 'Can I use the platform on my phone?',
      answer: 'Yes, the platform is fully responsive and works on mobile devices. You can access all features through your mobile browser. For the best experience, we recommend using the latest version of your mobile browser.'
    },
    {
      category: 'accessibility',
      question: 'Is the platform accessible to users with disabilities?',
      answer: 'Yes, we\'re committed to accessibility and follow WCAG 2.1 guidelines. The platform supports screen readers, keyboard navigation, and high contrast modes. Visit our Accessibility page for detailed information about available features.'
    }
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email',
      icon: Mail,
      contact: 'support@pentvars.edu.gh',
      responseTime: '24-48 hours',
      availability: 'Monday - Friday',
      action: 'Send Email'
    },
    {
      title: 'Phone Support',
      description: 'Speak with our support team',
      icon: Phone,
      contact: '+233 (0) 302 123 456',
      responseTime: 'Immediate',
      availability: '9 AM - 5 PM (GMT)',
      action: 'Call Now'
    },
    {
      title: 'Live Chat',
      description: 'Chat with support online',
      icon: MessageCircle,
      contact: 'Available in platform',
      responseTime: '5-10 minutes',
      availability: 'Monday - Friday, 9 AM - 5 PM',
      action: 'Start Chat',
      comingSoon: true
    },
    {
      title: 'Video Call',
      description: 'Schedule a video consultation',
      icon: Video,
      contact: 'By appointment',
      responseTime: 'Scheduled',
      availability: 'Monday - Friday',
      action: 'Schedule Call',
      comingSoon: true
    }
  ];

  const filteredFaqs = faqs;

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Support Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Get help with the Pentecost University Digital Legal Resource Hub
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
          
          {filteredFaqs.length === 0 && (
            <Card className="p-8 text-center">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No FAQs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No frequently asked questions are currently available
              </p>
            </Card>
          )}
        </div>

        {/* Contact Support */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Contact Support
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactOptions.map((option, index) => (
              <Card key={index} className="p-6 text-center relative">
                {option.comingSoon && (
                  <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Soon
                  </div>
                )}
                
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-6 h-6 text-primary-600" />
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {option.description}
                </p>
                
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{option.responseTime}</span>
                  </div>
                  <div>{option.availability}</div>
                  <div className="font-medium">{option.contact}</div>
                </div>
                
                {option.comingSoon ? (
                  <Button size="sm" variant="outline" disabled fullWidth>
                    {option.action}
                  </Button>
                ) : option.title === 'Email Support' ? (
                  <a href={`mailto:${option.contact}`}>
                    <Button size="sm" fullWidth>
                      {option.action}
                    </Button>
                  </a>
                ) : option.title === 'Phone Support' ? (
                  <a href={`tel:${option.contact}`}>
                    <Button size="sm" fullWidth>
                      {option.action}
                    </Button>
                  </a>
                ) : (
                  <Button size="sm" fullWidth disabled>
                    {option.action}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Additional Resources
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Developer Profile
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Learn more about the developer behind this platform and their other projects.
              </p>
              <a href="https://aboutdev.web.app/" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" fullWidth>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </a>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Video Tutorials
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Step-by-step video guides for common tasks and features.
              </p>
              <Button size="sm" variant="outline" fullWidth disabled>
                <Video className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Accessibility
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Information about accessibility features and support options.
              </p>
              <Link to="/accessibility">
                <Button size="sm" variant="outline" fullWidth>
                  <Monitor className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Ear, 
  Hand, 
  Brain, 
  Monitor, 
  Keyboard, 
  Mouse,
  Smartphone,
  Settings,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Users,
  BookOpen,
  Zap
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

const AccessibilityPage: React.FC = () => {
  const lastUpdated = "January 15, 2024";

  const accessibilityFeatures = [
    {
      category: "Visual Accessibility",
      icon: Eye,
      color: "bg-blue-500",
      features: [
        {
          title: "High Contrast Mode",
          description: "Enhanced color contrast for better visibility",
          status: "Available",
          implementation: "Toggle in theme settings or use system preferences"
        },
        {
          title: "Dark/Light Theme",
          description: "Reduce eye strain with customizable themes",
          status: "Available",
          implementation: "Theme toggle in header navigation"
        },
        {
          title: "Scalable Text",
          description: "Zoom up to 200% without horizontal scrolling",
          status: "Available",
          implementation: "Browser zoom or system text scaling"
        },
        {
          title: "Screen Reader Support",
          description: "Compatible with NVDA, JAWS, and VoiceOver",
          status: "Available",
          implementation: "Semantic HTML and ARIA labels throughout"
        },
        {
          title: "Focus Indicators",
          description: "Clear visual focus indicators for navigation",
          status: "Available",
          implementation: "Visible focus rings on all interactive elements"
        }
      ]
    },
    {
      category: "Motor Accessibility",
      icon: Hand,
      color: "bg-green-500",
      features: [
        {
          title: "Keyboard Navigation",
          description: "Full platform access using only keyboard",
          status: "Available",
          implementation: "Tab, Enter, Space, and arrow key support"
        },
        {
          title: "Large Click Targets",
          description: "Minimum 44px touch targets for easy interaction",
          status: "Available",
          implementation: "All buttons and links meet size requirements"
        },
        {
          title: "No Time Limits",
          description: "No automatic timeouts on content or forms",
          status: "Available",
          implementation: "Sessions remain active during use"
        },
        {
          title: "Drag and Drop Alternatives",
          description: "Alternative methods for file uploads",
          status: "Available",
          implementation: "Click-to-browse file selection available"
        }
      ]
    },
    {
      category: "Cognitive Accessibility",
      icon: Brain,
      color: "bg-purple-500",
      features: [
        {
          title: "Clear Navigation",
          description: "Consistent and predictable navigation structure",
          status: "Available",
          implementation: "Breadcrumbs and clear page hierarchy"
        },
        {
          title: "Error Prevention",
          description: "Clear error messages and validation",
          status: "Available",
          implementation: "Real-time form validation and helpful error text"
        },
        {
          title: "Simple Language",
          description: "Clear, concise language throughout the platform",
          status: "Available",
          implementation: "Plain language principles applied"
        },
        {
          title: "Progress Indicators",
          description: "Clear feedback on loading and progress states",
          status: "Available",
          implementation: "Loading spinners and progress bars"
        }
      ]
    },
    {
      category: "Hearing Accessibility",
      icon: Ear,
      color: "bg-orange-500",
      features: [
        {
          title: "Visual Notifications",
          description: "Important alerts shown visually",
          status: "Available",
          implementation: "Toast notifications and visual feedback"
        },
        {
          title: "Captions for Videos",
          description: "Closed captions for all video content",
          status: "Planned",
          implementation: "Will be added as video content is introduced"
        },
        {
          title: "Text Alternatives",
          description: "Text descriptions for audio content",
          status: "Planned",
          implementation: "Transcripts will accompany audio materials"
        }
      ]
    }
  ];

  const keyboardShortcuts = [
    { key: "Tab", action: "Navigate to next interactive element" },
    { key: "Shift + Tab", action: "Navigate to previous interactive element" },
    { key: "Enter", action: "Activate buttons and links" },
    { key: "Space", action: "Activate buttons and checkboxes" },
    { key: "Escape", action: "Close modals and dropdowns" },
    { key: "Arrow Keys", action: "Navigate within menus and lists" },
    { key: "Home", action: "Go to beginning of page or list" },
    { key: "End", action: "Go to end of page or list" },
    { key: "Ctrl + F", action: "Search within page" },
    { key: "Alt + 1", action: "Skip to main content" }
  ];

  const assistiveTechnologies = [
    {
      name: "Screen Readers",
      icon: Monitor,
      description: "NVDA, JAWS, VoiceOver, TalkBack",
      compatibility: "Fully Compatible",
      notes: "All content is properly labeled and structured for screen readers"
    },
    {
      name: "Voice Control",
      icon: Ear,
      description: "Dragon NaturallySpeaking, Voice Control",
      compatibility: "Compatible",
      notes: "Voice commands work with properly labeled interface elements"
    },
    {
      name: "Switch Navigation",
      icon: Settings,
      description: "Single-switch and multi-switch devices",
      compatibility: "Compatible",
      notes: "Keyboard navigation supports switch-based input methods"
    },
    {
      name: "Eye Tracking",
      icon: Eye,
      description: "Tobii, EyeGaze systems",
      compatibility: "Compatible",
      notes: "Large click targets and clear focus indicators support eye tracking"
    },
    {
      name: "Magnification Software",
      icon: Zap,
      description: "ZoomText, MAGic, built-in magnifiers",
      compatibility: "Fully Compatible",
      notes: "Platform scales properly with magnification software"
    }
  ];

  const wcagCompliance = [
    {
      level: "WCAG 2.1 Level A",
      status: "Compliant",
      description: "Basic accessibility requirements met",
      details: [
        "All images have alternative text",
        "Content is keyboard accessible",
        "Page has proper heading structure",
        "Color is not the only means of conveying information"
      ]
    },
    {
      level: "WCAG 2.1 Level AA",
      status: "Mostly Compliant",
      description: "Enhanced accessibility standards",
      details: [
        "Color contrast ratios meet 4.5:1 minimum",
        "Text can be resized up to 200%",
        "Focus indicators are clearly visible",
        "Error identification and suggestions provided"
      ]
    },
    {
      level: "WCAG 2.1 Level AAA",
      status: "Partially Compliant",
      description: "Highest accessibility standards",
      details: [
        "Some areas achieve 7:1 contrast ratio",
        "Context-sensitive help available",
        "Error prevention mechanisms in place",
        "Ongoing improvements for full compliance"
      ]
    }
  ];

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
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Accessibility Statement
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Pentecost University Digital Legal Resource Hub
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Commitment Statement */}
        <Card className="p-6 mb-8 border-l-4 border-l-primary-500">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Our Commitment to Accessibility
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Pentecost University is committed to ensuring that our Digital Legal Resource Hub 
                is accessible to all users, including those with disabilities. We strive to meet 
                or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We believe that everyone should have equal access to legal education resources, 
                regardless of their abilities or the technologies they use to access the web.
              </p>
            </div>
          </div>
        </Card>

        {/* Accessibility Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Accessibility Features
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {accessibilityFeatures.map((category, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.category}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {category.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {feature.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          feature.status === 'Available' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {feature.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {feature.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {feature.implementation}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Keyboard Navigation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Keyboard Navigation
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Keyboard Shortcuts
                </h3>
              </div>
              
              <div className="space-y-3">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-3 flex-1">
                      {shortcut.action}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Navigation Tips
                </h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use Tab to move forward through interactive elements</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use Shift+Tab to move backward through elements</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Press Enter or Space to activate buttons and links</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use arrow keys to navigate within menus and lists</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Press Escape to close modals and dropdown menus</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Skip links are available to jump to main content</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Assistive Technology Support */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Assistive Technology Support
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assistiveTechnologies.map((tech, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <tech.icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {tech.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {tech.description}
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Compatibility:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tech.compatibility === 'Fully Compatible'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {tech.compatibility}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {tech.notes}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* WCAG Compliance */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            WCAG 2.1 Compliance Status
          </h2>
          
          <div className="space-y-4">
            {wcagCompliance.map((level, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {level.level}
                  </h3>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    level.status === 'Compliant'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : level.status === 'Mostly Compliant'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {level.status}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {level.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {level.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Known Issues and Improvements */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Known Issues and Ongoing Improvements
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Known Issues
                </h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>PDF viewer may have limited screen reader support for complex documents</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Some third-party embedded content may not meet full accessibility standards</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Video content currently lacks captions (planned for future releases)</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Planned Improvements
                </h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Enhanced PDF accessibility with better screen reader support</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Automatic captions for all video content</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Voice navigation and control features</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Enhanced mobile accessibility features</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact and Feedback */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Accessibility Support and Feedback
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We welcome your feedback on the accessibility of our platform. If you encounter 
                any barriers or have suggestions for improvement, please contact us.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Email Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">accessibility@pentvars.edu.gh</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Phone Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">+233 (0) 302 123 456</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Disability Services</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Student Support Office</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:accessibility@pentvars.edu.gh">
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  Report Accessibility Issue
                </Button>
              </a>
              <Link to="/support">
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  General Support
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPage;
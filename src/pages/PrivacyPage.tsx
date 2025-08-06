import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Users, 
  Globe, 
  Settings,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

const PrivacyPage: React.FC = () => {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: Shield,
      content: [
        "Pentecost University College ('University', 'we', 'us', or 'our') is committed to protecting the privacy and security of your personal information.",
        "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the Pentecost University Digital Legal Resource Hub (the 'Platform').",
        "This policy applies to all users of the Platform, including students, faculty, staff, and authorized visitors.",
        "By using the Platform, you consent to the data practices described in this Privacy Policy."
      ]
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      icon: Database,
      content: [
        "We collect several types of information from and about users of our Platform:",
        "",
        "Personal Information:",
        "• Full name and preferred name",
        "• University email address and alternative contact information",
        "• Student or employee identification numbers",
        "• Academic program and year of study",
        "• Profile photographs (optional)",
        "• Academic records relevant to course enrollment",
        "",
        "Usage Information:",
        "• Login times and frequency of Platform access",
        "• Documents viewed, downloaded, or uploaded",
        "• Search queries and browsing patterns",
        "• Course materials accessed and time spent on resources",
        "• Device information (browser type, operating system, IP address)",
        "",
        "Academic Content:",
        "• Documents and materials you upload to the Platform",
        "• Comments, annotations, and bookmarks you create",
        "• Academic work and submissions (where applicable)",
        "• Collaboration and sharing activities"
      ]
    },
    {
      id: "how-we-collect",
      title: "3. How We Collect Information",
      icon: Eye,
      content: [
        "We collect information through various methods:",
        "",
        "Direct Collection:",
        "• Information you provide during account registration",
        "• Data you submit when uploading documents or creating content",
        "• Communications you send to us through the Platform",
        "• Feedback and survey responses",
        "",
        "Automatic Collection:",
        "• Cookies and similar tracking technologies",
        "• Server logs that record Platform usage",
        "• Analytics tools that track user behavior",
        "• Security monitoring systems",
        "",
        "Third-Party Integration:",
        "• Information from University student information systems",
        "• Authentication data from University single sign-on systems",
        "• Academic records from authorized University databases"
      ]
    },
    {
      id: "use-of-information",
      title: "4. How We Use Your Information",
      icon: Settings,
      content: [
        "We use the collected information for the following purposes:",
        "",
        "Educational Services:",
        "• Providing access to legal resources and course materials",
        "• Personalizing your learning experience",
        "• Tracking academic progress and engagement",
        "• Facilitating collaboration between students and faculty",
        "",
        "Platform Operations:",
        "• Maintaining and improving Platform functionality",
        "• Ensuring security and preventing unauthorized access",
        "• Troubleshooting technical issues",
        "• Generating usage analytics and reports",
        "",
        "Communication:",
        "• Sending important Platform updates and notifications",
        "• Responding to your inquiries and support requests",
        "• Providing academic and administrative announcements",
        "",
        "Compliance and Safety:",
        "• Monitoring compliance with University policies",
        "• Investigating potential academic integrity violations",
        "• Ensuring legal and regulatory compliance",
        "• Protecting the rights and safety of all users"
      ]
    },
    {
      id: "information-sharing",
      title: "5. Information Sharing and Disclosure",
      icon: Users,
      content: [
        "We may share your information in the following circumstances:",
        "",
        "Within the University:",
        "• Faculty members for academic and administrative purposes",
        "• IT support staff for technical assistance",
        "• Academic administrators for policy compliance",
        "• Student services for support and guidance",
        "",
        "Third-Party Service Providers:",
        "• Cloud storage and hosting providers (with appropriate safeguards)",
        "• Analytics and monitoring services",
        "• Security and authentication services",
        "• Technical support and maintenance providers",
        "",
        "Legal Requirements:",
        "• When required by law, regulation, or court order",
        "• To protect the rights, property, or safety of the University or others",
        "• In response to lawful requests from public authorities",
        "• To investigate potential violations of University policies",
        "",
        "We do not sell, rent, or trade your personal information to third parties for commercial purposes."
      ]
    },
    {
      id: "data-security",
      title: "6. Data Security",
      icon: Lock,
      content: [
        "We implement comprehensive security measures to protect your information:",
        "",
        "Technical Safeguards:",
        "• Encryption of data in transit and at rest",
        "• Secure authentication and access controls",
        "• Regular security audits and vulnerability assessments",
        "• Firewall protection and intrusion detection systems",
        "",
        "Administrative Safeguards:",
        "• Staff training on data protection and privacy",
        "• Access controls based on job responsibilities",
        "• Regular review and update of security policies",
        "• Incident response procedures for security breaches",
        "",
        "Physical Safeguards:",
        "• Secure data centers with restricted access",
        "• Environmental controls and monitoring",
        "• Backup and disaster recovery procedures",
        "",
        "While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but will notify you of any significant security incidents affecting your data."
      ]
    },
    {
      id: "data-retention",
      title: "7. Data Retention",
      icon: Database,
      content: [
        "We retain your information for different periods based on the type of data and its purpose:",
        "",
        "Account Information:",
        "• Retained while your account is active",
        "• Maintained for up to 7 years after graduation or employment termination",
        "• May be retained longer for alumni services or historical records",
        "",
        "Academic Content:",
        "• Course-related materials retained according to University academic policies",
        "• User-generated content retained while account is active",
        "• May be archived for institutional research purposes (anonymized)",
        "",
        "Usage Data:",
        "• Server logs retained for up to 2 years",
        "• Analytics data retained for up to 5 years",
        "• Security logs retained according to University IT policies",
        "",
        "Legal Requirements:",
        "• Some data may be retained longer to comply with legal obligations",
        "• Records related to academic integrity may be retained permanently"
      ]
    },
    {
      id: "your-rights",
      title: "8. Your Privacy Rights",
      icon: CheckCircle,
      content: [
        "You have several rights regarding your personal information:",
        "",
        "Access and Portability:",
        "• Request access to your personal information",
        "• Obtain copies of your data in a portable format",
        "• Review how your information is being used",
        "",
        "Correction and Updates:",
        "• Update your profile information at any time",
        "• Request correction of inaccurate information",
        "• Modify your communication preferences",
        "",
        "Deletion and Restriction:",
        "• Request deletion of your account and associated data",
        "• Restrict processing of your information in certain circumstances",
        "• Object to certain uses of your information",
        "",
        "To exercise these rights, contact us using the information provided in the Contact section. We will respond to your request within 30 days, subject to University policies and legal requirements."
      ]
    },
    {
      id: "cookies-tracking",
      title: "9. Cookies and Tracking Technologies",
      icon: Globe,
      content: [
        "We use cookies and similar technologies to enhance your Platform experience:",
        "",
        "Essential Cookies:",
        "• Required for Platform functionality and security",
        "• Authentication and session management",
        "• Cannot be disabled without affecting Platform operation",
        "",
        "Functional Cookies:",
        "• Remember your preferences and settings",
        "• Personalize your Platform experience",
        "• Improve Platform performance and usability",
        "",
        "Analytics Cookies:",
        "• Track Platform usage and performance",
        "• Help us understand user behavior and preferences",
        "• Generate reports for Platform improvement",
        "",
        "You can control cookie settings through your browser preferences. However, disabling certain cookies may limit Platform functionality. We do not use cookies for advertising or marketing purposes."
      ]
    },
    {
      id: "third-party-services",
      title: "10. Third-Party Services",
      icon: Globe,
      content: [
        "The Platform integrates with several third-party services:",
        "",
        "Authentication Services:",
        "• Firebase Authentication for secure login",
        "• University single sign-on systems",
        "• Multi-factor authentication providers",
        "",
        "Storage and Hosting:",
        "• Supabase for database and file storage",
        "• Cloud hosting providers for Platform infrastructure",
        "• Content delivery networks for improved performance",
        "",
        "Analytics and Monitoring:",
        "• Usage analytics to improve Platform functionality",
        "• Performance monitoring for system optimization",
        "• Security monitoring for threat detection",
        "",
        "These third-party services have their own privacy policies. We encourage you to review their policies to understand how they handle your information. We only work with providers that maintain appropriate data protection standards."
      ]
    },
    {
      id: "international-transfers",
      title: "11. International Data Transfers",
      icon: Globe,
      content: [
        "Your information may be transferred to and processed in countries other than Ghana:",
        "",
        "Cloud Services:",
        "• Some of our service providers operate servers in multiple countries",
        "• Data may be stored in secure data centers outside Ghana",
        "• All transfers comply with applicable data protection laws",
        "",
        "Safeguards:",
        "• We ensure appropriate safeguards are in place for international transfers",
        "• Service providers must meet our data protection standards",
        "• Contractual protections govern all data processing arrangements",
        "",
        "Your Rights:",
        "• You have the right to know where your data is processed",
        "• You can request information about safeguards in place",
        "• You may object to certain international transfers"
      ]
    },
    {
      id: "children-privacy",
      title: "12. Children's Privacy",
      icon: Users,
      content: [
        "The Platform is designed for university-level education and is not intended for children under 18:",
        "",
        "Age Requirements:",
        "• Users must be at least 18 years old or have reached the age of majority",
        "• Younger users require parental consent and University authorization",
        "• Special protections apply to users under 18",
        "",
        "Parental Rights:",
        "• Parents of users under 18 may request access to their child's information",
        "• Parents can request deletion of their child's account",
        "• We will verify parental identity before providing access",
        "",
        "If we become aware that we have collected information from a child under 18 without proper consent, we will take steps to delete that information promptly."
      ]
    },
    {
      id: "policy-changes",
      title: "13. Changes to This Privacy Policy",
      icon: Settings,
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements:",
        "",
        "Notification of Changes:",
        "• We will notify users of significant changes via email or Platform notification",
        "• The updated policy will be posted on the Platform with a new effective date",
        "• Continued use of the Platform after changes constitutes acceptance",
        "",
        "Types of Changes:",
        "• Updates to reflect new Platform features or services",
        "• Changes required by law or regulation",
        "• Improvements to data protection practices",
        "",
        "We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information."
      ]
    },
    {
      id: "contact-information",
      title: "14. Contact Information",
      icon: Mail,
      content: [
        "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
        "",
        "Primary Contact:",
        "• Phone: +233 264 790 221",
        "• Address: Pentecost University College, Accra, Ghana",
        "",
        "Legal Department:",
        "• Email: pentvarslawofficial@gmail.com",
        "• Office: Faculty of Law",
        "",
        "We will respond to your inquiries within 30 days and work with you to address any concerns about your privacy rights."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
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
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Pentecost University Digital Legal Resource Hub
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="p-6 mb-8 border-l-4 border-l-primary-500">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Your Privacy Matters
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                This Privacy Policy explains how Pentecost University collects, uses, and protects 
                your personal information when you use our Digital Legal Resource Hub. We are 
                committed to maintaining the highest standards of data protection and transparency 
                in our practices.
              </p>
            </div>
          </div>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <Card key={section.id} className="p-6" id={section.id}>
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              
              <div className="ml-14 space-y-3">
                {section.content.map((paragraph, index) => {
                  if (paragraph === '') {
                    return <div key={index} className="h-2" />;
                  }
                  
                  return (
                    <p 
                      key={index} 
                      className={`text-gray-600 dark:text-gray-400 ${
                        paragraph.startsWith('•') ? 'ml-4' : 
                        paragraph.endsWith(':') ? 'font-medium text-gray-700 dark:text-gray-300' : ''
                      }`}
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12">
          <Card className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Questions About Your Privacy?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We're here to help you understand how we protect your information and exercise your privacy rights.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Email Us</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">privacy@pentvars.edu.gh</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Call Us</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">+233 (0) 302 123 456</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Visit Us</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pentecost University College</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:privacy@pentvars.edu.gh">
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Privacy Team
                </Button>
              </a>
              <Link to="/terms">
                <Button variant="outline">
                  View Terms of Service
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8">
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">
              Quick Navigation
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {sections.slice(0, 8).map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(section.id)?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                >
                  {section.title.split('.')[1]?.trim() || section.title}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
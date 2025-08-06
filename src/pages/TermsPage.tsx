import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Shield, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';

const TermsPage: React.FC = () => {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: CheckCircle,
      content: [
        "By accessing and using the Pentecost University Digital Legal Resource Hub (the 'Platform'), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ('Terms').",
        "These Terms constitute a legally binding agreement between you and Pentecost University College ('University', 'we', 'us', or 'our').",
        "If you do not agree to these Terms, you must not access or use the Platform."
      ]
    },
    {
      id: "eligibility",
      title: "2. Eligibility and Account Registration",
      icon: Users,
      content: [
        "The Platform is primarily intended for current students, faculty, staff, and authorized personnel of Pentecost University College.",
        "You must be at least 18 years old or have reached the age of majority in your jurisdiction to use this Platform.",
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        "You must provide accurate, current, and complete information during registration and keep your account information updated.",
        "The University reserves the right to suspend or terminate accounts that violate these Terms or are inactive for extended periods."
      ]
    },
    {
      id: "acceptable-use",
      title: "3. Acceptable Use Policy",
      icon: Shield,
      content: [
        "You may use the Platform solely for legitimate educational, research, and academic purposes related to legal studies.",
        "You agree not to use the Platform to:",
        "• Upload, share, or distribute copyrighted materials without proper authorization",
        "• Engage in any form of academic dishonesty, including plagiarism or unauthorized collaboration",
        "• Attempt to gain unauthorized access to other users' accounts or University systems",
        "• Upload malicious software, viruses, or any harmful code",
        "• Use the Platform for commercial purposes without explicit written permission",
        "• Harass, threaten, or intimidate other users",
        "• Share login credentials with unauthorized individuals",
        "• Violate any applicable laws, regulations, or University policies"
      ]
    },
    {
      id: "content-ownership",
      title: "4. Intellectual Property and Content Ownership",
      icon: FileText,
      content: [
        "The Platform and its original content, features, and functionality are owned by Pentecost University College and are protected by international copyright, trademark, and other intellectual property laws.",
        "User-generated content remains the property of the respective users, but by uploading content, you grant the University a non-exclusive, royalty-free license to use, display, and distribute such content within the Platform for educational purposes.",
        "Legal documents, cases, statutes, and other materials available on the Platform may be subject to third-party copyrights. Users are responsible for ensuring their use complies with applicable copyright laws.",
        "You may not reproduce, distribute, modify, or create derivative works of Platform content without explicit written permission from the University."
      ]
    },
    {
      id: "privacy-data",
      title: "5. Privacy and Data Protection",
      icon: Shield,
      content: [
        "Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.",
        "We implement appropriate security measures to protect your personal information, but cannot guarantee absolute security of data transmitted over the internet.",
        "You consent to the collection, processing, and storage of your data as described in our Privacy Policy.",
        "We may use aggregated, anonymized data for research and improvement purposes."
      ]
    },
    {
      id: "academic-integrity",
      title: "6. Academic Integrity",
      icon: Scale,
      content: [
        "Users must adhere to the highest standards of academic integrity when using the Platform.",
        "Proper citation and attribution must be provided when referencing materials accessed through the Platform.",
        "Collaboration and sharing of materials must comply with course-specific guidelines and University academic policies.",
        "Any suspected violations of academic integrity will be reported to appropriate University authorities.",
        "The Platform includes features to help maintain academic integrity, including usage tracking and access logs."
      ]
    },
    {
      id: "disclaimers",
      title: "7. Disclaimers and Limitations",
      icon: AlertCircle,
      content: [
        "The Platform is provided 'as is' without warranties of any kind, either express or implied.",
        "While we strive to provide accurate and up-to-date legal information, we make no guarantees about the completeness, accuracy, or currency of the content.",
        "The Platform is for educational purposes only and does not constitute legal advice.",
        "Users should verify the accuracy and current status of legal materials before relying on them for any purpose.",
        "The University is not liable for any decisions made based on information accessed through the Platform."
      ]
    },
    {
      id: "service-availability",
      title: "8. Service Availability and Modifications",
      icon: FileText,
      content: [
        "We strive to maintain continuous availability of the Platform but cannot guarantee uninterrupted service.",
        "The University reserves the right to modify, suspend, or discontinue any aspect of the Platform at any time.",
        "We may perform scheduled maintenance that temporarily affects Platform availability.",
        "Users will be notified of significant changes or extended maintenance periods when possible.",
        "No compensation will be provided for service interruptions or modifications."
      ]
    },
    {
      id: "termination",
      title: "9. Account Termination",
      icon: Users,
      content: [
        "You may terminate your account at any time by contacting University IT support.",
        "The University may suspend or terminate your access immediately for violations of these Terms or University policies.",
        "Upon termination, your right to access the Platform ceases immediately.",
        "Certain provisions of these Terms will survive termination, including intellectual property rights and limitation of liability clauses.",
        "Data retention after termination will be handled according to University policies and applicable laws."
      ]
    },
    {
      id: "governing-law",
      title: "10. Governing Law and Dispute Resolution",
      icon: Scale,
      content: [
        "These Terms are governed by the laws of Ghana and the policies of Pentecost University College.",
        "Any disputes arising from these Terms or use of the Platform will be subject to the exclusive jurisdiction of Ghanaian courts.",
        "Users agree to attempt resolution of disputes through University administrative processes before pursuing legal action.",
        "If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect."
      ]
    },
    {
      id: "contact",
      title: "11. Contact Information",
      icon: FileText,
      content: [
        "For questions about these Terms or the Platform, please contact:",
        "• Email: pentvarslawofficial@gmail.com",
        "• Phone: +233 264 790 221",
        "• Address: Pentecost University College, Accra, Ghana",
        "• IT Support: pentvarslawofficial@gmail.com",
        "For legal or policy-related inquiries, contact the Office of the Dean of the Faculty of Law."
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
                <Scale className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Terms of Service
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
                Important Notice
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Please read these Terms of Service carefully before using the Pentecost University 
                Digital Legal Resource Hub. By accessing or using our platform, you agree to be 
                bound by these terms and our Privacy Policy. If you have any questions about these 
                terms, please contact us before using the platform.
              </p>
            </div>
          </div>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <Card key={section.id} className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              
              <div className="ml-14 space-y-3">
                {section.content.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className={`text-gray-600 dark:text-gray-400 ${
                      paragraph.startsWith('•') ? 'ml-4' : ''
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Questions About These Terms?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              If you have any questions about these Terms of Service or need clarification 
              on any provisions, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:law@pentvars.edu.gh">
                <Button variant="outline">
                  Contact Legal Department
                </Button>
              </a>
              <Link to="/privacy">
                <Button variant="ghost">
                  View Privacy Policy
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
              {sections.slice(0, 6).map((section) => (
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

export default TermsPage;
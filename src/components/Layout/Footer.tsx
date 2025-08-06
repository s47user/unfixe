import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/courses', label: 'Courses' },
    { to: '/timeline', label: 'Timeline' },
    { to: '/resources', label: 'Resources' },
  ];

  const legalLinks = [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/accessibility', label: 'Accessibility' },
    { to: '/support', label: 'Support' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://web.facebook.com/pentvars/',
      icon: Facebook
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/pentvars_faculty_law?igsh=MWVwdnRneGU5ZjV2OQ%3D%3D&utm_source=qr',
      icon: Twitter // Using Twitter icon as placeholder for Instagram since Lucide doesn't have Instagram
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Pentecost Law</span>
                <p className="text-sm text-gray-300 -mt-1">Digital Resource Hub</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering legal education through comprehensive digital resources 
              and cutting-edge technology for the next generation of legal professionals.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Legal & Support</h3>
            <ul className="space-y-3">
              {legalLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm text-gray-300">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Pentecost University College</p>
                  <p>P. O. Box KN 1739</p>
                  <p>Kaneshie, Accra, Ghana</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div>
                  <a href="tel:+233246845054" className="hover:text-primary-400 transition-colors block">
                    +233 246 845 054
                  </a>
                  <a href="tel:+233264790221" className="hover:text-primary-400 transition-colors block">
                    +233 264 790 221
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a 
                  href="mailto:pentvarslawofficial@gmail.com" 
                  className="hover:text-primary-400 transition-colors"
                >
                  pentvarslawofficial@gmail.com
                </a>
              </div>

              <div className="pt-4">
                <a
                  href="https://pentvars.edu.gh/academic-calender/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary-400 hover:text-primary-300 transition-colors group"
                >
                  <span>Academic Calendar</span>
                  <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} Law Students Union, Pentecost University. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Powered by modern web technologies</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
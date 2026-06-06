import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lock, FileText } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const PolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: Shield,
      content: 'By accessing or using this website, you agree to be bound by these Website Policies and Terms of Use. If you do not agree with any part of these policies, please do not use our website.'
    },
    {
      id: 'use',
      title: '2. Use of the Website',
      icon: FileText,
      content: 'You agree to use our website lawfully and responsibly. You must not engage in any activity that interferes with or disrupts site functionality, or upload or transmit harmful, offensive, or illegal content. We reserve the right to block access or remove content that violates our policies.'
    },
    {
      id: 'ip',
      title: '3. Intellectual Property',
      icon: Lock,
      content: 'All website content including text, graphics, logos, videos, digital materials, and software is owned by SEF Multimedia Global or its licensors and is protected by applicable copyright, trademark, and intellectual property laws. You may view and download content for personal, non-commercial use only. Any other use without written permission is prohibited.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-24">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-20 unveil">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full mb-6">
              <Shield size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Our Policies</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 league-spartan">
              Website Policies <span className="text-indigo-600">&</span> Terms
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transparency and trust are at the core of SEF Multimedia Global. Learn about our policies, terms, and how we protect your privacy.
            </p>
            <p className="text-sm text-slate-500 mt-4">Last Updated: May 7, 2026</p>
          </div>

          {/* Introduction Section */}
          <div className="max-w-4xl mx-auto mb-20 p-8 bg-linear-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 unveil">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to SEF Multimedia Global</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              "We," "us," "our" — SEF Multimedia Global ("we," "us," "our"). Your privacy, security, and trust are important to us. This page outlines the terms, conditions, and policies that govern your use of our website and digital services.
            </p>
          </div>

          {/* Main Sections */}
          <div className="max-w-4xl mx-auto space-y-12 mb-20">
            {/* Section 1: Acceptance of Terms */}
            <section className="unveil">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                  <Shield className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h3>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed ml-16">
                By accessing or using this website, you agree to be bound by these Website Policies and Terms of Use. If you do not agree with any part of these policies, please do not use our website.
              </p>
            </section>

            {/* Section 2: Use of the Website */}
            <section className="unveil">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">2. Use of the Website</h3>
                </div>
              </div>
              <div className="ml-16 space-y-3 text-slate-700">
                <p>You agree:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>To use our website lawfully and responsibly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>Not to engage in any activity that interferes with or disrupts site functionality.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>Not to upload or transmit harmful, offensive, or illegal content.</span>
                  </li>
                </ul>
                <p>We reserve the right to block access or remove content that violates our policies.</p>
              </div>
            </section>

            {/* Section 3: Intellectual Property */}
            <section className="unveil">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <Lock className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">3. Intellectual Property</h3>
                </div>
              </div>
              <div className="ml-16 space-y-3 text-slate-700">
                <p>
                  All website content including text, graphics, logos, videos, digital materials, and software is owned by SEF Multimedia Global or its licensors and is protected by applicable copyright, trademark, and intellectual property laws.
                </p>
                <p>
                  You may view and download content for personal, non-commercial use only. Any other use (reproduction, distribution, modification, or republication) without written permission is prohibited.
                </p>
              </div>
            </section>

            {/* Section 4: User-Generated Content */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">4. User-Generated Content</h3>
              <div className="space-y-3 text-slate-700">
                <p>If you submit content (such as comments, files, feedback, or multimedia):</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>You grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display it.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>Your content must not infringe on any third-party rights or violate any laws.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>We may remove any content at our discretion.</span>
                  </li>
                </ul>
                <p className="font-semibold text-slate-900">You are solely responsible for what you upload.</p>
              </div>
            </section>

            {/* Section 5: Privacy Policy */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">5. Privacy Policy</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  We collect personal information only as described in our Privacy Policy. This includes how we collect, use, store, and protect your data.
                </p>
                <p className="font-semibold text-slate-900">
                  By using our website, you consent to such data practices.
                </p>
              </div>
            </section>

            {/* Section 6: Cookies & Tracking */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies & Tracking Technologies</h3>
              <div className="space-y-3 text-slate-700">
                <p>We use cookies and similar technologies to:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>Improve website performance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>Personalize user experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>Analyze traffic</span>
                  </li>
                </ul>
                <p>You can manage cookie preferences through your browser settings.</p>
              </div>
            </section>

            {/* Section 7: Third-Party Links */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">7. Third-Party Links & Services</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  Our website may contain links to third-party sites or services.
                </p>
                <p>We do not control:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>Their content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>Their privacy practices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>Their terms</span>
                  </li>
                </ul>
                <p>Visiting or interacting with external sites is at your own risk.</p>
              </div>
            </section>

            {/* Section 8: Limitation of Liability */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h3>
              <div className="space-y-3 text-slate-700">
                <p>To the maximum extent permitted by law:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>SEF Multimedia Global is not liable for any losses or damages arising from your use of this site.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>We make no warranty that the website will be error-free, secure, or uninterrupted.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 9: Indemnification */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">9. Indemnification</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  You agree to defend, indemnify, and hold harmless SEF Multimedia Global and its affiliates from any claims, damages, losses, or expenses arising from your website use or violation of these policies.
                </p>
              </div>
            </section>

            {/* Section 10: Amendments */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">10. Amendments</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  We may update this policy at any time without notice. Changes take effect once published on this page.
                </p>
                <p className="font-semibold text-slate-900">
                  Your continued use of the website after updates constitutes acceptance of the revised policies.
                </p>
              </div>
            </section>

            {/* Section 11: Contact Us */}
            <section className="unveil bg-linear-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl border border-indigo-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">11. Contact Us</h3>
              <p className="text-slate-700 mb-6">
                If you have questions, concerns, or requests related to these policies, you can contact us:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <a href="mailto:support@sefmultimediaglobal.com" className="font-semibold text-indigo-600 hover:text-indigo-700">
                      support@sefmultimediaglobal.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <p className="text-sm text-slate-500">Website</p>
                    <a href="https://www.sefmultimediaglobal.com" className="font-semibold text-indigo-600 hover:text-indigo-700">
                      www.sefmultimediaglobal.com
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-20 p-12 bg-linear-to-r from-indigo-600 to-blue-600 rounded-3xl text-white text-center unveil">
            <h2 className="text-3xl font-black mb-4 league-spartan">Questions About Our Policies?</h2>
            <p className="mb-8 text-indigo-100 leading-relaxed">
              We're here to help. Reach out to our team if you have any concerns or need clarification on our policies.
            </p>
            <a 
              href="https://wa.me/+23275510770"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all hover:-translate-y-1"
            >
              Contact Us via WhatsApp
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolicyPage;

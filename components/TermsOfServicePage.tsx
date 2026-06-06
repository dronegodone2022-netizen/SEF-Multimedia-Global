import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, AlertCircle, Gavel } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const TermsOfServicePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-24">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-20 unveil">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-600 px-4 py-2 rounded-full mb-6">
              <Gavel size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Legal</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 league-spartan">
              Terms of <span className="text-amber-600">Service</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Please read these Terms carefully before using our Services. By accessing or using SEF Multimedia Global, you agree to be bound by these Terms.
            </p>
            <p className="text-sm text-slate-500 mt-4">Last Updated: May 7, 2026</p>
          </div>

          {/* Introduction Section */}
          <div className="max-w-4xl mx-auto mb-20 p-8 bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-100 unveil">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to SEF Multimedia Global</h2>
            <p className="text-slate-700 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of our website, digital products, services, and related content ("Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use the Services.
            </p>
          </div>

          {/* Main Sections */}
          <div className="max-w-4xl mx-auto space-y-12 mb-20">
            {/* Section 1 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h3>
              <div className="space-y-3 text-slate-700">
                <p>By using the SEF Multimedia Global website and related Services, you agree to:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Comply with all Terms, policies, and applicable laws.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Provide accurate and truthful information if required.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Use the Services responsibly and lawfully.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Eligibility</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  You must be at least 18 years old or have the legal guardian's consent to use our Services. By using the Services, you affirm that you have the legal right and capacity to enter into these Terms.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Services Overview</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  SEF Multimedia Global provides multimedia, digital content, creative services, training, consulting, and related digital products.
                </p>
                <p>
                  Specific terms, pricing, and service descriptions may appear in separate agreements, but remain subject to these Terms.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">4. Account Registration</h3>
              <div className="space-y-3 text-slate-700">
                <p>If you register an account or profile:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>You agree to provide accurate, up-to-date information.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>You must maintain the confidentiality of your login details.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>You are responsible for any activity under your account.</span>
                  </li>
                </ul>
                <p className="font-semibold text-slate-900 mt-4">
                  We reserve the right to suspend or terminate accounts for misconduct or violation of these Terms.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="unveil">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">5. User Responsibilities</h3>
              </div>
              <div className="ml-16 space-y-3 text-slate-700">
                <p>You agree not to:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Use the Services illegally or harmfully.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Upload malware, harmful code, or offensive content.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Attempt unauthorized access or disrupt servers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Impersonate others or misrepresent identity.</span>
                  </li>
                </ul>
                <p className="font-semibold text-slate-900 mt-4">
                  Any violation may result in account suspension, termination, or legal action.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property Rights</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  All content, trademarks, logos, designs, multimedia, and software available on the Services are owned by SEF Multimedia Global or licensed to us.
                </p>
                <p>You may not:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Reproduce, distribute, modify, or republish content without written permission.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Use our intellectual property in a way that harms our business.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">7. Third-Party Content & Links</h3>
              <div className="space-y-3 text-slate-700">
                <p>Our Services may include links to third-party websites or content.</p>
                <p>We are not responsible for:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Accuracy, security, or legality of external content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Third-party policies or practices</span>
                  </li>
                </ul>
                <p>Your interaction with third parties is solely between you and them.</p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">8. Payment Terms</h3>
              <div className="space-y-3 text-slate-700">
                <p>For paid services:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Fees must be paid in full before delivery or access.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Prices are subject to change with notice.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Refunds are governed by our Refund Policy (linked separately).</span>
                  </li>
                </ul>
                <p className="font-semibold text-slate-900 mt-4">
                  Failure to pay may lead to service suspension or cancellation.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">9. Disclaimer of Warranties</h3>
              <div className="space-y-3 text-slate-700">
                <p>To the maximum extent allowed by law, our Services are provided "as is" and "as available" without warranties of any kind.</p>
                <p>We do not guarantee:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Uninterrupted or error-free access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Accuracy or completeness of content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Suitability for a particular purpose</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">10. Limitation of Liability</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  SEF Multimedia Global, its affiliates, partners, or agents will not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Services.
                </p>
                <p>
                  Our total liability for claims shall not exceed the amount you paid for Services (if any).
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">11. Indemnification</h3>
              <div className="space-y-3 text-slate-700">
                <p>You agree to defend, indemnify, and hold harmless SEF Multimedia Global and its representatives from any claim, liability, loss, or expense arising from:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Your use of the Services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Violation of these Terms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>Infringement of third-party rights</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 12 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">12. Termination</h3>
              <div className="space-y-3 text-slate-700">
                <p>We may suspend or terminate your access:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>At our discretion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>For violation of these Terms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold mt-1">•</span>
                    <span>If required by law or security risk</span>
                  </li>
                </ul>
                <p className="font-semibold text-slate-900 mt-4">
                  Termination does not release you from outstanding obligations.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">13. Modifications to Terms</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  We may change these Terms at any time. Updated Terms become effective when posted on the website.
                </p>
                <p className="font-semibold text-slate-900">
                  Your continued use of the Services after changes means you accept the revised Terms.
                </p>
              </div>
            </section>

            {/* Section 14 */}
            <section className="unveil">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">14. Governing Law</h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  These Terms are governed by the laws of Sierra Leone, without regard to conflict of laws principles.
                </p>
              </div>
            </section>

            {/* Section 15: Contact */}
            <section className="unveil bg-linear-to-br from-amber-50 to-orange-50 p-8 rounded-3xl border border-amber-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">15. Contact Information</h3>
              <p className="text-slate-700 mb-6">
                If you have questions about these Terms:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <a href="mailto:support@sefmultimediaglobal.com" className="font-semibold text-amber-600 hover:text-amber-700">
                      support@sefmultimediaglobal.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <p className="text-sm text-slate-500">Website</p>
                    <a href="https://www.sefmultimediaglobal.com" className="font-semibold text-amber-600 hover:text-amber-700">
                      www.sefmultimediaglobal.com
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-20 p-12 bg-linear-to-r from-amber-600 to-orange-600 rounded-3xl text-white text-center unveil">
            <h2 className="text-3xl font-black mb-4 league-spartan">Agree with Our Terms?</h2>
            <p className="mb-8 text-amber-100 leading-relaxed">
              If you have any questions or concerns about these Terms of Service, please don't hesitate to reach out to us.
            </p>
            <a 
              href="https://wa.me/+23275510770"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-amber-600 px-10 py-4 rounded-xl font-bold hover:bg-amber-50 transition-all hover:-translate-y-1"
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

export default TermsOfServicePage;

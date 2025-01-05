import React from 'react';

export default function Privacy() {
  return (
    <main className="flex-grow bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-lg mb-6">Last updated: March 2024</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              Everybody Polls ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and share information about you 
              when you use our mobile application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">We collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Account information (email address)</li>
              <li>Poll responses</li>
              <li>Usage data and analytics</li>
              <li>Device information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and improve our services</li>
              <li>Generate anonymous polling statistics</li>
              <li>Send you weekly poll notifications</li>
              <li>Maintain the security of our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal information. Poll results are always displayed 
              in aggregate form and cannot be traced back to individual users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of notifications</li>
              <li>Update your account information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              privacy@everybodypolls.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service - Compliance Management System</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Service Description</h2>
        <p className="mb-4">
          Our Compliance Management System ("Service") is a software-as-a-service platform designed to assist organizations 
          in managing their compliance with various regulatory frameworks, including but not limited to GDPR, HIPAA, and SOC2.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Disclaimer of Warranties</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="font-semibold mb-2">IMPORTANT NOTICE:</p>
          <p>
            This Service is provided "as is" and "as available" without any warranties of any kind. We do not guarantee 
            that the use of our Service will ensure compliance with any regulatory requirements. The Service is designed 
            to assist in compliance management but does not replace the need for qualified legal and compliance professionals.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Maintain accurate and up-to-date information in the system</li>
          <li>Regularly review and verify compliance status</li>
          <li>Engage qualified legal professionals for compliance advice</li>
          <li>Maintain appropriate security measures</li>
          <li>Report any discrepancies or issues promptly</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
        <p className="mb-4">
          Under no circumstances shall we be liable for any direct, indirect, special, incidental, consequential, 
          or punitive damages arising from or related to the use of our Service, including but not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Regulatory fines or penalties</li>
          <li>Loss of data or business interruption</li>
          <li>Damages resulting from compliance failures</li>
          <li>Costs associated with legal proceedings</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Data Processing and Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to ensure the security of your data. 
          However, you remain responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>Ensuring appropriate access controls within your organization</li>
          <li>Properly configuring and using the Service's security features</li>
          <li>Compliance with applicable data protection laws</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Updates and Modifications</h2>
        <p>
          We reserve the right to update these Terms of Service and the Service itself to reflect changes in:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Regulatory requirements</li>
          <li>Industry best practices</li>
          <li>Technical capabilities</li>
          <li>Service features and functionality</li>
        </ul>
      </section>

      <div className="bg-blue-50 p-4 rounded-lg mt-8">
        <p className="font-semibold mb-2">Legal Notice:</p>
        <p>
          By using this Service, you acknowledge that you have read, understood, and agree to these Terms of Service. 
          You also acknowledge that this Service does not constitute legal advice and that you should consult with 
          qualified legal professionals for specific compliance guidance.
        </p>
      </div>
    </div>
  );
}

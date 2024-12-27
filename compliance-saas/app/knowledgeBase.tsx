'use client';

import React, { useState } from 'react';

const knowledgeBaseData = [
  {
    title: 'GDPR Data Retention',
    framework: 'GDPR',
    content: 'GDPR requires that personal data be kept no longer than necessary for the purposes for which it is processed.',
    video: 'gdpr_data_retention.mp4',
    infographic: 'gdpr_data_retention.png',
  },
  {
    title: 'HIPAA Privacy Rule',
    framework: 'HIPAA',
    content: 'The HIPAA Privacy Rule provides federal protections for personal health information held by covered entities.',
    video: 'hipaa_privacy_rule.mp4',
    infographic: 'hipaa_privacy_rule.png',
  },
];

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('All');

  const filteredData = knowledgeBaseData.filter(item =>
    (selectedFramework === 'All' || item.framework === selectedFramework) &&
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Compliance Knowledge Base</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search for topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 flex-grow"
        />
        <select
          value={selectedFramework}
          onChange={(e) => setSelectedFramework(e.target.value)}
          className="border p-2 ml-2"
        >
          <option value="All">All Frameworks</option>
          <option value="GDPR">GDPR</option>
          <option value="HIPAA">HIPAA</option>
        </select>
      </div>
      <ul className="space-y-4">
        {filteredData.map((item, index) => (
          <li key={index} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mb-4">
              {item.framework}
            </span>
            <p className="text-gray-600 mb-4">{item.content}</p>
            <div className="flex space-x-4">
              {item.video && (
                <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
                  Watch Video
                </button>
              )}
              {item.infographic && (
                <button className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark">
                  View Infographic
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KnowledgeBase;

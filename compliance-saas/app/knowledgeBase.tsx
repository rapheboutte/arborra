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
          <li key={index} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p>{item.content}</p>
            <div className="flex space-x-4 mt-2">
              <video src={item.video} controls className="w-1/3" />
              <img src={item.infographic} alt={item.title} className="w-1/3" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KnowledgeBase;

import React from 'react';
import KnowledgeBase from '../knowledgeBase';

const KnowledgeBasePage = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Compliance Knowledge Base</h1>
      <KnowledgeBase />
    </div>
  );
};

export default KnowledgeBasePage;

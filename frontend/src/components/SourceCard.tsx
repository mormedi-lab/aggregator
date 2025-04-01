import React from 'react';
import { getDomainFromUrl } from '../utils/getDomainFromUrl';

type SourceCardProps = {
  url: string;
  title?: string;
};

const SourceCard: React.FC<SourceCardProps> = ({ url, title }) => {
  const domain = getDomainFromUrl(url);

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      <div className="text-sm text-gray-500 mb-1">{domain}</div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-black font-semibold hover:underline mb-1"
      >
        {title || 'Untitled'}
      </a>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-sm hover:underline break-all"
      >
        {url}
      </a>
    </div>
  );
};

export default SourceCard;

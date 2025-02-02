import React from "react";
import DOMPurify from "dompurify";

interface NewsDetailProps {
  content: string;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
};

export default NewsDetail;

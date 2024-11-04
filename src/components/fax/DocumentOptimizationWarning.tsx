import React from 'react';
import { AlertTriangle, ExternalLink, Eye } from 'lucide-react';

interface DocumentOptimizationWarningProps {
  fileName: string;
  issues: {
    hasColorContent: boolean;
    hasBackgroundElements: boolean;
    hasLargeImages: boolean;
    pageCount: number;
  };
  onPreview: () => void;
}

export default function DocumentOptimizationWarning({ 
  fileName, 
  issues, 
  onPreview 
}: DocumentOptimizationWarningProps) {
  const hasIssues = issues.hasColorContent || issues.hasBackgroundElements || issues.hasLargeImages;

  if (!hasIssues) return null;

  return (
    <div className="ml-12 mr-4 mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-yellow-800">
            Document may not be optimized for fax transmission
          </h4>
          <div className="mt-1 text-sm text-yellow-700 space-y-1">
            {issues.hasColorContent && (
              <p>• Contains color content that will be converted to grayscale</p>
            )}
            {issues.hasBackgroundElements && (
              <p>• Has background elements that may affect readability</p>
            )}
            {issues.hasLargeImages && (
              <p>• Contains high-resolution images that will be downsampled</p>
            )}
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={onPreview}
              className="inline-flex items-center text-sm text-yellow-800 hover:text-yellow-900"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview document
            </button>
            <a
              href="https://openfax.com/faxdoc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-yellow-800 hover:text-yellow-900"
            >
              View optimization tips
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
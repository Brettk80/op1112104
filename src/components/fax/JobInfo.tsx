import React from 'react';
import JobInfoForm from './JobInfoForm';

interface JobInfoProps {
  recipientCount: number;
  blockedCount: number;
  onEditBlockList?: () => void;
  uploadedBlockLists?: {
    fileName: string;
    numberCount: number;
  }[];
}

const JobInfo: React.FC<JobInfoProps> = ({ 
  recipientCount, 
  blockedCount,
  onEditBlockList,
  uploadedBlockLists = []
}) => {
  const handleSubmit = (data: any) => {
    console.log('Job info submitted:', data);
  };

  // Mock data for demonstration
  const hasToHeaderMappings = true;
  const mappedContactCount = Math.floor(recipientCount * 0.8); // 80% have mapped headers
  const unmappedContactCount = recipientCount - mappedContactCount;

  const accountBlockLists = {
    tollFreeNumber: '1-800-555-0123',
    tollFreeBlockCount: 1250,
    storedBlockListCount: 551
  };

  return (
    <JobInfoForm
      onSubmit={handleSubmit}
      defaultFromHeader="OPENFAX"
      hasToHeaderMappings={hasToHeaderMappings}
      mappedContactCount={mappedContactCount}
      unmappedContactCount={unmappedContactCount}
      accountBlockLists={accountBlockLists}
      uploadedBlockLists={uploadedBlockLists}
      onEditBlockList={onEditBlockList}
    />
  );
};

export default JobInfo;
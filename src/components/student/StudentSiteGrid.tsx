import React from 'react';
import { Site } from '../../types/site';
import { StudentSiteCard } from './StudentSiteCard';

interface StudentSiteGridProps {
  sites: Site[];
  onLockedClick: (siteName: string) => void;
}

export const StudentSiteGrid: React.FC<StudentSiteGridProps> = ({
  sites,
  onLockedClick,
}) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5">
      {sites.map((site) => (
        <StudentSiteCard
          key={site.id}
          site={site}
          onLockedClick={onLockedClick}
        />
      ))}
    </div>
  );
};

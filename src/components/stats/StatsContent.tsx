
import React, { useState } from 'react';
import { useStatsContext } from '@/contexts/StatsContext';
import { UserInfoCard } from '@/components/stats/UserInfoCard';
import { FormDataCard } from '@/components/stats/FormDataCard';
import { AllStatsCard } from '@/components/stats/AllStatsCard';
import { WorldMap } from '@/components/stats/WorldMap';
import { TopReferrers } from '@/components/stats/TopReferrers';
import { RequestDurations } from '@/components/stats/RequestDurations';
import { TopBrowsers } from '@/components/stats/TopBrowsers';
import { TopDevices } from '@/components/stats/TopDevices';
import { LoadingState } from '@/components/stats/LoadingState';
import { ErrorState } from '@/components/stats/ErrorState';
import { UserStats } from '@/types/stats';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";

export const StatsContent = () => {
  const { userStats, allStats, isLoading, error } = useStatsContext();
  const [selectedUser, setSelectedUser] = useState<UserStats | null>(userStats);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Handle user row click
  const handleUserSelect = (user: UserStats) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <AllStatsCard allStats={allStats} onUserSelect={handleUserSelect} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <WorldMap allStats={allStats} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <TopReferrers allStats={allStats} />
        <RequestDurations />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopBrowsers allStats={allStats} />
        <TopDevices allStats={allStats} />
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <UserInfoCard userStats={selectedUser} />
            <FormDataCard userStats={selectedUser} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

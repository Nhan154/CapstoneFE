import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RatingForm } from './RatingForm';
import { RatingList } from './RatingList';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn } from 'lucide-react';

interface RoomRatingProps {
  roomId: number;
  className?: string;
}

export const RoomRating: React.FC<RoomRatingProps> = ({
  roomId,
  className
}) => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRatingSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className={className}>
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Xem đánh giá</TabsTrigger>
          <TabsTrigger value="write" disabled={!user}>
            Viết đánh giá
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-6">
          <RatingList 
            roomId={roomId} 
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>

        <TabsContent value="write" className="mt-6">
          {user ? (
            <RatingForm 
              roomId={roomId}
              onRatingSubmitted={handleRatingSubmitted}
            />
          ) : (
            <Alert>
              <LogIn className="h-4 w-4" />
              <AlertDescription>
                Bạn cần đăng nhập để có thể viết đánh giá
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
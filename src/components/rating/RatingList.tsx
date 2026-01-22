import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StarRating } from './StarRating';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getRatingsByRoomId } from '@/services/api';
import { RatingWithUser } from '@/types';

interface RatingListProps {
  roomId: number;
  refreshTrigger?: number;
  className?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const MAX_COMMENT_LENGTH = 200;
const INITIAL_DISPLAY_COUNT = 3;

export const RatingList: React.FC<RatingListProps> = ({
  roomId,
  refreshTrigger,
  className
}) => {
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [showAllComments, setShowAllComments] = useState(false);

  const fetchRatings = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await getRatingsByRoomId(roomId);
      setRatings(response.content || []);
    } catch (error: unknown) {
      console.error('Error fetching ratings:', error);
      const apiError = error as ApiError;
      setError(apiError.response?.data?.message || 'Không thể tải đánh giá');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [roomId, refreshTrigger]);

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.saoBinhLuan, 0) / ratings.length 
    : 0;

  const toggleExpand = (ratingId: number) => {
    setExpandedComments (prev => {
      const newSet = new Set(prev);
      if (newSet.has(ratingId)) {
        newSet.delete (ratingId);
      } else {
        newSet.add(ratingId);
      } 
      return newSet;
    });
  };

  const toggleShowAllComments = () => {
    setShowAllComments(prev => !prev);
  };

  const isCommentLong = (comment: string) => {
    return comment.length > MAX_COMMENT_LENGTH;
  };

  const getTruncatedComment = (comment: string) => {
    if (comment.length <= MAX_COMMENT_LENGTH) {
      return comment;
    }
    return comment.substring(0, MAX_COMMENT_LENGTH) + '...';
  };

  // Xác định số lượng comment cần hiển thị
  const displayedRatings = showAllComments 
    ? ratings 
    : ratings.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreComments = ratings.length > INITIAL_DISPLAY_COUNT;

  // Simple date formatting without date-fns to avoid invalid date errors
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Không xác định';
      
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Không xác định';
      }
      
      // Simple relative time calculation
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      
      if (diffInDays > 0) {
        return `${diffInDays} ngày trước`;
      } else if (diffInHours > 0) {
        return `${diffInHours} giờ trước`;
      } else if (diffInMinutes > 0) {
        return `${diffInMinutes} phút trước`;
      } else {
        return 'Vừa xong';
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Không xác định';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Đang tải đánh giá...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      {ratings.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <StarRating rating={averageRating} size="lg" />
            <div>
              <div className="font-semibold text-lg">
                {averageRating.toFixed(1)} / 5
              </div>
              <div className="text-sm text-gray-600">
                {ratings.length} đánh giá
              </div>
            </div>
          </div>
        </div>
      )}

      {ratings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Chưa có đánh giá nào cho phòng này</p>
          <p className="text-sm">Hãy là người đầu tiên đánh giá!</p>
        </div>
      ) : (
        <>
        <div className="space-y-4">
          {displayedRatings.map((rating) => {
            const isExpanded = expandedComments.has(rating.id);
            const shouldShowToggle = isCommentLong(rating.noiDung);
           
          return(
            <Card key={rating.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage 
                      src={rating.avatar} 
                      alt={rating.tenNguoiBinhLuan}
                    />
                    <AvatarFallback>
                      {rating.tenNguoiBinhLuan.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">
                          {rating.tenNguoiBinhLuan}
                        </h4>
                        <div className="flex items-center gap-2">
                          <StarRating rating={rating.saoBinhLuan} size="sm" />
                          <span className="text-xs text-gray-500">
                            {formatDate(rating.ngayBinhLuan)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {isExpanded ? rating.noiDung : getTruncatedComment(rating.noiDung)}
                    </p>

                    {shouldShowToggle && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='mt-2 p-0 h-auto font-semibold text-blue-600 hover:text-blue-800 hover:bg-transparent'
                        onClick={() => toggleExpand(rating.id)}
                      >
                        {isExpanded ? (
                          <>
                            <span className='mr-1'>Thu gọn</span>
                            <ChevronUp className='w-4 h-4'/>
                          </>
                        ) : (
                          <>
                            <span className='mr-1'>Xem thêm</span>
                            <ChevronDown className='w-4 h-4'/>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          })}
    </div>

          {hasMoreComments && (
            <div className='mt-6 text-center'>
              <Button
                variant='outline'
                size='lg'
                className='w-full sm:w-auto min-w-[200px] font-semibold'
                onClick={toggleShowAllComments}
              >
                {showAllComments ? (
                  <>
                  <ChevronUp className='mr-2 h-5 w-5'/>
                  Thu gọn
                  </>
                ) : (
                  <>
                  <ChevronDown className='mr-2 h-5 w-5'/>
                  Hiện thêm {ratings.length - INITIAL_DISPLAY_COUNT} đánh giá
                  </>
                )}
              </Button>
            </div>
          )}
        </>
  )}
  </div>
  );
};
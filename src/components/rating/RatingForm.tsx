import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { createRating } from '@/services/api';
import { RatingCreate } from '@/types';

interface RatingFormProps {
  roomId: number;
  onRatingSubmitted: () => void;
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

export const RatingForm: React.FC<RatingFormProps> = ({
  roomId,
  onRatingSubmitted,
  className
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Nội dung đánh giá phải có ít nhất 10 ký tự');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const ratingData: RatingCreate = {
        maPhong: roomId,
        noiDung: comment.trim(),
        saoBinhLuan: rating
      };

      await createRating(ratingData);
      
      setSuccess(true);
      setRating(0);
      setComment('');
      
      setTimeout(() => {
        setSuccess(false);
        onRatingSubmitted();
      }, 2000);

    } catch (error: unknown) {
      console.error('Error submitting rating:', error);
      const apiError = error as ApiError;
      setError(apiError.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <AlertDescription className="text-green-800">
          Đánh giá của bạn đã được gửi thành công!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Đánh giá phòng</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Đánh giá sao *
            </label>
            <StarRating
              rating={rating}
              interactive
              onRatingChange={setRating}
              size="lg"
            />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Nội dung đánh giá *
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tối thiểu 10 ký tự ({comment.length}/10)
            </p>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              'Gửi đánh giá'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
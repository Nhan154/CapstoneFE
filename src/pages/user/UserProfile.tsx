import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { updateUserInfo, uploadAvatar } from '@/services/api';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Must be a valid email' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  birthday: z.string().min(1, { message: 'Birthday is required' }),
  gender: z.enum(['true', 'false']),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const UserProfile = () => {
  const { user, isLoading: authLoading } = useAuth();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthday: user?.birthday || '',
      gender: user?.gender ? 'true' : 'false',
    }
  });
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
        gender: user.gender ? 'true' : 'false',
      });
    }
  }, [user, form]);
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      setUpdateError(null);
      setUpdateSuccess(false);
      
      const userData = {
        ...values,
        gender: values.gender === 'true',
      };
      
      const response = await updateUserInfo(user.id, userData);
      
      if (response.statusCode === 200) {
        setUpdateSuccess(true);
        toast.success('Profile updated successfully');
      } else {
        setUpdateError(response.message || 'Failed to update profile');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to update profile. Please try again.';
      setUpdateError(errorMessage);
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadAvatar(file);
      
      if (response.statusCode === 200) {
        toast.success('Avatar uploaded successfully');
        // Refresh the page to see the new avatar
        window.location.reload();
      } else {
        toast.error(response.message || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  if (authLoading || !user) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const getUserInitials = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-3xl bg-primary/20">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="relative w-full">
                    <input
                      type="file"
                      id="avatar-upload"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                    <label htmlFor="avatar-upload">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={isUploading}
                        asChild
                      >
                        <span>
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Change Photo
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {updateSuccess && (
                    <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>
                        Your profile has been successfully updated.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {updateError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>{updateError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your name" 
                                disabled={isUpdating}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="you@example.com" 
                                type="email"
                                disabled={true} // Email should not be editable
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Phone number" 
                                type="tel"
                                disabled={isUpdating}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Birth Date</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="MM/DD/YYYY" 
                                type="date"
                                disabled={isUpdating}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <RadioGroup
                                className="flex space-x-4"
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={isUpdating}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="true" id="male" />
                                  <label htmlFor="male" className="text-sm cursor-pointer">Male</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="false" id="female" />
                                  <label htmlFor="female" className="text-sm cursor-pointer">Female</label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
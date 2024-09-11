import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useSelector } from 'react-redux';

const ProfileDetails = () => {
  const { user } = useSelector(state => state.auth);

  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='container mx-auto p-6'>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader className='pb-4'>
          <div className='flex items-center space-x-4'>
            <Avatar className='w-20 h-20'>
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.full_name}`}
                alt={user.full_name}
              />
              <AvatarFallback>
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className='text-2xl font-bold'>
                {user.full_name}
              </CardTitle>
              <p className='text-sm text-muted-foreground'>{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='grid gap-6'>
          <div className='flex flex-wrap gap-2'>
            <Badge>{user.role}</Badge>
            {user.is_staff && <Badge variant='outline'>Staff</Badge>}
            {user.is_superuser && <Badge variant='outline'>Superuser</Badge>}
            {user.is_active && <Badge variant='success'>Active</Badge>}
          </div>
          <div className='grid gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='text-sm font-medium'>First Name</Label>
                <p className='text-sm text-muted-foreground'>
                  {user.first_name}
                </p>
              </div>
              <div>
                <Label className='text-sm font-medium'>Last Name</Label>
                <p className='text-sm text-muted-foreground'>
                  {user.last_name}
                </p>
              </div>
            </div>
            <div>
              <Label className='text-sm font-medium'>Phone Number</Label>
              <p className='text-sm text-muted-foreground'>
                {user.phone_number || 'Not provided'}
              </p>
            </div>
            <div>
              <Label className='text-sm font-medium'>Account Status</Label>
              <div className='flex flex-wrap gap-2 mt-1'>
                <Badge
                  variant={user.is_otp_verified ? 'success' : 'destructive'}
                >
                  {user.is_otp_verified ? 'OTP Verified' : 'OTP Not Verified'}
                </Badge>
                <Badge variant={user.is_completed ? 'success' : 'destructive'}>
                  {user.is_completed
                    ? 'Profile Completed'
                    : 'Profile Incomplete'}
                </Badge>
                <Badge
                  variant={user.is_socialaccount ? 'secondary' : 'outline'}
                >
                  {user.is_socialaccount ? 'Social Account' : 'Regular Account'}
                </Badge>
              </div>
            </div>
            <div>
              <Label className='text-sm font-medium'>Date Joined</Label>
              <p className='text-sm text-muted-foreground'>
                {formatDate(user.date_joined)}
              </p>
            </div>
            <div>
              <Label className='text-sm font-medium'>Last Login</Label>
              <p className='text-sm text-muted-foreground'>
                {formatDate(user.last_login)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDetails;

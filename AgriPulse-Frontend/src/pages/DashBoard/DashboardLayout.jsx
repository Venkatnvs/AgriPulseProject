import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { useToast } from '@/components/ui/use-toast';
import { onMessageListener } from '@/lib/firebase-config';
import React, { useEffect } from 'react'

const DashboardLayout = ({
    children
}) => {
  const { toast } = useToast(); 

  useEffect(() => {
    console.log('Setting up onMessageListener');
    const unsubscribe = onMessageListener().then((payload) => {
      console.log('Notification received:', payload);
      toast({
        title: payload.notification.title,
        description: payload.notification.body,
        variant: 'default',
      });
    });
    return () => unsubscribe;
  }, []);
  
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
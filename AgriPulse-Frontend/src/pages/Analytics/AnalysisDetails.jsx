import { fetchDeviceApi } from '@/apis/devices';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import PageContainer from '@/components/layout/PageContainer';
import TextHeader from '@/components/PageHeaders/TextHeader';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailedAnalysisComponent from './components/DetailedAnalysisComponent';
import { useToast } from '@/components/ui/use-toast';

const AnalysisDetails = () => {
  const { id } = useParams();
  const [deviceData, setDeviceData] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchAnalysisData = async () => {
    try {
      const res = await fetchDeviceApi(id);
      console.log(res.data);
      if (!res.data?.is_configured) {
        toast({
          title: 'Device not configured',
          description: 'Please configure the device to view the analysis',
          variant: 'destructive',
        });
        navigate('/dashboard/analytics');
        return;
      }
      setDeviceData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Analysis', link: '/dashboard/analytics' },
    { title: deviceData?.name, link: `/dashboard/analytics/${id}` },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader
          title='Analysis'
          description='View the full analysis of the device'
        />
        <DetailedAnalysisComponent
          deviceData={deviceData}
          fetchAnalysisData={fetchAnalysisData}
          id={id}
        />
      </div>
    </PageContainer>
  );
};

export default AnalysisDetails;

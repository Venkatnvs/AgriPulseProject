import { fetchDeviceApi } from '@/apis/devices';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import PageContainer from '@/components/layout/PageContainer';
import TextHeader from '@/components/PageHeaders/TextHeader';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailedAnalysisComponent from './components/DetailedAnalysisComponent';

const AnalysisDetails = () => {
  const { id } = useParams();
  const [deviceData, setDeviceData] = useState([]);

  const fetchAnalysisData = async () => {
    try {
      const res = await fetchDeviceApi(id);
      console.log(res.data);
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
        <DetailedAnalysisComponent />
      </div>
    </PageContainer>
  );
};

export default AnalysisDetails;

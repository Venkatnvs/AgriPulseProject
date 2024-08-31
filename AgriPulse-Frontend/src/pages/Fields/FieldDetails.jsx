import { fetchFieldApi, fetchWeatherAndForecastApi } from '@/apis/fields';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import PageContainer from '@/components/layout/PageContainer';
import HeaderWithButton from '@/components/PageHeaders/HeaderWithButton';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import DisplayMapView from './components/DisplayMapView';
import { Loader } from 'lucide-react';
import MainFieldDetails from './components/FieldDetails/MainFieldDetails';
import WeatherDetails from './components/FieldDetails/WeatherDetails';
import { Separator } from '@/components/ui/separator';
import ForecastDetails from './components/FieldDetails/ForecastDetails';
import FieldDataDetails from './components/FieldDetails/FieldDataDetails';

const FieldDetailsMain = ({ data }) => {
  const mapViewRef = useRef(null);
  const weatherDetailsRef = useRef(null);
  const forecastDetailsRef = useRef(null);
  const fieldDataDetailsRef = useRef(null);

  const navButtonsList = [
    {
      name: 'Map View',
      onClick: () => {
        mapViewRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      },
      isActive: true,
    },
    {
      name: 'Weather',
      onClick: () => {
        weatherDetailsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      },
      isActive: false,
    },
    {
      name: '5 Day Forecast',
      onClick: () => {
        forecastDetailsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      },
      isActive: false,
    },
    {
      name: 'Field Details',
      onClick: () => {
        fieldDataDetailsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      },
      isActive: false,
    },
  ];
  const [navButtons, setNavButtons] = useState(navButtonsList);

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const fetchWeatherData = async () => {
    try{
      const res = await fetchWeatherAndForecastApi({ lat: data?.main_coordinate[1], lon: data?.main_coordinate[0] });
      setWeatherData(res.data?.weather);
      setForecastData(res.data?.forecast);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    if (data?.main_coordinate) {
      fetchWeatherData();
    }
  }, [data]);

  return (
    <>
      <HeaderWithButton
        title={data?.name}
        description={data?.description || 'No description'}
        buttonText='Link Device'
        onClick={() => {}}
      />
      <section className='flex flex-col gap-4 h-full'>
        <div className='grid flex-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='flex-col items-start gap-8 md:flex lg:sticky lg:top-0 self-start'>
              <MainFieldDetails
                navButtons={navButtons}
                setNavButtons={setNavButtons}
                mapViewRef={mapViewRef}
                weatherDetailsRef={weatherDetailsRef}
                forecastDetailsRef={forecastDetailsRef}
                fieldDataDetailsRef={fieldDataDetailsRef}
              />
          </div>
          <div className='relative flex-col items-start gap-6 md:flex col-span-2'>
            <div
              ref={mapViewRef}
              className={`min-h-[90vh] flex rounded-xl bg-secondary/50 p-4 w-full h-full flex-col ${
                navButtons[0].isActive && 'border border-primary'}`}
            >
              <h3 className='text-xl my-2'>Field Map</h3>
              {data ? (
                <DisplayMapView fieldDetails={data} />
              ) : (
                <Loader className='w-12 h-12' />
              )}
            </div>
            <Separator />
            <div
              ref={weatherDetailsRef}
              className={`flex rounded-xl bg-secondary/50 p-4 w-full flex-col
                ${navButtons[1].isActive && 'border border-primary'}`}
            >
              <h3 className='text-xl my-2'>Weather Details</h3>
              <WeatherDetails
                weatherData={weatherData}
              />
            </div>
            <Separator />
            <div
              ref={forecastDetailsRef}
              className={`flex rounded-xl bg-secondary/50 p-4 w-full flex-col
                ${navButtons[2].isActive && 'border border-primary'}`}
            >
              <h3 className='text-xl mt-2'>Forecast Details</h3>
              <p className='text-sm text-gray-500 mb-2'>5 Day Forecast</p>
              <ForecastDetails
                forecastData={forecastData}
              />
            </div>
            <Separator />
            <div
              ref={fieldDataDetailsRef}
              className={`flex rounded-xl bg-secondary/50 p-4 w-full flex-col
                ${navButtons[3].isActive && 'border border-primary'}`}
            >
              <h3 className='text-xl my-2'>Field Details</h3>
              <FieldDataDetails 
                data={data}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const FieldDetails = () => {
  const { id } = useParams();
  const [fieldData, setFieldData] = useState({});

  const fetchData = async () => {
    try {
      const res = await fetchFieldApi(id);
      console.log(res.data);
      setFieldData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Fields', link: '/dashboard/fields' },
    { title: fieldData?.name || id, link: `/dashboard/fields/${id}` },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <FieldDetailsMain data={fieldData} />
      </div>
    </PageContainer>
  );
};

export default FieldDetails;

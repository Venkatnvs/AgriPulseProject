import { fetchFieldApi, fetchWeatherAndForecastApi } from '@/apis/fields';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import PageContainer from '@/components/layout/PageContainer';
import HeaderWithButton from '@/components/PageHeaders/HeaderWithButton';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DisplayMapView from './components/DisplayMapView';
import { Link2, Loader, Plus } from 'lucide-react';
import MainFieldDetails from './components/FieldDetails/MainFieldDetails';
import WeatherDetails from './components/FieldDetails/WeatherDetails';
import { Separator } from '@/components/ui/separator';
import ForecastDetails from './components/FieldDetails/ForecastDetails';
import FieldDataDetails from './components/FieldDetails/FieldDataDetails';
import LinkDeviceDialog from './components/LinkDeviceDialog';

const FieldDetailsMain = ({ data, setFieldData = () => {} }) => {
  const mapViewRef = useRef(null);
  const weatherDetailsRef = useRef(null);
  const forecastDetailsRef = useRef(null);
  const fieldDataDetailsRef = useRef(null);
  const navigate = useNavigate();

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
  const [openLinkDeviceModal, setOpenLinkDeviceModal] = useState(false);

  const fetchWeatherData = async () => {
    try {
      const res = await fetchWeatherAndForecastApi({
        lat: data?.main_coordinate[1],
        lon: data?.main_coordinate[0],
      });
      setWeatherData(res.data?.weather);
      setForecastData(res.data?.forecast);
    } catch (err) {
      console.log(err);
    }
  };

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
        buttonText={data?.linked_devices ? 'View Device' : 'Link Device'}
        onClick={() => {
          if (!data?.linked_devices) {
            setOpenLinkDeviceModal(true);
          } else {
            navigate(`/dashboard/devices/${data?.linked_devices}`);
          }
        }}
        icon={
          data?.linked_devices ? (
            <Link2 className='mr-2 h-4 w-4' />
          ) : (
            <Plus className='mr-2 h-4 w-4' />
          )
        }
      />

      {openLinkDeviceModal && (
        <LinkDeviceDialog
          openLinkDeviceModal={openLinkDeviceModal}
          setOpenLinkDeviceModal={setOpenLinkDeviceModal}
          data={data}
          setFieldData={setFieldData}
        />
      )}

      <section className='flex flex-col gap-4 h-full w-full'>
        <div className='grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full'>
          <div className='flex-col items-start gap-8 md:flex lg:sticky lg:top-0 self-start hidden w-full'>
            <MainFieldDetails
              navButtons={navButtons}
              setNavButtons={setNavButtons}
              mapViewRef={mapViewRef}
              weatherDetailsRef={weatherDetailsRef}
              forecastDetailsRef={forecastDetailsRef}
              fieldDataDetailsRef={fieldDataDetailsRef}
            />
          </div>
          <div className='flex-1 flex flex-col col-span-2 space-y-4'>
            <div
              ref={mapViewRef}
              className={`min-h-[90vh] flex rounded-xl bg-secondary/50 p-4 w-full h-full flex-col ${
                navButtons[0].isActive && 'border border-primary'
              }`}
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
              className={`flex rounded-xl bg-secondary/50 p-4 w-full flex-col ${
                navButtons[1].isActive && 'border border-primary'
              }`}
            >
              <h3 className='text-xl my-2'>Weather Details</h3>
              <WeatherDetails weatherData={weatherData} />
            </div>
            <Separator />

            <div
              ref={forecastDetailsRef}
              className={`flex rounded-xl bg-secondary/50 p-2 md:p-4 w-full flex-col ${
                navButtons[2].isActive && 'border border-primary'
              }`}
            >
              <h3 className='text-xl mt-2'>Forecast Details</h3>
              <p className='text-sm text-gray-500 mb-2'>5 Day Forecast</p>
              <ForecastDetails forecastData={forecastData} />
            </div>
            <Separator />

            <div
              ref={fieldDataDetailsRef}
              className={`flex rounded-xl bg-secondary/50 p-2 w-full flex-col ${
                navButtons[3].isActive && 'border border-primary'
              }`}
            >
              <h3 className='text-xl my-2'>Field Details</h3>
              <FieldDataDetails data={data} />
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
        <FieldDetailsMain data={fieldData} setFieldData={setFieldData} />
      </div>
    </PageContainer>
  );
};

export default FieldDetails;

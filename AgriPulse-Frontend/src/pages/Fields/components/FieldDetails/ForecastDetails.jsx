import React from 'react';
import {
  CardContent,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { degToCompass } from '../../scripts/utils';
import { weatherIcons } from '@/constants/Icons/WeatherIcons';
import moment from 'moment';

const ForecastCard = ({ forecast, icon }) => {
  return (
    <CardContent>
      <div className='flex flex-row flex-wrap'>
        <ScrollArea orientation='horizontal' className='overflow-x-auto'>
          <div className='flex flex-nowrap gap-4 mb-3'>
            {forecast.map(item => (
              <div
                key={item.dt}
                className='flex-shrink-0 w-44 p-2 border rounded-lg bg-secondary'
              >
                <div className='flex flex-col items-center'>
                  <div className='text-sm text-center'>
                    {moment.unix(item.dt).format('ddd Do')}
                    <br />
                    {moment.unix(item.dt).format('HH:mm')}
                    <br />
                    <img
                      className='w-16 h-16 mb-2 inline-block'
                      src={icon(item.weather[0].icon)}
                      alt='Weather Icon'
                    />
                    <br />
                    <strong>{item.main.temp} °C</strong>
                    <br />
                    <br />
                    {item.weather[0].main}
                    <br />
                    {item.weather[0].description}
                    <hr className='my-2' />
                    <div className='text-sm'>
                      <div>Pressure: {item.main.pressure} hPa</div>
                      <div>Humidity: {item.main.humidity}%</div>
                      <div>
                        Wind: {item.wind.speed} {'m/s'}{' '}
                        {degToCompass(item.wind.deg)}
                      </div>
                      <div>Cloud cover: {item.clouds.all}%</div>
                      {item.snow && <div>Snow in 3h: {item.snow['3h']}</div>}
                      {item.rain && <div>Rain in 3h: {item.rain['3h']}</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </CardContent>
  );
};

const ForecastDetails = ({ forecastData }) => {
  if (!forecastData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ForecastCard
        forecast={forecastData}
        icon={name => {
          return weatherIcons[name];
        }}
      />
    </>
  );
};

export default ForecastDetails;

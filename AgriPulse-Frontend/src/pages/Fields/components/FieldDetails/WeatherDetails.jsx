import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { weatherIcons } from '@/constants/Icons/WeatherIcons';
import { fetchWeatherAndForecastApi } from '@/apis/fields';
import { degToCompass } from '../../scripts/utils';

const WeatherCard = ({
  icon,
  temperature,
  units,
  feels_like,
  temp_max,
  temp_min,
  wind_speed,
  wind_deg,
  pressure,
  humidity,
  clouds,
}) => {
  return (
    <CardContent>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 space-x-3'>
        <div className='col-span-1 flex flex-col items-center'>
          <div className='flex flex-1 flex-row items-center'>
            <div className='w-2/3 mb-2'>
              <img
                className='w-auto object-contain'
                src={icon}
                alt='Weather Icon'
              />
            </div>
            <div className='w-1/3 text-center'>
              <h1 className='text-2xl'>{temperature}</h1>
              <h1 className='text-2xl'>{units}</h1>
            </div>
          </div>
          <div className='mt-2'>
            <h2 className='text-sm text-gray-500'>Feels like {feels_like}</h2>
          </div>
        </div>

        <div className='col-span-1 pl-4'>
          <div className='mt-3'>
            <small className='text-gray-500'>Temp max</small>
            <h3 className='text-xl'>{temp_max}</h3>
          </div>
          <div className='mt-3'>
            <small className='text-gray-500'>Temp min</small>
            <h3 className='text-xl'>{temp_min}</h3>
          </div>
        </div>

        <div className='col-span-1 pl-4'>
          <div className='mt-3'>
            <small className='text-gray-500'>Wind</small>
            <h3 className='text-xl'>
              {wind_speed}
              <span className='text-sm'> {wind_deg}</span>
            </h3>
          </div>
          <div className='mt-3'>
            <small className='text-gray-500'>Pressure</small>
            <h3 className='text-xl'>{pressure} hPa</h3>
          </div>
        </div>

        <div className='col-span-1 pl-4'>
          <div className='mt-3'>
            <small className='text-gray-500'>Humidity</small>
            <h3 className='text-xl'>{humidity}%</h3>
          </div>
          <div className='mt-3'>
            <small className='text-gray-500'>Cloud cover</small>
            <h3 className='text-xl'>{clouds}%</h3>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

const WeatherDetails = ({ weatherData }) => {
  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <WeatherCard
        icon={weatherIcons[weatherData.weather[0].icon]}
        description={weatherData.weather[0].description}
        temperature={weatherData.main.temp}
        units={'C'}
        feels_like={weatherData.main.feels_like + '°C'}
        temp_max={weatherData.main.temp_max + '°C'}
        temp_min={weatherData.main.temp_min + '°C'}
        pressure={weatherData.main.pressure}
        humidity={weatherData.main.humidity}
        clouds={weatherData.clouds.all}
        wind_speed={weatherData.wind.speed + ' m/s'}
        wind_deg={degToCompass(weatherData.wind.deg)}
        rain={weatherData.rain && weatherData.rain['3h']}
        snow={weatherData.snow && weatherData.snow['3h']}
      />
    </div>
  );
};

export default WeatherDetails;

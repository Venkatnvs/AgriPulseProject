import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import LoadingPage from '@/components/LoadingPage';

export const description = 'An interactive bar chart';

const chartConfig = {
  temperature: {
    label: 'Temperature',
    color: 'hsl(var(--chart-1))',
  },
  humidity: {
    label: 'Humidity',
    color: 'hsl(var(--chart-2))',
  },
  avg_soil_moisture: {
    label: 'Avg Soil Moisture',
    color: 'hsl(var(--chart-3))',
  },
};

const BarAverageGraph = ({ chartData }) => {
  const [activeChart, setActiveChart] = useState('avg_soil_moisture');

  const total = useMemo(() => {
    if (chartData?.length === 0) {
      return {
        temperature: 0,
        humidity: 0,
        avg_soil_moisture: 0,
      };
    }

    const sum = chartData?.reduce(
      (acc, curr) => {
        acc.temperature += curr.temperature || 0;
        acc.humidity += curr.humidity || 0;
        acc.avg_soil_moisture += curr.avg_soil_moisture || 0;
        return acc;
      },
      { temperature: 0, humidity: 0, avg_soil_moisture: 0 },
    );

    return {
      temperature: sum.temperature / chartData.length,
      humidity: sum.humidity / chartData.length,
      avg_soil_moisture: sum.avg_soil_moisture / chartData.length,
    };
  }, [chartData]);
  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>
            Average Data
            </CardTitle>
          <CardDescription>
            Average data for each day
          </CardDescription>
        </div>
        <div className='flex'>
          {['temperature', 'humidity', 'avg_soil_moisture'].map(key => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-xs text-muted-foreground'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg font-bold leading-none sm:text-3xl'>
                  {total[chart].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[280px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey={activeChart}
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarAverageGraph;

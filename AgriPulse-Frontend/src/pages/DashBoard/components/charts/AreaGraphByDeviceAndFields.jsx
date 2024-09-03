import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  fields: {
    label: 'Fields',
    color: 'hsl(var(--chart-1))',
  },
  devices: {
    label: 'Devices',
    color: 'hsl(var(--chart-2))',
  },
};

const AreaGraphByDeviceAndFields = ({ chartData }) => {
  console.log(chartConfig);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices and Fields</CardTitle>
        <CardDescription>
          Showing the number of devices and fields
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[310px] w-full'
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 8,
              bottom: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='devices'
              type='natural'
              fill='var(--color-devices)'
              fillOpacity={0.4}
              stroke='var(--color-devices)'
              stackId='a'
            />
            <Area
              dataKey='fields'
              type='natural'
              fill='var(--color-fields)'
              fillOpacity={0.4}
              stroke='var(--color-fields)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              {chartData[chartData.length - 1] &&
                `Devices ${
                  chartData[chartData.length - 1]?.devices_increase_percentage < 0
                    ? 'down'
                    : 'up'
                } by ${Math.abs(
                  chartData[chartData.length - 1]?.devices_increase_percentage,
                )}% this month`}
              <TrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 font-medium leading-none'>
              {chartData[chartData.length - 1] &&
                `Fields ${
                  chartData[chartData.length - 1]?.fields_increase_percentage < 0
                    ? 'down'
                    : 'up'
                } by ${Math.abs(
                  chartData[chartData.length - 1]?.fields_increase_percentage,
                )}% this month`}
              <TrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              {`Showing data for ${chartData[0]?.month} - ${
                chartData[chartData.length - 1]?.month
              }`}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AreaGraphByDeviceAndFields;

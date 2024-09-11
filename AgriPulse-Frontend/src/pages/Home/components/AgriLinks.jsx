import React from 'react';
import govAgriLinks from '@/constants/AgrilGovLinks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

const AgriLinks = () => {
  return (
    <section className='w-full md:max-w-6xl py-16 bg-gradient-to-b from-green-50 to-white dark:from-background/70 dark:to-background/60 overflow-hidden rounded-sm'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <h2 className='text-4xl font-bold text-center mb-8 text-green-800 dark:text-green-300'>
          Government Agricultural Connects
        </h2>
        <p className='text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto'>
          Explore government initiatives designed to support and empower farmers
          across India. These schemes aim to enhance agricultural productivity,
          provide financial assistance, and improve rural livelihoods.
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {govAgriLinks.map((scheme, index) => (
            <div key={index} className='flex justify-center'>
              <Card className='w-full h-full max-w-sm transition-all duration-300 hover:shadow-lg group'>
                <CardContent className='p-6 flex flex-col justify-between h-full'>
                  <div>
                    <div className='flex items-center mb-4'>
                      <div className='text-3xl mr-4'>{scheme.icon}</div>
                      <h3 className='text-xl text-green-800 dark:text-green-300'>
                        {scheme.name}
                      </h3>
                    </div>
                    <p className='text-gray-600 dark:text-gray-400 mb-4'>
                      {scheme.description}
                    </p>
                  </div>
                  <a
                    href={scheme.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors'
                  >
                    Visit Website
                    <ExternalLink className='ml-1 h-4 w-4 text-primary' />
                  </a>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className='mt-12 text-center'>
          <Badge
            variant='outline'
            className='text-green-700 dark:text-green-300 border-green-300 dark:border-green-500 px-6 py-3 text-lg font-semibold animate-pulse flex-col md:flex-row lg:flex-row'
          >
            For immediate assistance, call Kisan Call Center:&nbsp;
            <span className='ctm_highlight2'>1800-180-1551</span>
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default AgriLinks;

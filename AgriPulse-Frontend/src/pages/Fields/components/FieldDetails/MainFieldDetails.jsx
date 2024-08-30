import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const MainFieldDetails = ({
  navButtons,
  setNavButtons = () => {},
  mapViewRef,
  weatherDetailsRef,
  forecastDetailsRef,
  fieldDataDetailsRef,
}) => {
  const NavButton = ({ name, onClick, isActive }) => {
    return (
      <Button
        onClick={
          isActive
            ? () => {}
            : () => {
                setNavButtons(
                  navButtons.map(button => ({
                    ...button,
                    isActive: button.name === name,
                  })),
                );
                onClick();
              }
        }
        variant='default'
        className={`${
          isActive
            ? 'text-primary-foreground'
            : 'bg-primary-foreground text-primary'
        } hover:text-primary-foreground`}
      >
        {name}
      </Button>
    );
  };

  return (
    <div className='flex flex-col w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Fields Details Area</CardTitle>
          <CardDescription>View and manage your fields</CardDescription>

          <CardContent>
            <div className='flex flex-col gap-2 mt-5'>
              <div className='justify-start flex flex-col gap-2'>
                {navButtons.map((button, index) => (
                  <NavButton
                    key={index}
                    name={button.name}
                    onClick={button.onClick}
                    isActive={button.isActive}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MainFieldDetails;

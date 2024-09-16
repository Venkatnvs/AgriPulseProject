import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SITE_NAME } from '@/constants/BaseAxios';
import { MainLogo, AuthBgImage } from '@/constants/Images';
import ThemeToggle from '@/themes/theme-toggle';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();

  const loginSignupToggle = () => {
    console.log(window.location.pathname);
    if (window.location.pathname === '/login') {
      return navigate('/sign-up');
    }
    return navigate('/login');
  };

  return (
    <>
      <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url(${AuthBgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.9)',
              borderImage: 'fill 0 linear-gradient(#0001, #000A00)',
            }}
          />
          <div 
            className='relative z-20 flex items-center text-lg font-medium rounded-md w-fit px-2 cursor-pointer'
            onClick={() => navigate('/')}
          >
            <img
              src={MainLogo}
              alt='logo'
              className='max-w-[200px] w-16 h-16 my-1 rounded-md'
              style={{
                filter: 'drop-shadow(0 0 3px #000)',
              }}
            />
            <h2 className='text-3xl font-semibold text-white font-oswald'>
              {SITE_NAME}
            </h2>
          </div>
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;Water is the driving force of all nature.&rdquo;
              </p>
              <footer className='text-sm'>- Leonardo da Vinci</footer>
            </blockquote>
          </div>
        </div>
        <div className='flex h-full items-center p-4 lg:p-8 flex-col'>
          <header className='sticky inset-x-0 top-0 w-full'>
            <nav className='flex items-center justify-between px-2 lg:px-4 py-1 md:justify-end gap-2 lg:gap-5'>
              <div className='flex items-center w-full cursor-pointer'
                onClick={() => navigate('/')}
              >
                <img
                  src={MainLogo}
                  alt='logo'
                  className='max-w-[150px] w-auto h-12 lg:hidden'
                />
                <h2 className='text-2xl text-primary font-semibold lg:text-3xl lg:hidden font-oswald'>
                  {SITE_NAME}
                </h2>
              </div>
              <Button
                as={Link}
                variant='secondary'
                size='sm'
                className='md:block shadow-md'
                onClick={loginSignupToggle}
              >
                {window.location.pathname === '/login' ? 'Sign up' : 'Log in'}
              </Button>
              <ThemeToggle />
            </nav>
          </header>
          <ScrollArea className='h-full w-full'>{children}</ScrollArea>
        </div>
      </div>
    </>
  );
};
export default AuthLayout;

import React from 'react';
import {
    Mail,
    MapPinIcon,
    Phone,
} from 'lucide-react';
import { SITE_NAME } from '@/constants/BaseAxios';
import { FooterLinks, SocialLinks } from '@/constants/FooterConstants';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-white dark:bg-black text-primary py-10 mt-16 border-separate border-t border-foreground/20'>
      <div className='lg:w-[90%] max-w-[1400px] mx-auto px-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div>
            <h3 className='text-2xl font-bold mb-4'>About Us</h3>
            <p className='text-sm leading-relaxed text-foreground'>
              {SITE_NAME} Solutions is dedicated to revolutionizing agriculture
              through innovative technology. We empower farmers with data-driven
              insights and cutting-edge tools.
            </p>
          </div>
          <div>
            <h3 className='text-2xl font-bold mb-4'>Contact</h3>
            <ul className='space-y-3 text-foreground'>
              <li className='flex items-center'>
                <a href='mailto:contact@nvsconnect.me' className='flex items-center hover:underline transition-all duration-300'>
                    <Mail className='mr-2' /> contact@nvsconnect.me
                </a>
              </li>
              <li className='items-center hidden'>
                <a href='tel:+1234567890' className='flex items-center hover:underline transition-all duration-300'>
                <Phone className='mr-2' /> 123 456-7890
                </a>
              </li>
              <li className='flex items-center'>
                <a href='https://maps.app.goo.gl/tzpLXpojFdpJ12LQ6' className='flex items-center hover:underline transition-all duration-300'>
                <MapPinIcon className='mr-2' /> Kumaraswamy layout,
                Bangalore,
                <br /> KA - 560078
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-2xl font-bold mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-foreground'>
                {
                    FooterLinks.map((link, index) => (
                        <li key={index}>
                            <a
                                href={link.link}
                                className='hover:underline transition-all duration-300'
                            >
                                {link.title}
                            </a>
                        </li>
                    ))
                }
            </ul>
          </div>
          <div>
            <h3 className='text-2xl font-bold mb-4'>Find Us On The Map</h3>
            <div className='aspect-w-16 aspect-h-9'>
                    <iframe
                      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3195.2406805325!2d77.56398017403177!3d12.909163516246197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae156310100001%3A0x71be53da4480fbbe!2sDayananda%20Sagar%20College%20of%20Engineering!5e1!3m2!1sen!2sus!4v1726316400815!5m2!1sen!2sus'
                      width='100%'
                      height='100%'
                      style={{ border: 0 }}
                      allowFullScreen=''
                      loading='lazy'
                      referrerPolicy='no-referrer-when-downgrade'
                    ></iframe>
                  </div>
          </div>
        </div>
        <div className='text-foreground mt-12 pt-8 border-t border-foreground/20 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-primary'>
            &copy; {currentYear} {SITE_NAME} Solutions. All rights reserved.
          </p>
          <div className='flex space-x-4 mt-4 md:mt-0'>
            {
                SocialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.link}
                      target='_blank'
                      className='hover:text-foreground/60 transition-colors duration-300'
                    >
                      {link.icon}
                    </a>
                ))
            }
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';

const GradientButtonLink = ({
  href,
  text,
  className = '',
  onClick = () => {},
  Icon = null,
}) => {
  return (
    <a
      href={href}
      className={`m-1 
            inline-block
            bg-gradient-3
            no-underline
            py-3 px-8
            rounded-full
            font-semibold
            transition-transform duration-300
            hover:translate-y-[-3px]
            ${className}
            `}
      onClick={onClick}
    >
      {text}
      {Icon ? (
          <Icon className='h-5 w-5 ml-2 inline-flex' />
      ) : null}
    </a>
  );
};

export default GradientButtonLink;

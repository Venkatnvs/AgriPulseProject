import React, { useState } from 'react';

const useSidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggle = () => {
    setIsMinimized(prevState => !prevState);
  };

  return { isMinimized, toggle };
};

export default useSidebar;

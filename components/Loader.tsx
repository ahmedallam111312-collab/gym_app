
import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-text-secondary">{message}</p>
    </div>
  );
};

export default Loader;

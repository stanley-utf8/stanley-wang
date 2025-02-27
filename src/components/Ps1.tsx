import React from 'react';
import config from '../../config.json';
import { getCurrentPath } from '../utils/bin';

interface Props {
  path?: string;
}

export const Ps1: React.FC<Props> = ({ path }) => {
  
  const currentPath = path || getCurrentPath();
  const currentDir = currentPath.split('/').pop() || '/';
  const displayPath = currentPath === '/' ? '/' : (currentDir === 'stanley' ? '~' : currentDir);

  return (
    <div>
      <span className="text-light-yellow dark:text-dark-blue">
        {config.ps1_username}
      </span>
      <span className="text-light-gray dark:text-dark-gray">@</span>
      <span className="text-light-green dark:text-dark-purple">
        {config.ps1_hostname}:
      </span>
      <span className="text-light-gray dark:text-dark-gray">
        {' '}
        {displayPath} $
      </span>
    </div>
  );
};

export default Ps1;

import React from 'react';

export interface IconProps {
  className?: string;
  size?: number;
}

export const IconFigma: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
  </svg>
);

export const IconGithub: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export const IconLinkedin: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export const IconDribbble: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
    <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
    <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
  </svg>
);

export const IconNetlify: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.8 9.2L14.8 5.2C14.4 4.8 13.8 4.8 13.4 5.2L12 6.6L9.2 3.8C8.8 3.4 8.2 3.4 7.8 3.8L3.8 7.8C3.4 8.2 3.4 8.8 3.8 9.2L6.6 12L3.8 14.8C3.4 15.2 3.4 15.8 3.8 16.2L7.8 20.2C8.2 20.6 8.8 20.6 9.2 20.2L12 17.4L13.4 18.8C13.8 19.2 14.4 19.2 14.8 18.8L18.8 14.8C19.2 14.4 19.2 13.8 18.8 13.4L16 10.6L18.8 9.2Z" fill="#00C7B7"/>
    <path d="M12 9.5L14.5 12L12 14.5L9.5 12L12 9.5Z" fill="#20C6B7"/>
  </svg>
);

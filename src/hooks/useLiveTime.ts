import { useState, useEffect } from 'react';

export function useLiveTime(timeZone: string = 'Asia/Kolkata') {
  const [timeString, setTimeString] = useState<string>('');
  const [status, setStatus] = useState<'Active' | 'Deep Focus' | 'Online'>('Active');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setTimeString(formatter.format(now));

        // Determine working hours (9 AM to 11 PM IST)
        const hourFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: 'numeric',
          hour12: false,
        });
        const currentHour = parseInt(hourFormatter.format(now), 10);
        if (currentHour >= 9 && currentHour < 22) {
          setStatus('Active');
        } else if (currentHour >= 22 || currentHour < 2) {
          setStatus('Deep Focus');
        } else {
          setStatus('Online');
        }
      } catch (err) {
        setTimeString(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  return { timeString, status };
}

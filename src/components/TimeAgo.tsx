import React, { useEffect, useState } from "react";

interface TimeAgoProps {
  dateString: string;
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + " years ago";
  if (interval === 1) return "1 year ago";

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months ago";
  if (interval === 1) return "1 month ago";

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + " days ago";
  if (interval === 1) return "1 day ago";

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + " hours ago";
  if (interval === 1) return "1 hour ago";

  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " minutes ago";
  if (interval === 1) return "1 minute ago";

  return "just now";
};

const TimeAgo: React.FC<TimeAgoProps> = ({ dateString }) => {
  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(dateString));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeAgo(formatTimeAgo(dateString));
    }, 60000);
    return () => clearInterval(intervalId);
  }, [dateString]);

  return <span>{timeAgo}</span>;
};

export default TimeAgo;

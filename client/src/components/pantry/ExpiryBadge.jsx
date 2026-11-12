import React from 'react';
import { getExpiryStatus, getStatusColor, getDaysRemaining } from '../../utils/dateUtils';
import { AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';

const ExpiryBadge = ({ expiryDate }) => {
  const status = getExpiryStatus(expiryDate);
  const colorClass = getStatusColor(status);
  const days = getDaysRemaining(expiryDate);
  
  let Icon = CheckCircle2;
  let text = status;

  if (status === 'Expired') {
    Icon = XCircle;
    text = `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
  } else if (status === 'Expires Today') {
    Icon = AlertTriangle;
    text = 'Expires Today';
  } else if (status === 'Expiring Soon') {
    Icon = Clock;
    text = `Expires in ${days} day${days !== 1 ? 's' : ''}`;
  } else {
    Icon = CheckCircle2;
    text = 'Fresh';
  }

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${colorClass}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{text}</span>
    </div>
  );
};

export default ExpiryBadge;

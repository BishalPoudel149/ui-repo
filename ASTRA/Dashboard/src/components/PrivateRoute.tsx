import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const authToken = localStorage.getItem('access_token');
  return authToken ? <>{children}</> : <Navigate to="/login" />;
}
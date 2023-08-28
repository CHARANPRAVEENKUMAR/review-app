import React from 'react'
import ThemeProvider from './ThemeProvider';
import NotificationProvider from './NotificationProvider';
import AuthProvider from './AuthProvider';
import SearchProvider from './SearchProvider';

export default function ContextProviders({children}) {
  return (
    <NotificationProvider>
      <SearchProvider>
        <AuthProvider>5
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </SearchProvider>
    </NotificationProvider>
   
  )
}

import React from 'react';

export default function Container({children,className}){
  return <div className={'max-w-screen mx-auto'+className}>{children}</div>;  
}
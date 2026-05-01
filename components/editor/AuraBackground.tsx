"use client";

import React from "react";

export const AuraBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#05080f]">
      {/* Floating Blobs */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] animate-pulse"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', animationDuration: '8s' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-15 blur-[150px] animate-pulse"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', animationDuration: '12s' }}
      />
      <div 
        className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px] animate-pulse"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', animationDuration: '10s' }}
      />
      
      {/* Noise / Grain overlay for that premium texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* The main background blur layer */}
      <div className="absolute inset-0 backdrop-blur-[80px]" />
    </div>
  );
};

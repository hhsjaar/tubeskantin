'use client'
import Navbar from '@/components/kandok/Navbar'
import Sidebar from '@/components/kansip/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className='flex w-full relative'>
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
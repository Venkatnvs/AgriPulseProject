import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import React from 'react'

const DashboardLayout = ({
    children
}) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
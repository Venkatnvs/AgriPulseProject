import { Breadcrumbs } from '@/components/Breadcrumbs'
import PageContainer from '@/components/layout/PageContainer'
import TextHeader from '@/components/PageHeaders/TextHeader';
import React from 'react'

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Profile', link: '/profile' },
];


const MainProfilePage = () => {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <Breadcrumbs items={breadcrumbItems} />
        <TextHeader
          title='Profile'
          description='View and edit your profile information'
        />
      </div>
    </PageContainer>
  )
}

export default MainProfilePage
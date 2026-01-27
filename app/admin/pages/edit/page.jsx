import React, { Suspense } from 'react';
const EditPage = React.lazy(() => import('./EditPage'));

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPage />
      </Suspense>
    </div>
  );
};

export default Page;

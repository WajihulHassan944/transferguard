import React, { Suspense } from 'react';
const NewBlogPost = React.lazy(() => import('./NewBlogPost'));

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <NewBlogPost />
      </Suspense>
    </div>
  );
};

export default Page;

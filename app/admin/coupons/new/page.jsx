'use client';
import React, { Suspense } from "react";
import NewCoupon from "./NewCoupon";
import withAdminAuth from "@/hooks/withAdminAuth";

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <NewCoupon />
      </Suspense>
    </div>
  );
};

export default withAdminAuth(Page);

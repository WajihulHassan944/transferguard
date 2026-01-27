'use client';
import React, { useState } from 'react';
import './NewBlogPost.css';
import { GeistSans } from "geist/font/sans";

import NewBlogHeader from './NewBlogHeader';
import BlogEditorLeft from './BlogEditorLeft';
import BlogRightPanel from './BlogRightPanel';

const NewBlogPost = () => {
  const [activeTab, setActiveTab] = useState('settings');

  const [blogData, setBlogData] = useState({
    title: '',
    slug: '',
    featuredImage: null,
    excerpt: '',
    content: '',
    status: 'draft',
    publishDate: '',
    categories: [],
    tags: '',
    enableComments: true,
    seo: {
      title: '',
      description: '',
    },
  });

  const handleChange = (field, value) => {
    setBlogData(prev => ({ ...prev, [field]: value }));
  };

  const handleSeoChange = (field, value) => {
    setBlogData(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  return (
    <div className={`new-blog-container ${GeistSans.className}`}>
      <NewBlogHeader blogData={blogData} setBlogData={setBlogData} />
      <div className="blog-body">
        <BlogEditorLeft blogData={blogData} onChange={handleChange} />
        <BlogRightPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          blogData={blogData}
          onChange={handleChange}
          onSeoChange={handleSeoChange}
        />
      </div>
    </div>
  );
};

export default NewBlogPost;

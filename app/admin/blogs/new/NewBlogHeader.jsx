'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Save, LoaderCircle } from 'lucide-react';
import { baseUrl } from '@/const';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const NewBlogHeader = ({ blogData, setBlogData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
console.log(blogData);
  // 🟢 Fetch blog by ID (Edit mode)
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;
      setFetching(true);
      try {
        const res = await fetch(`${baseUrl}/blogs/get-by-id/${blogId}`, { credentials: 'include' });
        const json = await res.json();

        if (json.success && json.blog) {
          const blog = json.blog;
          setBlogData({
            title: blog.title || '',
            slug: blog.slug || '',
            featuredImage: blog.featuredImage,
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            status: blog.status || 'draft',
            publishDate: blog.publishDate ? blog.publishDate.split('T')[0] : '',
            categories: blog.categories || [],
            tags: Array.isArray(blog.tags) ? blog.tags.join(',') : blog.tags || '',
            enableComments: blog.enableComments ?? true,
            seo: blog.seo || { title: '', description: '' },
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    fetchBlog();
  }, [blogId, setBlogData]);

  // 🟣 Dynamic class for status badge
  const getStatusClass = () => {
    const status = blogData.status?.toLowerCase() || 'draft';
    switch (status) {
      case 'published':
        return 'status-badge published';
      case 'scheduled':
        return 'status-badge scheduled';
      default:
        return 'status-badge draft';
    }
  };
// 🟠 Handle Create or Update
const handleSubmit = async (customStatus) => {
  const data = { ...blogData };
  if (customStatus) data.status = customStatus.toLowerCase();
  else data.status = blogData.status?.toLowerCase() || 'draft';

  if (!data.title || !data.slug || !data.excerpt || !data.content) return;

  try {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('slug', data.slug);
    formData.append('excerpt', data.excerpt);
    formData.append('content', data.content);
    formData.append('status', data.status);
    formData.append('publishDate', data.publishDate || new Date().toISOString());
    data.categories.forEach((cat) => formData.append('categories', cat));
    formData.append('tags', data.tags);
    formData.append('enableComments', data.enableComments);
    formData.append('seo', JSON.stringify(data.seo));
    if (data.featuredImage) formData.append('featuredImage', data.featuredImage);

    const method = blogId ? 'PUT' : 'POST';
    const endpoint = blogId ? `${baseUrl}/blogs/update/${blogId}` : `${baseUrl}/blogs/create`;

    const res = await fetch(endpoint, {
      method,
      credentials: 'include',
      body: formData,
    });

    const json = await res.json();
    if (json.success) {
      // 🟢 Dynamic success message
      let action = blogId ? 'updated' : 'created';
      let statusText =
        data.status === 'published'
          ? 'and published'
          : data.status === 'scheduled'
          ? 'and scheduled'
          : 'as draft';

      toast.success(`Blog ${action} successfully ${statusText}!`);
      router.push('/admin/blogs');
    }
  } catch (error) {
    console.error('Error saving blog:', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="blog-header">
      <div className="header-left">
        <button className="back-btn" onClick={() => router.back()}>
          <ArrowLeft size={18} strokeWidth={2} />
          <span className="back-text">Back</span>
        </button>

        <div className="header-info">
          <h2>
            {blogId ? (
              <>
                Edit Blog Post
              </>
            ) : (
              'New Blog Post'
            )}
          </h2>

          <p>
            {blogId ? (
              <>
                Update your existing blog post
              </>
            ) : (
              'Create a new blog post'
            )}
          </p>
        </div>
        
      </div>

      <div className="header-actions">
      
                {blogId && fetching && <LoaderCircle size={18} strokeWidth={1.8} className="animate-spin" />}
        <span className={getStatusClass()}>
          {blogData.status.charAt(0).toUpperCase() + blogData.status.slice(1)}
        </span>

        <button className="icon-btn" title="Preview" onClick={() => window.open(`https://XclusiveVR.com/blogs/${blogData.slug}`, '_blank')} disabled={!blogData.slug}>
          <Eye size={16} strokeWidth={1.8} />
          <span className="btn-text">Preview</span>
        </button>

        <button
          className="icon-btn"
          title="Save draft"
          onClick={() => {
            setBlogData((prev) => ({ ...prev, status: 'draft' }));
            handleSubmit('draft');
          }}
          disabled={loading}
        >
          {loading && blogData.status === 'draft' ? (
            <LoaderCircle size={16} strokeWidth={1.8} className="animate-spin" />
          ) : (
            <Save size={16} strokeWidth={1.8} />
          )}
          <span className="btn-text">Save Draft</span>
        </button>

        <button className="publish-btn" onClick={() => handleSubmit()} disabled={loading}>
          {loading && blogData.status !== 'draft' ? (
            <LoaderCircle size={16} strokeWidth={1.8} className="animate-spin" />
          ) : (
            <span className="btn-text">{blogId ? 'Update' : 'Publish'}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NewBlogHeader;

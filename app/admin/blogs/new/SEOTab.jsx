import React from 'react';

const SEOTab = ({ blogData, onSeoChange }) => {
  const { title, description } = blogData.seo;

  return (
    <div className="tab-content">
      <label className="small-label">SEO Title</label>
      <input
        className="input"
        placeholder="Post title..."
        maxLength={60}
        value={title}
        onChange={(e) => onSeoChange('title', e.target.value)}
      />
      <p className="hint">{title.length}/60 characters</p>

      <label className="small-label">SEO Description</label>
      <textarea
        className="textarea"
        placeholder="Post description..."
        maxLength={160}
        value={description}
        onChange={(e) => onSeoChange('description', e.target.value)}
      />
      <p className="hint">{description.length}/160 characters</p>

      <div className="seo-preview">
        <h4 className="seo-title">{title || 'Post Title'}</h4>
        <p className="seo-link">yoursite.com/blog/{blogData.slug || 'post-slug'}</p>
        <p className="seo-desc">{description || 'Post description...'}</p>
      </div>
    </div>
  );
};

export default SEOTab;

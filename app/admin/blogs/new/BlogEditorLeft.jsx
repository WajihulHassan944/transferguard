import React, { useState, useEffect, useRef } from 'react';
import { Eraser, Image, PaintBucket, UploadCloud, X } from 'lucide-react';

const BlogEditorLeft = ({ blogData, onChange }) => {
  const [preview, setPreview] = useState(null);
  const [slugEditedManually, setSlugEditedManually] = useState(false);
 const [tempContent, setTempContent] = useState(blogData.content || ''); // 🟩 local state
  const editorRef = useRef();

  // 🟩 Only set innerHTML when content actually changes (not on every keystroke)
  useEffect(() => {
    if (editorRef.current && blogData.content !== tempContent) {
      editorRef.current.innerHTML = blogData.content || '';
      setTempContent(blogData.content || '');
    }
  }, [blogData.content]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange('featuredImage', file);
      setPreview(URL.createObjectURL(file)); // create preview URL
    }
  };

  const removeImage = () => {
    onChange('featuredImage', null);
    setPreview(null);
  };

  // Generate slug automatically from title
  useEffect(() => {
    if (!slugEditedManually && blogData.title) {
      const generatedSlug = blogData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // remove punctuation & emojis
        .trim()
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .slice(0, 80); // limit length

      onChange('slug', generatedSlug);
    }
  }, [blogData.title]);

  // Mark slug as manually edited if user types directly in slug input
  const handleSlugChange = (e) => {
    setSlugEditedManually(true);
    onChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'));
  };

  // If blogData.featuredImage is already a URL (editing existing blog)
  useEffect(() => {
    if (blogData.featuredImage && typeof blogData.featuredImage === 'string') {
      setPreview(blogData.featuredImage);
    }
  }, [blogData.featuredImage]);

  return (
    <div className="blog-left">
      <label className="label">Post Title</label>
      <input
        className="input"
        placeholder="Enter title"
        value={blogData.title}
        onChange={(e) => onChange('title', e.target.value)}
      />

      <label className="label">URL Slug</label>
      <input
        className="input"
        placeholder="post-url-slug"
        value={blogData.slug}
        onChange={handleSlugChange}
      />

      <label className="label">Featured Image</label>
      <div className="featured-box">
        {preview ? (
          <div>
            <img
              src={preview}
              alt="Preview"
              className="featured-preview-image"
            />
            <button
              onClick={removeImage}
              type="button"
              className="close-btn-img"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="featured-content">
            <Image size={48} strokeWidth={1.6} className="featured-icon" />
            <p className="featured-text">
              Upload a featured image for your post
            </p>
            <label className="upload-btn">
              <UploadCloud size={16} strokeWidth={1.6} />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>

      <label className="label mt-4">Excerpt</label>
      <textarea
        className="textarea"
        placeholder="Brief description of your post..."
        value={blogData.excerpt}
        onChange={(e) => onChange('excerpt', e.target.value)}
      />
<label className="label mt-4">Content</label>

<div className="editor-toolbar">
  <button
    type="button"
    title="Bold"
    onMouseDown={(e) => {
      e.preventDefault();
      document.execCommand('bold');
    }}
  >
    <b>B</b>
  </button>

  <button
    type="button"
    title="Underline"
    onMouseDown={(e) => {
      e.preventDefault();
      document.execCommand('underline');
    }}
  >
    <u>U</u>
  </button>

  <button
    type="button"
    title="Italic"
    onMouseDown={(e) => {
      e.preventDefault();
      document.execCommand('italic');
    }}
  >
    <i>I</i>
  </button>

  <select
    onChange={(e) => document.execCommand('fontSize', false, e.target.value)}
    defaultValue=""
    title="Font size"
  >
    <option value="" disabled>Font Size</option>
    <option value="1">8pt</option>
    <option value="2">10pt</option>
    <option value="3">12pt</option>
    <option value="4">14pt</option>
    <option value="5">18pt</option>
    <option value="6">24pt</option>
    <option value="7">36pt</option>
  </select>
   <label
    title="Text Color"
    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
  >
    <PaintBucket size={18} strokeWidth={1.6} style={{ marginRight: '4px' }} />
    <input
      type="color"
      onChange={(e) => document.execCommand('foreColor', false, e.target.value)}
      style={{
        width: '28px',
        height: '28px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
      }}
    />
  </label>

  {/* 🟩 Clear Formatting */}
  <button
    type="button"
    title="Clear Formatting"
    onMouseDown={(e) => {
      e.preventDefault();
      document.execCommand('removeFormat');
      document.execCommand('foreColor', false, '#000000');
    }}
  >
    <Eraser size={16} strokeWidth={1.6} />
  </button>
</div>



<div
  className="editor-wrapper"
  style={{ position: 'relative' }}
>
  {/* 🟨 Placeholder */}
  {!tempContent?.trim() && (
    <div
      className="editor-placeholder"
      style={{
        position: 'absolute',
        top: '17px',
        left: '17px',
        pointerEvents: 'none',
        fontSize: '14px',
      }}
    >
      Write your blog content here...
    </div>
  )}
<div
  ref={editorRef}
  className="rich-text-editor"
  contentEditable
  suppressContentEditableWarning
  dir="ltr"
  onInput={(e) => {
    const html = e.currentTarget.innerHTML;
    setTempContent(html);

    // 🟩 debounce before calling onChange to avoid constant rerenders
    clearTimeout(editorRef.current.debounceTimer);
    editorRef.current.debounceTimer = setTimeout(() => {
      onChange('content', html);
    }, 500);
  }}
  style={{
    padding: '10px',
    minHeight: '40vh',
    borderRadius: '6px',
  }}
></div></div>

    </div>
  );
};

export default BlogEditorLeft;

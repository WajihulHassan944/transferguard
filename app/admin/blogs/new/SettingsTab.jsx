import React from 'react';
import { Calendar, Tag, MessageCircle } from 'lucide-react';

const SettingsTab = ({ blogData, onChange }) => {
  const handleCategoryChange = (category) => {
    const newCats = blogData.categories.includes(category)
      ? blogData.categories.filter((c) => c !== category)
      : [...blogData.categories, category];
    onChange('categories', newCats);
  };

  return (
    <div className="tab-content">
      <label className="small-label">Status</label>
     <select
  className="select"
  value={blogData.status}
  onChange={(e) => onChange('status', e.target.value)}
>
  <option value="draft">Draft</option>
  <option value="published">Published</option>
  <option value="scheduled">Scheduled</option>
</select>


      <label className="small-label">Publish Date</label>
      <div className="date-row">
        <input
          className="input date-input"
          type="date"
          value={blogData.publishDate}
          onChange={(e) => onChange('publishDate', e.target.value)}
        />
      </div>

      <label className="small-label">Categories</label>
      <div className="checkbox-list">
        {['Tutorials', 'Getting Started', 'Advanced', 'Pricing', 'Guide', 'News', 'Updates','Insights'].map(c => (
          <label className="checkbox-item" key={c}>
            <input
              type="checkbox"
              checked={blogData.categories.includes(c)}
              onChange={() => handleCategoryChange(c)}
            />
            <span>{c}</span>
          </label>
        ))}
      </div>

      <label className="small-label" style={{ marginTop: '20px' }}>Tags</label>
      <div className="tags-row">
        <Tag size={14} strokeWidth={1.6} className="tag-icon" />
        <input
          className="input"
          placeholder="tag1, tag2, tag3"
          value={blogData.tags}
          onChange={(e) => onChange('tags', e.target.value)}
        />
      </div>
      <p className="hint">Separate tags with commas</p>

      <div className="toggle-row">
        <div className="toggle-left">
          <MessageCircle size={16} strokeWidth={1.6} className="msg-icon" />
          <span>Enable Comments</span>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={blogData.enableComments}
            onChange={(e) => onChange('enableComments', e.target.checked)}
          />
          <span className="slider" />
        </label>
      </div>
    </div>
  );
};

export default SettingsTab;

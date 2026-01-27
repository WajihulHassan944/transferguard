import React from 'react';
import { Settings, FileText } from 'lucide-react';
import SettingsTab from './SettingsTab';
import SEOTab from './SEOTab';

const BlogRightPanel = ({ activeTab, setActiveTab, blogData, onChange, onSeoChange }) => {
  return (
    <aside className="blog-right">
      <div className="tabs">
        <button
          className={activeTab === 'settings' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={16} strokeWidth={1.6} className="tab-icon" />
          <span>Settings</span>
        </button>
        <button
          className={activeTab === 'seo' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('seo')}
        >
          <FileText size={16} strokeWidth={1.6} className="tab-icon" />
          <span>SEO</span>
        </button>
      </div>

      <div className="tab-scroll">
        {activeTab === 'settings'
          ? <SettingsTab blogData={blogData} onChange={onChange} />
          : <SEOTab blogData={blogData} onSeoChange={onSeoChange} />}
      </div>
    </aside>
  );
};

export default BlogRightPanel;

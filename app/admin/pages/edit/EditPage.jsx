'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './EditPage.css';
import {
  ArrowLeft,
  Eye,
  GripVertical,
  LoaderCircle,
  Save,
  Upload,
} from 'lucide-react';
import { GeistSans } from 'geist/font/sans';
import { baseUrl } from '@/const';
import toast from 'react-hot-toast';

const EditPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [seoFile, setSeoFile] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [pageData, setPageData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch page by ID
  useEffect(() => {
    if (!id) return;
    const fetchPage = async () => {
      try {
        const res = await fetch(`${baseUrl}/pages/${id}`);
        const data = await res.json();
        if (data.success && data.pageByUrl) {
          setPageData(data.pageByUrl);
          setFormData(data.pageByUrl);
        } else {
          toast.error('Page not found');
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        toast.error('Error fetching page');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [id]);
console.log("page data is",pageData);
  // ✅ Handle null pageData safely
  if (loading) {
    return (
      <div className="loading-container">
        <LoaderCircle className="animate-spin" size={22} />
        <p>Loading page...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="error-container">
        <p>❌ Page not found or failed to load.</p>
        <button onClick={() => router.push('/admin/pages')}>Go Back</button>
      </div>
    );
  }

  const { pageName, pageUrl, pageStatus, sections = [], seo = {}, viewsCount, updatedAt } = pageData;

  // ✅ Update section fields
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index][field] = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  // ✅ Update SEO fields
  const handleSeoChange = (field, value) => {
    setFormData({
      ...formData,
      seo: { ...formData.seo, [field]: value },
    });
  };

  // ✅ Save handler
  const handleSave = async () => {
    try {
      setSaving(true);
      const form = new FormData();
      form.append('pageName', formData.pageName);
      form.append('pageUrl', formData.pageUrl);
      form.append('pageStatus', formData.pageStatus);
      form.append('seo', JSON.stringify(formData.seo));
      form.append('sections', JSON.stringify(formData.sections));

      if (seoFile) {
        form.append('openGraphImage', seoFile);
      }

      const res = await fetch(`${baseUrl}/pages/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Page updated successfully!');
        setSeoFile(null);
        setPageData(data.page);
        setFormData(data.page);
        router.push('/admin/pages');
      } else {
        toast.error('❌ Failed to update page: ' + data.message);
      }
    } catch (err) {
      console.error('Error saving page:', err);
      toast.error('⚠️ Error saving page');
    } finally {
      setSaving(false);
    }
  };
  // ✅ Update Card fields
  const handleCardChange = (sectionIndex, cardIndex, field, value) => {
    const updatedSections = [...formData.sections];
    const cards = updatedSections[sectionIndex].cards || [];
    cards[cardIndex][field] = value;
    updatedSections[sectionIndex].cards = cards;
    setFormData({ ...formData, sections: updatedSections });
  };

  // ✅ Update Sub Section fields
  const handleSubSectionChange = (sectionIndex, field, value) => {
    const updatedSections = [...formData.sections];
    if (!updatedSections[sectionIndex].subSection)
      updatedSections[sectionIndex].subSection = {};
    updatedSections[sectionIndex].subSection[field] = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  // ✅ Update Sub Section Card fields
  const handleSubCardChange = (sectionIndex, subCardIndex, field, value) => {
    const updatedSections = [...formData.sections];
    if (!updatedSections[sectionIndex].subSection)
      updatedSections[sectionIndex].subSection = {};
    if (!updatedSections[sectionIndex].subSection.cards)
      updatedSections[sectionIndex].subSection.cards = [];
    updatedSections[sectionIndex].subSection.cards[subCardIndex][field] = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  return (
    <div className={`edit-page-container ${GeistSans.className}`}>
      {/* Header */}
      <div className="edit-header">
        <div className="edit-header-left">
          <button className="edit-back-btn" onClick={() => router.push('/admin/pages')}>
            <ArrowLeft size={18} strokeWidth={2} />
            <span>Back</span>
          </button>

          <div className="edit-title">
            <div className="flex-col">
              <h2>{pageName}</h2>
              <span className="edit-url">{pageUrl}</span>
            </div>
          </div>

          <span className={`edit-status-badge ${pageStatus === 'published' ? 'published' : 'draft'}`}>
            {pageStatus}
          </span>
        </div>

        <div className="edit-header-right">
          {loading && <LoaderCircle size={18} strokeWidth={1.8} className="animate-spin" />}
          <button className="preview-btn" onClick={() => window.open(pageUrl, '_blank')}>
            <Eye size={16} />
            <span>Preview</span>
          </button>
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="edit-body">
        {/* Left Section */}
        <div className="edit-left">
          {/* Tabs */}
          <div className="edit-tabs">
            <button className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
              Content
            </button>
            <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} disabled style={{cursor:'not-allowed'}}>
              Page Settings
            </button>
            <button className={`tab-btn ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>
              SEO
            </button>
          </div>

          {/* Content Tab */}
          {activeTab === 'content' && (
            <>
              <div className="content-box">
                <label>Page Name</label>
                <input type="text" value={pageName} readOnly />
                <label>Page URL</label>
                <input type="text" value={pageUrl} readOnly />
              </div>

              <h3 className="content-heading">Content Sections</h3>
  

{/* ✅ Sort safely without mutating the original array */}
{[...(formData?.sections || [])]
  .slice() // clone array
  .sort((a, b) => {
    const numA = parseInt(a.sectionId?.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.sectionId?.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  })
  .map((section, index) => {
    // find actual index from unsorted array for correct updates
    const realIndex = formData.sections.findIndex((s) => s._id === section._id);

    return (
      <div className="content-section" key={section._id || index}>
      {/* ❌ Remove Section Button - only for these 3 URLs */}
{["/privacypolicy", "/cookies", "/termsandconditions"].includes(pageUrl) && (
  <button
    className="remove-section-btn"
    onClick={() => {
      const updated = [...formData.sections];
      updated.splice(realIndex, 1);
      setFormData({ ...formData, sections: updated });
    }}
  >
    ✕
  </button>
)}

        <div className="section-header">
          <GripVertical size={19} color="rgba(0,0,0,0.8)" />
          <span className="section-title">
            {section.title
              ? section.title.replace(/<[^>]+>/g, '').replace(/\\u003C[^>]+\\u003E/g, '')
              : `Section ${index + 1}`}
          </span>
          <span className="section-tag">{section.sectionId}</span>
        </div>

        <label>Section Title</label>
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) =>
            handleSectionChange(realIndex, 'title', e.target.value)
          }
        />

{/* Always show Content + Subdescription on legal pages */}
{["/privacypolicy", "/cookies", "/termsandconditions"].includes(pageUrl) ? (
  <>
    <label>Content</label>
    <textarea
      rows={4}
      value={section.description || ""}
      onChange={(e) =>
        handleSectionChange(realIndex, "description", e.target.value)
      }
    />

   
  </>
) : (
  <>
    {/* 🔥 For NON-legal pages: show only IF value exists */}
    {Object.prototype.hasOwnProperty.call(section, "description") && (
  <>
    <label>Content</label>
    <textarea
      rows={4}
      value={section.description || ""}
      onChange={(e) =>
        handleSectionChange(realIndex, "description", e.target.value)
      }
    />
  </>
)}

{section.subDescription && (
  <>
    <label>Sub Description</label>
    <textarea
      rows={4}
      value={section.subDescription || ""}
      onChange={(e) =>
        handleSectionChange(realIndex, "subDescription", e.target.value)
      }
    />
  </>
)}

  </>
)}

        {section.image && (
          <>
            <label>Image</label>
            <div className="upload-box">
              <input type="text" value={section.image} readOnly />
              <button className="upload-btn">
                <Upload size={15} /> Upload
              </button>
            </div>
            <div className="image-preview">
              <img src={section.image} alt="section" />
            </div>
          </>
        )}

        {/* ✅ FAQ Section */}
        {section.faqs && pageUrl === '/faq' && (
          <div className="faqs-container">
            <h4>FAQs</h4>
            {section.faqs.map((faq, faqIndex) => (
              <div key={faq._id || faqIndex} className="faq-item">
                <div className="faq-header">
                  <strong>Q{faqIndex + 1}</strong>
                  <button
                    className="delete-faq-btn"
                    onClick={() => {
                      const updatedSections = [...formData.sections];
                      updatedSections[realIndex].faqs.splice(faqIndex, 1);
                      setFormData({ ...formData, sections: updatedSections });
                    }}
                  >
                    ✕
                  </button>
                </div>

                <label>Question</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const updatedSections = [...formData.sections];
                    updatedSections[realIndex].faqs[faqIndex].question =
                      e.target.value;
                    setFormData({ ...formData, sections: updatedSections });
                  }}
                />

                <label>Answer</label>
                <textarea
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => {
                    const updatedSections = [...formData.sections];
                    updatedSections[realIndex].faqs[faqIndex].answer =
                      e.target.value;
                    setFormData({ ...formData, sections: updatedSections });
                  }}
                />
              </div>
            ))}

            <button
              className="add-faq-btn"
              onClick={() => {
                const updatedSections = [...formData.sections];
                if (!updatedSections[realIndex].faqs)
                  updatedSections[realIndex].faqs = [];
                updatedSections[realIndex].faqs.push({
                  question: '',
                  answer: '',
                  _id: `temp-${Date.now()}`,
                });
                setFormData({ ...formData, sections: updatedSections });
              }}
            >
              + Add FAQ
            </button>
          </div>
        )}




{/* ✅ Render Cards only if not empty */}
{section.cards && section.cards.length > 0 && (
  <div className="cards-container">
    <h4>Cards</h4>
    {section.cards.map((card, cIndex) => (
      <div key={cIndex} className="card-item">
        <div className="card-header">
          <strong>Card {cIndex + 1}</strong>
        </div>
        <input
          type="text"
          placeholder="Card Title"
          value={card.title || ""}
          onChange={(e) =>
            handleCardChange(realIndex, cIndex, "title", e.target.value)
          }
        />
        <textarea
          placeholder="Card Description"
          value={card.description || ""}
          onChange={(e) =>
            handleCardChange(realIndex, cIndex, "description", e.target.value)
          }
        />
        {card.subDescription && card.subDescription.trim() !== "" && (
          <textarea
            placeholder="Card Sub Description"
            value={card.subDescription}
            onChange={(e) =>
              handleCardChange(realIndex, cIndex, "subDescription", e.target.value)
            }
          />
        )}
      </div>
    ))}
  </div>
)}
{/* ✅ Render Sub Section only if it exists and has any content */}
{section.subSection &&
  (section.subSection.title?.trim() ||
    section.subSection.description?.trim() ||
    section.subSection.subDescription?.trim() ||
    (section.subSection.cards && section.subSection.cards.length > 0)) && (
    <div className="subsection-container">
      <h4>Sub Section</h4>

{Object.prototype.hasOwnProperty.call(section.subSection, "title") && (
  <input
    type="text"
    placeholder="Sub Section Title"
    value={section.subSection.title || ""}
    onChange={(e) =>
      handleSubSectionChange(realIndex, "title", e.target.value)
    }
  />
)}

{Object.prototype.hasOwnProperty.call(section.subSection, "description") && (
  <textarea
    placeholder="Sub Section Description"
    value={section.subSection.description || ""}
    onChange={(e) =>
      handleSubSectionChange(realIndex, "description", e.target.value)
    }
  />
)}
      {section.subSection.subDescription && (
        <textarea
          placeholder="Sub Section Sub Description"
          value={section.subSection.subDescription || ""}
          onChange={(e) =>
            handleSubSectionChange(realIndex, "subDescription", e.target.value)
          }
        />
      )}

      {/* ✅ Sub Section Cards only if not empty */}
      {section.subSection.cards && section.subSection.cards.length > 0 && (
        <div className="sub-cards-container">
          <h5>Sub Section Cards</h5>
          {section.subSection.cards.map((card, sIndex) => (
            <div key={sIndex} className="card-item">
              <div className="card-header">
                <strong>Card {sIndex + 1}</strong>
              </div>
              <input
                type="text"
                placeholder="Card Title"
                value={card.title || ""}
                onChange={(e) =>
                  handleSubCardChange(realIndex, sIndex, "title", e.target.value)
                }
              />
              <textarea
                placeholder="Card Description"
                value={card.description || ""}
                onChange={(e) =>
                  handleSubCardChange(
                    realIndex,
                    sIndex,
                    "description",
                    e.target.value
                  )
                }
              />
              {card.subDescription && card.subDescription.trim() !== "" && (
                <textarea
                  placeholder="Card Sub Description"
                  value={card.subDescription}
                  onChange={(e) =>
                    handleSubCardChange(
                      realIndex,
                      sIndex,
                      "subDescription",
                      e.target.value
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )}




      </div>
    );
  })}
            {/* ✅ Show Add Section button for legal pages */}
{["/privacypolicy", "/cookies", "/termsandconditions"].includes(pageUrl) && (
  <button
    className="add-section-btn"
    onClick={() => {
      const updated = [...(formData.sections || [])];
      updated.push({
        _id: `temp-${Date.now()}`,
        sectionId: `section${updated.length + 1}`,
        title: "",
        description: "",
        subDescription: "",
      });
      setFormData({ ...formData, sections: updated });
    }}
    style={{
      marginBottom: "15px",
      padding: "10px 14px",
      background: "#000",
      color: "#fff",
      borderRadius: "6px",
      cursor:"pointer"
    }}
  >
    + Add Section
  </button>
)}
            </>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-empty">Page Settings content here...</div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="seo-card">
              <h3>SEO Settings</h3>

              <div className="seo-group">
                <label>Meta Title</label>
                <input
                  type="text"
                  value={formData?.seo?.metaTitle || ''}
                  onChange={(e) => handleSeoChange('metaTitle', e.target.value)}
                />
                <span className="char-count">
                  {(formData?.seo?.metaTitle?.length || 0)}/60 characters
                </span>
              </div>

              <div className="seo-group">
                <label>Meta Description</label>
                <textarea
                  rows={2}
                  value={formData?.seo?.metaDescription || ''}
                  onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
                ></textarea>
                <span className="char-count">
                  {(formData?.seo?.metaDescription?.length || 0)}/160 characters
                </span>
              </div>

              <div className="seo-group">
                <label>Open Graph Image</label>
                <div className="upload-box">
                  <input
                    type="text"
                    value={formData?.seo?.openGraphImage || ''}
                    onChange={(e) => handleSeoChange('openGraphImage', e.target.value)}
                    placeholder="Upload or paste image URL"
                  />
                  <label htmlFor="ogUpload" className="upload-btn">
                    <Upload size={15} /> Upload
                  </label>
                  <input
                    id="ogUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSeoFile(file);
                        handleSeoChange('openGraphImage', URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>

                {formData?.seo?.openGraphImage && (
                  <div className="image-preview">
                    <img src={formData.seo.openGraphImage} alt="Open Graph" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <aside className="edit-right">
          <div className="page-info">
            <h4>Page Info</h4>
            <div className="info-item">
              <span>Status</span>
              <strong>{pageStatus}</strong>
            </div>
            <div className="info-item">
              <span>Sections</span>
              <strong>{sections.length}</strong>
            </div>
            <div className="info-item">
              <span>Total Views</span>
              <strong>{viewsCount}</strong>
            </div>
            <div className="info-item">
              <span>Last Modified</span>
              <strong>{new Date(updatedAt).toLocaleString()}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditPage;

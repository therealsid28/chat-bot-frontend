// TrainingSection.tsx
"use client"
import React, { useState, ChangeEvent, FormEvent, useEffect, useCallback } from 'react';
import { getAuthFromLocalStorage } from '@/api/auth';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

const TABS = [
  { key: 'file', label: 'Document' },
  { key: 'text', label: 'Text' },
  { key: 'link', label: 'Website' },
];

const fetchUserFiles = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files?userId=${userId}`);
  const data = await res.json();
  if (res.ok) {
    return data.files;
  } else {
    throw new Error(data.message || 'Failed to fetch files');
  }
};

const TrainingSection: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; originalName?: string; url?: string; createdAt?: string }>>([]);
  const [activeTab, setActiveTab] = useState('file');
  const [link, setLink] = useState('');
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const auth = getAuthFromLocalStorage();
  const userId = auth?.user?._id || auth?.user?.id || '';

  const fetchAndSetUserFiles = useCallback(async () => {
    if (!userId) return;
    try {
      const files = await fetchUserFiles(userId);
      setUploadedFiles(files);
    } catch { }
  }, [userId]);

  // Filter files based on search query
  const filteredFiles = uploadedFiles.filter(file => 
    file.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (userId) {
      fetchAndSetUserFiles();
    }
  }, [userId, fetchAndSetUserFiles]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setMessage('');
      setError('');
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');
    setError('');
    const formData = new FormData();
    if (activeTab === 'file') {
      if (!files.length) {
        setError('Please select file(s) to upload.');
        setUploading(false);
        return;
      }
      files.forEach(file => formData.append('files', file));
    } else if (activeTab === 'link') {
      if (!link.trim()) {
        setError('Please enter a link to upload.');
        setUploading(false);
        return;
      }
      formData.append('link', link);
    } else if (activeTab === 'text') {
      if (!text.trim()) {
        setError('Please enter text to upload.');
        setUploading(false);
        return;
      }
      formData.append('text', text);
    }
    formData.append('userId', userId);
    try {
      let uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload-files`;
      let requestBody: FormData | string;
      let headers: Record<string, string> = {};

      if (activeTab === 'text') {
        uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/save-text`;
        requestBody = JSON.stringify({
          text: text,
          userId: userId
        });
        headers = {
          'Content-Type': 'application/json'
        };
      } else if (activeTab === 'link') {
        uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/save-website`;
        requestBody = JSON.stringify({
          url: link,
          userId: userId
        });
        headers = {
          'Content-Type': 'application/json'
        };
      } else {
        requestBody = formData;
      }

      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: requestBody,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Upload successful!');
        setFiles([]);
        setLink('');
        setText('');
        fetchAndSetUserFiles();
        setShowModal(false);
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch {
      setError('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    setDeletingId(fileId);
    try {
      const res = await fetch(`http://localhost:4001/api/v1/files/${fileId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUploadedFiles((prev) => prev.filter(f => f.id !== fileId));
      } else {
        // Optionally show error
      }
    } catch {
      // Optionally show error
    } finally {
      setDeletingId(null);
    }
  };

  // --- UI ---
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mx-auto my-8 bg-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col">
        {/* Title and Subtitle */}
        <div className="w-full text-center mb-8 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2 tracking-tight drop-shadow-lg">Training Portal</h1>
          <p className="text-lg md:text-xl text-blue-400 font-medium tracking-wide">Train your chatbot and manage the knowledge base.</p>
        </div>
        {/* Search Bar */}
        <div className="w-full flex items-center bg-white rounded-xl shadow-lg px-4 py-3 mb-6 border border-blue-200 mx-4">
          <svg className="w-6 h-6 text-blue-300 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
          <input 
            type="text" 
            placeholder="Search files and folders..." 
            className="flex-1 bg-transparent outline-none text-blue-900 text-lg placeholder:text-blue-300 font-medium tracking-wide" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="ml-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors" onClick={() => setShowModal(true)}><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></button>
        </div>
        {/* Breadcrumbs */}
        <div className="w-full px-4">
          <div className="bg-blue-100 rounded-lg px-6 py-3 text-blue-600 font-semibold text-lg tracking-wide">Uploaded Files</div>
        </div>
        {/* Empty State */}
        {uploadedFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 mt-12">
            <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-full p-8 mb-6 shadow-lg">
              <svg className="w-20 h-20 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2 tracking-tight drop-shadow">This folder is empty</h2>
            <p className="text-lg text-blue-400 mb-6 font-medium tracking-wide">Create a new folder or upload files to get started.</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 text-lg shadow-lg tracking-wide" onClick={() => setShowModal(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Upload Files
            </button>
          </div>
        )}
        {/* Search Results Empty State */}
        {uploadedFiles.length > 0 && filteredFiles.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center flex-1 mt-12">
            <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-full p-8 mb-6 shadow-lg">
              <svg className="w-20 h-20 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2 tracking-tight drop-shadow">No files found</h2>
            <p className="text-lg text-blue-400 mb-6 font-medium tracking-wide">No files match your search query &quot;{searchQuery}&quot;</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 text-lg shadow-lg tracking-wide" onClick={() => setSearchQuery('')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Clear Search
            </button>
          </div>
        )}
        {/* Uploaded Files Gallery */}
        {filteredFiles.length > 0 && (
          <div className="w-full bg-blue-100 rounded-3xl shadow-2xl p-6 border border-blue-200 mt-10 mx-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-y-auto p-4" style={{ maxHeight: '420px' }}>
              {filteredFiles.map((file) => {
                // Determine file type and icon
                let fileType = 'file';
                let icon = null;
                let iconBg = 'bg-blue-600';
                if (file.originalName?.match(/\.(pdf)$/i)) {
                  fileType = 'PDF';
                  icon = (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="24" x="2" y="2" rx="4" fill="#ef4444" /><text x="12" y="18" textAnchor="middle" fontSize="10" fill="white">PDF</text></svg>
                  );
                  iconBg = 'bg-red-500';
                } else if (file.originalName?.match(/\.(docx?|pptx?|xlsx?)$/i)) {
                  fileType = 'DOC';
                  icon = (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="24" x="2" y="2" rx="4" fill="#3b82f6" /><text x="12" y="18" textAnchor="middle" fontSize="10" fill="white">DOC</text></svg>
                  );
                  iconBg = 'bg-blue-500';
                } else if (file.originalName?.match(/\.(jpg|jpeg|png|gif)$/i)) {
                  fileType = 'IMG';
                  icon = (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f59e42" /><text x="12" y="18" textAnchor="middle" fontSize="10" fill="white">IMG</text></svg>
                  );
                  iconBg = 'bg-yellow-500';
                } else if (file.url) {
                  fileType = 'LINK';
                  icon = (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="24" x="2" y="2" rx="4" fill="#10b981" /><text x="12" y="18" textAnchor="middle" fontSize="10" fill="white">URL</text></svg>
                  );
                  iconBg = 'bg-green-500';
                } else if (file.originalName?.match(/\.(txt)$/i) || fileType === 'file') {
                  fileType = 'TXT';
                  icon = (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="24" x="2" y="2" rx="4" fill="#6366f1" /><text x="12" y="18" textAnchor="middle" fontSize="10" fill="white">TXT</text></svg>
                  );
                  iconBg = 'bg-indigo-500';
                }
                return (
                  <div
                    key={file.id}
                    className="relative bg-blue-50 rounded-2xl p-6 flex flex-col items-center shadow-xl border border-blue-200 transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl group"
                  >
                    <div className={`w-16 h-16 flex items-center justify-center rounded-full shadow-lg mb-3 transition-all duration-200 group-hover:scale-110 ${iconBg}`}>
                      {icon}
                    </div>
                    <div className="break-all text-center text-blue-700 text-sm font-semibold mb-1 tracking-wide line-clamp-2">
                      {file.originalName || fileType}
                    </div>
                    <div className="text-xs text-blue-400 mb-2 font-medium uppercase tracking-widest">{fileType}</div>
                    {/* <div className="text-purple-400 text-xs mb-3 font-medium tracking-wide">
                      {file.createdAt ? `Uploaded ${new Date(file.createdAt).toLocaleString()}` : ''}
                    </div> */}
                    <div className="flex gap-3 mt-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title="View"
                      >
                        <EyeIcon className="w-6 h-6" />
                      </a>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className={`p-2 rounded-full bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg transition-all duration-200 hover:from-red-500 hover:to-pink-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-200 ${deletingId === file.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                        title="Delete"
                        disabled={deletingId === file.id}
                      >
                        {deletingId === file.id ? (
                          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        ) : (
                          <TrashIcon className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white bg-black/40 px-2 py-1 rounded-lg pointer-events-none select-none">
                      {fileType}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-700 mb-6">Upload Content</h3>
            <div className="flex gap-4 mb-6">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-lg border-2 transition-all duration-200 ${activeTab === tab.key ? 'bg-blue-500 text-white border-blue-400 shadow-lg' : 'bg-blue-100 text-blue-500 hover:bg-blue-200 border-transparent'}`}
                  onClick={() => { setActiveTab(tab.key); setError(''); setMessage(''); }}
                  disabled={uploading}
                >
                  {tab.key === 'file' && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>}
                  {tab.key === 'text' && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M8 12h8m-8-4h8" /></svg>}
                  {tab.key === 'link' && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.07 7.07a4 4 0 010-5.656m3.656 3.656a4 4 0 01-5.656 0" /></svg>}
                  {tab.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleUpload} className="flex flex-col gap-6">
              {/* Drag and Drop Area */}
              <div className="border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center py-10 px-4 mb-2 bg-blue-50">
                {activeTab === 'file' && (
                  <>
                    <svg className="w-12 h-12 text-blue-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    <div className="text-lg text-blue-200 mb-1 font-semibold">Upload Files</div>
                    <div className="text-sm text-blue-300 mb-4 text-center">PDF, Word, Excel, Images, and other file types supported</div>
                    <div className="relative w-full">
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        multiple 
                        onChange={handleFileChange} 
                        disabled={uploading}
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx"
                      />
                      <div className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-lg shadow-lg transition-all duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Choose Files
                      </div>
                    </div>
                    {files.length > 0 && (
                      <div className="mt-4 w-full">
                        <div className="text-sm text-blue-200 mb-2 font-medium">Selected Files:</div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-blue-200 text-sm truncate">{file.name}</span>
                              </div>
                              <span className="text-blue-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'link' && (
                  <>
                    <svg className="w-12 h-12 text-blue-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.07 7.07a4 4 0 010-5.656m3.656 3.656a4 4 0 01-5.656 0" /></svg>
                    <div className="text-lg text-blue-200 mb-1 font-semibold">Website URL</div>
                    <div className="text-sm text-blue-300 mb-4 text-center">Enter a website URL to extract and process its content</div>
                    <input 
                      type="url" 
                      className="w-full rounded-lg bg-blue-50 border border-blue-200 p-3 text-blue-200 placeholder:text-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200" 
                      placeholder="https://example.com" 
                      value={link} 
                      onChange={e => setLink(e.target.value)} 
                      disabled={uploading} 
                    />
                  </>
                )}
                {activeTab === 'text' && (
                  <>
                    <svg className="w-12 h-12 text-blue-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M8 12h8m-8-4h8" />
                    </svg>
                    <div className="text-lg text-blue-200 mb-1 font-semibold">Text Content</div>
                    <div className="text-sm text-blue-300 mb-4 text-center">Paste or type your text content here</div>
                    <textarea 
                      className="w-full rounded-lg bg-blue-50 border border-blue-200 p-3 text-blue-200 placeholder:text-blue-400 min-h-[120px] resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200" 
                      placeholder="Enter your text content here..." 
                      value={text} 
                      onChange={e => setText(e.target.value)} 
                      disabled={uploading} 
                    />
                  </>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-2">
                <button type="button" className="text-blue-400 hover:underline text-lg" onClick={() => {setShowModal(false); setFiles([])}} disabled={uploading}>Cancel</button>
                <button type="submit" className={`px-6 py-2 rounded-lg font-bold text-lg shadow-lg transition-all duration-200 ${uploading ? 'bg-blue-200 text-blue-400 opacity-60 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
              </div>
              {message && <div className="text-green-500 font-semibold text-center">{message}</div>}
              {error && <div className="text-red-400 font-semibold text-center">{error}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingSection; 
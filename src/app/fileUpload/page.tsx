// FileUploadPage.tsx
"use client"
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { getAuthFromLocalStorage } from '@/api/auth';

// Helper to fetch files for a user
const fetchUserFiles = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files?userId=${userId}`);
  const data = await res.json();
  if (res.ok) {
    // data.files is an array of { id, originalName, url, fileType, status, createdAt }
    return data.files;
  } else {
    throw new Error(data.message || 'Failed to fetch files');
  }
};

const FileUploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]); // now array of file objects

  const auth = getAuthFromLocalStorage();
  const userId = auth?.user?._id || auth?.user?.id || '';

  // Fetch files for the user from backend
  const fetchAndSetUserFiles = async () => {
    if (!userId) return;
    try {
      const files = await fetchUserFiles(userId);
      setUploadedFiles(files);
    } catch (err) {
      // Ignore errors for now
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAndSetUserFiles();
    }
  }, [userId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setMessage('');
      setError('');
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!files.length) {
      setError('Please select file(s) to upload.');
      return;
    }
    setUploading(true);
    setMessage('');
    setError('');
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('userId', userId);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload-files`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('File(s) uploaded successfully!');
        setFiles([]);
        fetchAndSetUserFiles();
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch (err) {
      setError('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  // Helper to determine if a file is an image
  const isImage = (fileType: string) => {
    return /^(jpg|jpeg|png|gif|bmp|svg)$/i.test(fileType);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #18181b 0%, #23272f 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontFamily: 'Inter, sans-serif',
      padding: '2rem 0',
    }}>
      <form
        onSubmit={handleUpload}
        style={{
          background: '#222326',
          padding: '2.5rem 2rem',
          borderRadius: '1.5rem',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '400px',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', fontWeight: 700, letterSpacing: 1, fontSize: '1.5rem' }}>Upload Files</h2>
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            marginBottom: '1.5rem',
            color: '#fff',
            background: '#18181b',
            border: '1px solid #333',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            width: '100%',
          }}
          multiple
        />
        <button
          type="submit"
          disabled={uploading}
          style={{
            background: 'linear-gradient(90deg, #111 0%, #333 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.75rem 2rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: uploading ? 'not-allowed' : 'pointer',
            marginBottom: '1rem',
            transition: 'background 0.2s',
            boxShadow: uploading ? 'none' : '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <div style={{ color: '#4ade80', marginBottom: '0.5rem' }}>{message}</div>}
        {error && <div style={{ color: '#f87171', marginBottom: '0.5rem' }}>{error}</div>}
        <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '1rem' }}>
          Supported formats: PDF, DOCX, TXT, JPG, PNG, etc.<br/>
          <span style={{ color: '#fbbf24' }}>
            Note: Files are fetched from the backend for the current user.
          </span>
        </div>
      </form>

      <div style={{
        width: '90%',
        maxWidth: '900px',
        background: '#23272f',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.25)',
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: 1 }}>Uploaded Files Gallery</h3>
        {uploadedFiles.length === 0 ? (
          <div style={{ color: '#aaa', textAlign: 'center' }}>No files uploaded yet.</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
          }}>
            {uploadedFiles.map((file) => (
              <div key={file.id} style={{
                background: '#18181b',
                borderRadius: '0.75rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}>
                {isImage(file.fileType) ? (
                  <img
                    src={file.url}
                    alt={file.originalName}
                    style={{
                      width: '100%',
                      maxWidth: '120px',
                      maxHeight: '120px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem',
                      marginBottom: '0.75rem',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#333',
                    borderRadius: '0.5rem',
                    marginBottom: '0.75rem',
                    color: '#fff',
                    fontSize: '2rem',
                  }}>
                    <span role="img" aria-label="file">📄</span>
                  </div>
                )}
                <div style={{
                  wordBreak: 'break-all',
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  color: '#e5e5e5',
                }}>{file.originalName}</div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: '0.5rem',
                    color: '#60a5fa',
                    fontSize: '0.9rem',
                    textDecoration: 'underline',
                  }}
                >
                  View / Download
                </a>
                <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  {file.status} • {new Date(file.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadPage;
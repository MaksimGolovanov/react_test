// src/features/security-training/components/MarkdownViewer.jsx
import React from 'react';
import MDEditor from '@uiw/react-md-editor';

const MarkdownViewer = ({ content }) => {
  return (
    <div style={{ 
      width: '100%',
      maxWidth: '100%',
      overflowWrap: 'break-word'
    }}>
      <MDEditor.Markdown 
        source={content || ''} 
        style={{ 
          backgroundColor: 'transparent',
          padding: '0'
        }}
      />
    </div>
  );
};

export default MarkdownViewer;
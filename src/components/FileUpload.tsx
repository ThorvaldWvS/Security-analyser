import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, Mail } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  type: 'image' | 'email';
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, type }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: type === 'image' 
      ? { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }
      : { 'text/*': ['.txt', '.eml'] }
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center">
        {type === 'image' ? <Image className="w-12 h-12 text-indigo-500 mb-4" /> : 
                           <Mail className="w-12 h-12 text-indigo-500 mb-4" />}
        <p className="text-lg font-medium text-gray-700">
          {isDragActive ? 'Drop the file here' : 'Drag & drop or click to select'}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          {type === 'image' ? 'Supports PNG, JPG, GIF' : 'Supports TXT, EML'}
        </p>
      </div>
    </div>
  );
};
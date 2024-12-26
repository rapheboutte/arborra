"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, Trash2 } from 'lucide-react'
import mammoth from 'mammoth';

interface Document {
  id: number;
  name: string;
  uploadedBy: string;
  dateUploaded: string;
  lastModified: string;
  content: File;
  tags: string[];
  metadata: {
    owner: string;
    description: string;
    category: string;
    version: string;
  };
}

// Mock data
const initialDocuments: Document[] = [];

export default function DocumentRepository() {
  const [dragActive, setDragActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [uploadedDocuments, setUploadedDocuments] = useState(initialDocuments)
  const [documentContent, setDocumentContent] = useState<string | null>(null)
  const [ownerInput, setOwnerInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [versionInput, setVersionInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [stagingFiles, setStagingFiles] = useState<Document[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log("File(s) dropped")
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const reader = new FileReader();
        reader.onload = async (e) => {
          console.log('Reading .docx file');
          const arrayBuffer = e.target?.result;
          if (arrayBuffer) {
            try {
              const result = await mammoth.extractRawText({ arrayBuffer });
              console.log('Extracted text:', result.value);
              setDocumentContent(result.value);
            } catch (error) {
              console.error('Error processing .docx file:', error);
              setDocumentContent('Error processing document.');
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocumentContent(e.target?.result as string);
        };
        reader.readAsText(file);
      }

      const newDocument = {
        id: uploadedDocuments.length + index + 1,
        name: file.name,
        uploadedBy: "Current User",
        dateUploaded: new Date().toISOString().split('T')[0],
        lastModified: new Date(file.lastModified).toISOString().split('T')[0],
        content: file,
        tags: tagsInput.split(',').map(tag => tag.trim()),
        metadata: {
          owner: ownerInput,
          description: descriptionInput,
          category: categoryInput,
          version: versionInput,
        },
      };
      setUploadedDocuments((prev) => [...prev, newDocument]);
    });
    setTagsInput('');
    setOwnerInput('');
    setDescriptionInput('');
    setCategoryInput('');
    setVersionInput('');
  };

  const handleFileStaging = (files: FileList) => {
    const stagedFiles = Array.from(files).map((file, index) => ({
      id: stagingFiles.length + index + 1,
      name: file.name,
      uploadedBy: "Current User",
      dateUploaded: new Date().toISOString().split('T')[0],
      lastModified: new Date(file.lastModified).toISOString().split('T')[0],
      content: file,
      tags: [],
      metadata: {
        owner: ownerInput,
        description: descriptionInput,
        category: categoryInput,
        version: versionInput,
      },
    }));
    setStagingFiles((prev) => [...prev, ...stagedFiles]);
    setOwnerInput('');
    setDescriptionInput('');
    setCategoryInput('');
    setVersionInput('');
  };

  const confirmUpload = (file: Document) => {
    setUploadedDocuments((prev) => [...prev, file]);
    setStagingFiles((prev) => prev.filter((f) => f.id !== file.id));
    setSelectedDocument(null);
    setDocumentContent(null);
  };

  const handlePreview = (doc: any) => {
    const file = uploadedDocuments.find((d) => d.id === doc.id);
    if (file) {
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocumentContent(e.target?.result as string);
        };
        reader.readAsText(file.content);
      } else if (file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result;
          if (arrayBuffer) {
            try {
              const result = await mammoth.extractRawText({ arrayBuffer });
              setDocumentContent(result.value);
            } catch (error) {
              console.error('Error processing .docx file:', error);
              setDocumentContent('Error processing document.');
            }
          }
        };
        reader.readAsArrayBuffer(file.content);
      } else {
        setDocumentContent('Preview not available for this file type.');
      }
    }
    setSelectedDocument(doc);
  };

  const handleDelete = (id: number) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== id));
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
      setDocumentContent(null);
    }
  };

  const filteredDocuments = uploadedDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    doc.metadata.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.metadata.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.metadata.version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Document Repository</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search documents..."
          className="w-full p-2 border border-gray-300 rounded"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="flex">
        <div className="w-2/3 pr-4">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>Drag and drop your files here or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drag and drop your files here, or click to select files</p>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileStaging(e.target.files);
                    }
                  }}
                />
                <Button className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>Browse Files</Button>
              </div>
              <div className="mb-4">
                {stagingFiles.map((file) => (
                  <div key={file.id} className="border p-4 mb-2 rounded">
                    <p className="font-semibold">{file.name}</p>
                    <input
                      type="text"
                      placeholder="Document Owner"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      value={file.metadata.owner}
                      onChange={(e) => {
                        const updatedOwner = e.target.value;
                        setStagingFiles((prev) => prev.map(f => f.id === file.id ? { ...f, metadata: { ...f.metadata, owner: updatedOwner } } : f));
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      value={file.metadata.description}
                      onChange={(e) => {
                        const updatedDescription = e.target.value;
                        setStagingFiles((prev) => prev.map(f => f.id === file.id ? { ...f, metadata: { ...f.metadata, description: updatedDescription } } : f));
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      value={file.metadata.category}
                      onChange={(e) => {
                        const updatedCategory = e.target.value;
                        setStagingFiles((prev) => prev.map(f => f.id === file.id ? { ...f, metadata: { ...f.metadata, category: updatedCategory } } : f));
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Version"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      value={file.metadata.version}
                      onChange={(e) => {
                        const updatedVersion = e.target.value;
                        setStagingFiles((prev) => prev.map(f => f.id === file.id ? { ...f, metadata: { ...f.metadata, version: updatedVersion } } : f));
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter tags, separated by commas"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      value={file.tags.join(', ')}
                      onChange={(e) => {
                        const updatedTags = e.target.value.split(',').map(tag => tag.trim());
                        setStagingFiles((prev) => prev.map(f => f.id === file.id ? { ...f, tags: updatedTags } : f));
                      }}
                    />
                    <Button onClick={() => confirmUpload(file)} className="bg-blue-500 text-white">Confirm Upload</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id} onClick={() => handlePreview(doc)} className="cursor-pointer">
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell>{doc.dateUploaded}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" className="mr-2">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="w-1/3">
          {selectedDocument && (
            <Card>
              <CardHeader>
                <CardTitle>Preview: {selectedDocument.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Last Modified: {selectedDocument.lastModified}</p>
                <p>Uploaded By: {selectedDocument.uploadedBy}</p>
                <p>Tags: {selectedDocument.tags.join(', ')}</p>
                <p>Owner: {selectedDocument.metadata.owner}</p>
                <p>Description: {selectedDocument.metadata.description}</p>
                <p>Category: {selectedDocument.metadata.category}</p>
                <p>Version: {selectedDocument.metadata.version}</p>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Content:</h3>
                  <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-48 whitespace-pre-wrap">{documentContent}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

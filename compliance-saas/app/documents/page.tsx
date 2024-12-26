"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, Trash2, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import mammoth from 'mammoth'
import { toast } from "sonner"
import { analyzeDocument } from '@/lib/compliance/documentAnalysis';

interface Document {
  id: number
  name: string
  uploadedBy: string
  dateUploaded: string
  lastModified: string
  content: File
  tags: string[]
  metadata: {
    owner: string
    description: string
    category: string
    version: string
    framework: string
    status: 'current' | 'needs_review' | 'expired'
    nextReviewDate: string
    complianceScore: number
    validationResults: {
      passed: Array<{
        id: string
        requirement: string
        description: string
        status: string
        severity: string
        details?: string
      }>;
      failed: Array<{
        id: string
        requirement: string
        description: string
        status: string
        severity: string
        details?: string
      }>;
    }
  }
}

const COMPLIANCE_FRAMEWORKS = [
  { id: 'gdpr', name: 'GDPR', color: 'blue' },
  { id: 'hipaa', name: 'HIPAA', color: 'green' },
  { id: 'sox', name: 'SOX', color: 'purple' },
  { id: 'iso27001', name: 'ISO 27001', color: 'orange' }
]

const DOCUMENT_TEMPLATES = [
  {
    id: 1,
    name: 'Privacy Policy',
    framework: 'gdpr',
    description: 'Standard GDPR-compliant privacy policy template'
  },
  {
    id: 2,
    name: 'Data Processing Agreement',
    framework: 'gdpr',
    description: 'Template for processing agreements with third parties'
  },
  {
    id: 3,
    name: 'DPIA Template',
    framework: 'gdpr',
    description: 'Data Protection Impact Assessment template'
  },
  {
    id: 4,
    name: 'Incident Response Plan',
    framework: 'hipaa',
    description: 'HIPAA-compliant incident response procedure template'
  }
]

// Mock data
const initialDocuments: Document[] = [];

export default function DocumentRepository() {
  const [activeTab, setActiveTab] = useState('all')
  const [dragActive, setDragActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([])
  const [documentContent, setDocumentContent] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    console.log("Current uploaded documents:", uploadedDocuments)
  }, [uploadedDocuments])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileStaging(e.dataTransfer.files)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFileStaging = async (files: FileList) => {
    try {
      setIsUploading(true);
      toast.info(`Processing ${files.length} document(s)...`);

      const stagedFiles = await Promise.all(Array.from(files).map(async (file, index) => {
        let content = '';
        try {
          if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const buffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: buffer });
            content = result.value;
          } else {
            content = await file.text();
          }

          const analysis = await analyzeDocument(content, file.name);

          const newDocument = {
            id: uploadedDocuments.length + index + 1,
            name: file.name,
            uploadedBy: "Current User",
            dateUploaded: new Date().toISOString().split('T')[0],
            lastModified: analysis.metadata.lastModified,
            content: file,
            tags: [],
            metadata: {
              owner: analysis.metadata.author,
              description: '',
              category: analysis.metadata.documentType,
              version: analysis.metadata.version,
              framework: analysis.framework,
              status: analysis.status,
              nextReviewDate: analysis.nextReviewDate,
              complianceScore: analysis.complianceScore,
              validationResults: analysis.validationResults
            }
          };

          return newDocument;
        } catch (error) {
          console.error("Error reading file:", error);
          toast.error(`Error processing ${file.name}`);
          return null;
        }
      }));

      // Filter out any null values from failed uploads
      const validFiles = stagedFiles.filter((file): file is Document => file !== null);

      if (validFiles.length > 0) {
        setUploadedDocuments(prev => {
          const newDocs = [...prev, ...validFiles];
          console.log("Updated documents:", newDocs);
          return newDocs;
        });
        toast.success(`Successfully uploaded ${validFiles.length} document(s)`);
      }

    } catch (error) {
      console.error("Error in handleFileStaging:", error);
      toast.error("Error uploading documents");
    } finally {
      setIsUploading(false);
    }
  }

  const handleDownload = (e: React.MouseEvent, doc: Document) => {
    e.stopPropagation(); // Prevent row selection
    const url = window.URL.createObjectURL(doc.content);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success(`Downloading ${doc.name}`);
  };

  const handleDelete = (e: React.MouseEvent, docId: number) => {
    e.stopPropagation(); // Prevent row selection
    setUploadedDocuments(prev => {
      const newDocs = prev.filter(doc => doc.id !== docId);
      if (selectedDocument?.id === docId) {
        setSelectedDocument(null);
      }
      return newDocs;
    });
    toast.success('Document deleted');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Current
        </Badge>
      case 'needs_review':
        return <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Needs Review
        </Badge>
      case 'expired':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Expired
        </Badge>
      default:
        return null
    }
  }

  const getFrameworkBadge = (framework: string) => {
    const fw = COMPLIANCE_FRAMEWORKS.find(f => f.id === framework)
    return fw ? (
      <Badge variant="outline" className={`text-${fw.color}-600 border-${fw.color}-600`}>
        {fw.name}
      </Badge>
    ) : null
  }

  const filteredDocuments = uploadedDocuments.filter((doc) => {
    if (activeTab !== 'all' && doc.metadata.framework !== activeTab) return false
    
    return (
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.metadata.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.metadata.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Document Repository</h1>
        <Button onClick={() => document.getElementById('file-upload')?.click()}>
          <Upload className="h-4 w-4 mr-2" /> Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {uploadedDocuments.length}
            </CardTitle>
            <CardDescription>Total Documents</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-600">
              {uploadedDocuments.filter(d => d.metadata.status === 'current').length}
            </CardTitle>
            <CardDescription>Current</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-yellow-600">
              {uploadedDocuments.filter(d => d.metadata.status === 'needs_review').length}
            </CardTitle>
            <CardDescription>Needs Review</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-600">
              {uploadedDocuments.filter(d => d.metadata.status === 'expired').length}
            </CardTitle>
            <CardDescription>Expired</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Documents ({uploadedDocuments.length})</CardTitle>
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-64 px-3 py-1 border rounded-md"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  {COMPLIANCE_FRAMEWORKS.map(framework => (
                    <TabsTrigger key={framework.id} value={framework.id}>
                      {framework.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Document</TableHead>
                    <TableHead className="w-[120px]">Framework</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[150px]">Compliance Score</TableHead>
                    <TableHead className="w-[120px]">Review Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        No documents uploaded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedDocument(doc)}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            {doc.name}
                          </div>
                        </TableCell>
                        <TableCell>{getFrameworkBadge(doc.metadata.framework)}</TableCell>
                        <TableCell>{getStatusBadge(doc.metadata.status)}</TableCell>
                        <TableCell>
                          <div className="w-full">
                            <Progress value={doc.metadata.complianceScore} className="h-2" />
                            <span className="text-sm text-gray-500">{doc.metadata.complianceScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{doc.metadata.nextReviewDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => handleDownload(e, doc)}
                              title="Download document"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => handleDelete(e, doc.id)}
                              title="Delete document"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>Drag and drop or click to upload</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => e.target.files && handleFileStaging(e.target.files)}
                  disabled={isUploading}
                />
                <Upload className={`mx-auto h-8 w-8 ${isUploading ? "text-gray-300" : "text-gray-400"}`} />
                <p className="mt-2 text-sm text-gray-600">
                  {isUploading ? "Processing documents..." : "Drop your files here or click to browse"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Start with pre-approved templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DOCUMENT_TEMPLATES.map(template => (
                  <div key={template.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                      {getFrameworkBadge(template.framework)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedDocument && (
            <Card>
              <CardHeader>
                <CardTitle>Document Details</CardTitle>
                <CardDescription>{selectedDocument.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Validation Results</h3>
                  <div className="space-y-2">
                    {selectedDocument.metadata.validationResults.passed.map((result) => (
                      <div key={result.id} className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <div>
                          <p className="font-medium">{result.requirement}</p>
                          <p className="text-gray-600">{result.details}</p>
                        </div>
                      </div>
                    ))}
                    {selectedDocument.metadata.validationResults.failed.map((result) => (
                      <div key={result.id} className="flex items-center text-red-600 text-sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <div>
                          <p className="font-medium">{result.requirement}</p>
                          <p className="text-gray-600">{result.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Metadata</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Owner:</span> {selectedDocument.metadata.owner}</p>
                    <p><span className="text-gray-500">Category:</span> {selectedDocument.metadata.category}</p>
                    <p><span className="text-gray-500">Version:</span> {selectedDocument.metadata.version}</p>
                    <p><span className="text-gray-500">Last Modified:</span> {selectedDocument.lastModified}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, Trash2 } from 'lucide-react'

// Mock data
const documents = [
  { id: 1, name: "Q2 Report.pdf", uploadedBy: "John Doe", dateUploaded: "2023-06-15" },
  { id: 2, name: "Privacy Policy.docx", uploadedBy: "Jane Smith", dateUploaded: "2023-05-20" },
  { id: 3, name: "Security Audit Results.xlsx", uploadedBy: "Mike Johnson", dateUploaded: "2023-07-01" },
]

export default function DocumentRepository() {
  const [dragActive, setDragActive] = useState(false)

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Document Repository</h1>

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
            />
            <Button className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
              Browse Files
            </Button>
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
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.name}</TableCell>
              <TableCell>{doc.uploadedBy}</TableCell>
              <TableCell>{doc.dateUploaded}</TableCell>
              <TableCell>
                <Button variant="outline" size="icon" className="mr-2">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


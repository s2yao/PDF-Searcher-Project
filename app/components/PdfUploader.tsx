// app/components/PdfUploader.tsx
import React from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Upload } from "lucide-react";

// Importing supabase client
import supabase from "../utils/supabase";

interface PdfUploaderProps {
  onFileUpload: (file: File) => void;
  pdfUploaded: boolean;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({
  onFileUpload,
  pdfUploaded,
}) => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) { // if there are files selected in the input
      const file = event.target.files[0];
      if (!file) return;
      

      const {data, error} = await supabase.storage.from('pdf_store').upload
        (`pdf_store_${Date.now()}.pdf`, file);

      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload PDF.');
      } else {
        alert('File uploaded to supabase successfully!');
        onFileUpload(file);  // Now passing the file and URL
      }
    }
  };


  return (
    <div className="text-center">
      <Input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
        id="pdf-upload"
      />
      <label htmlFor="pdf-upload">
        <Button as="span" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          {pdfUploaded ? "PDF Uploaded" : "Upload PDF"}
        </Button>
      </label>
    </div>
  );
};

export default PdfUploader;

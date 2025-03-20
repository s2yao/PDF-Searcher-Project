// app/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { StoredHighlight } from "./types";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_KEY environment variables are not set."
  );
}
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// So that the rest of the code don't fetch the entire supabase every time
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export const saveHighlight = async (highlight: StoredHighlight) => {
  const { error } = await supabaseClient.from("highlights").insert(highlight);
  if (error) {
    throw error;
  }
  return null;
};

export const saveBulkHighlights = async (highlights: StoredHighlight[]) => {
  const { error } = await supabaseClient.from("highlights").upsert(highlights);
  if (error) {
    throw error;
  }
  return null;
};

export const getHighlightsForPdf = async (pdfId: string) => {
  const { data, error } = await supabaseClient
    .from("highlights")
    .select()
    .eq("pdfId", pdfId);
  if (data && data.length > 0) {
    return data;
  }
  if (error) {
    throw error;
  }
  return null;
};

export const updateHighlight = async (
  id: string,
  updatedData: Partial<StoredHighlight>
) => {
  return null;
};

export const deleteHighlight = async (id: string) => {
  const { error } = await supabaseClient
    .from("highlights")
    .delete()
    .eq("id", id);
  if (error) {
    throw error;
  }
  return null;
};

// BONUS CHALLENGE: Implement a method to export highlights to a JSON file
// async exportToJson(pdfId: string, filePath: string): Promise<void> {
// // Retrieve highlights and write to a JSON file
// }
// async function exportToJson(pdfId: string, filePath: string): Promise<void> {
//   // Ensure this code runs only on the server side
//   if (typeof window === 'undefined') {
//     const fs = require('fs').promises;
//     const { createClient } = require('@supabase/supabase-js');

//     const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Supabase URL
//     const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase anon key

//     const supabaseClient = createClient(supabaseUrl, supabaseKey);


//     // Example usage:
//     // exportToJson('your-pdf-id', './highlights.json');
//   }

// }



if (typeof window === 'undefined') {  // This checks if the code is running on the server
  const fs = require('fs');
  const exportToJson = async (pdfId: string, filePath: string) => {
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabaseClient
      .from("highlights")
      .select()
      .eq("pdfId", pdfId);
    if (data && data.length > 0) {
      fs.writeFile(filePath, JSON.stringify(data), (error: NodeJS.ErrnoException | null) => {
        if (error) {
          throw error;
        }
      });
    }
    if (error) {
      throw error;
    }
    return null;
  };
}


// BONUS CHALLENGE: Implement a method to import highlights from a JSON file
// async importFromJson(filePath: string): Promise<void> {
// Read from JSON file and insert highlights into the database
// }

// async function importFromJson(filePath: string): Promise<void> {
//   if (typeof window === 'undefined') {
//     const fs = require('fs').promises;
//     const { createClient } = require('@supabase/supabase-js');
  
//     const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Supabase URL
//     const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase anon key
  
//     const supabaseClient = createClient(supabaseUrl, supabaseKey);
  
//     // Example usage:
//     // importFromJson('./highlights.json');
//   }  
// }


if (typeof window === 'undefined') {  // This checks if the code is running on the server
  const fs = require('fs');
  const importFromJson = async (pdfId: string, filePath: string) => {
    fs.readFile(filePath, "utf-8", (error: NodeJS.ErrnoException | null, data: string) => {
      if (error) {
        throw error;
      }
      const highlights = JSON.parse(data);
      saveBulkHighlights(highlights);
    });
    return null;
  }
};


export default supabaseClient;

export async function extractPdfPages(fileUrl: string, startPage: number, endPage: number): Promise<string> {
  try {
    const { pdfjs } = require('react-pdf');
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    const loadingTask = pdfjs.getDocument(fileUrl);
    const pdf = await loadingTask.promise;
    let fullText = "";

    // Bound checks
    const start = Math.max(1, Math.min(startPage, endPage));
    const end = Math.min(pdf.numPages, Math.max(startPage, endPage));

    for (let pageNum = start; pageNum <= end; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text items
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
        
      fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
    }

    return fullText;
  } catch (error) {
    console.error("Failed to extract PDF text:", error);
    throw new Error("Failed to extract text from the PDF. Make sure the file is accessible.");
  }
}

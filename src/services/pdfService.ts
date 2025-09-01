
// This leverages the jsPDF and html2canvas libraries loaded from the CDN in index.html
declare const jspdf: any;
declare const html2canvas: any;

export const exportToPdf = async (elementId: string, fileName: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }
  
  // Temporarily remove hidden elements for better PDF output
  const hiddenElements = input.querySelectorAll('.no-print');
  hiddenElements.forEach(el => (el as HTMLElement).style.display = 'none');

  try {
    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;

    const imgWidth = pdfWidth - 20; // with margin
    const imgHeight = imgWidth / ratio;
    
    let heightLeft = imgHeight;
    let position = 10; // top margin

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 20);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);
    }

    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    // Restore hidden elements
    hiddenElements.forEach(el => (el as HTMLElement).style.display = '');
  }
};

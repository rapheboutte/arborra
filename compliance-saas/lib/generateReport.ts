import { jsPDF } from 'jspdf';

interface ComplianceData {
  score: number;
  trend: number;
}

interface ReportData {
  date: string;
  company: string;
  frameworks: {
    [key: string]: {
      score: number;
      status: string;
    };
  };
}

const getStatusColor = (score: number): [number, number, number] => {
  if (score >= 80) return [34, 197, 94]; // green
  if (score >= 60) return [234, 179, 8]; // yellow
  return [239, 68, 68]; // red
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const generatePDFReport = async (data: ReportData): Promise<Blob> => {
  // Create a document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Add logo/header background
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add header background
  doc.setFillColor(248, 250, 252); // Light gray background
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Add accent line
  doc.setFillColor(59, 130, 246); // Blue accent
  doc.rect(0, 50, pageWidth, 2, 'F');

  // Set initial position
  let y = 30;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Add the header
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39); // Dark gray
  doc.text('Compliance Report', pageWidth / 2, y, { align: 'center' });
  y += 40;

  // Add company info and date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99); // Medium gray
  const dateText = `Generated on: ${formatDate(data.date)}`;
  const companyText = `Company: ${data.company}`;
  doc.text(dateText, pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.text(companyText, pageWidth / 2, y, { align: 'center' });
  y += 25;

  // Calculate overall score
  const overallScore = Math.round(
    Object.values(data.frameworks).reduce((acc, curr) => acc + curr.score, 0) /
    Object.keys(data.frameworks).length
  );

  // Add overall score section
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Overall Compliance Score', pageWidth / 2, y, { align: 'center' });
  y += 20;

  // Draw score circle with fill
  const circleX = pageWidth / 2;
  const circleRadius = 18;
  const [r, g, b] = getStatusColor(overallScore);
  
  // Draw filled circle
  doc.setFillColor(r, g, b, 0.1); // Light fill
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(1);
  doc.circle(circleX, y, circleRadius, 'FD');
  
  // Add score text
  doc.setFontSize(24);
  doc.setTextColor(r, g, b);
  doc.setFont('helvetica', 'bold');
  doc.text(`${overallScore}%`, circleX, y + 2, { align: 'center' });
  y += 35;

  // Framework Details Section
  doc.setFillColor(248, 250, 252); // Light gray background
  doc.rect(margin - 5, y - 5, contentWidth + 10, 20, 'F');
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Framework Details', margin, y + 8);
  y += 25;

  // Table headers
  const colWidths = [60, 40, 50];
  doc.setFillColor(243, 244, 246); // Lighter gray for table header
  doc.rect(margin - 5, y - 5, contentWidth + 10, 12, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Framework', margin, y);
  doc.text('Score', margin + colWidths[0], y);
  doc.text('Status', margin + colWidths[0] + colWidths[1], y);
  y += 12;

  // Table rows with alternating backgrounds
  doc.setFont('helvetica', 'normal');
  Object.entries(data.frameworks).forEach(([framework, { score, status }], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin - 5, y - 5, contentWidth + 10, 10, 'F');
    }
    
    doc.setTextColor(31, 41, 55); // Dark gray for framework
    doc.text(framework, margin, y);
    doc.text(`${score}%`, margin + colWidths[0], y);
    
    const [r, g, b] = getStatusColor(score);
    doc.setTextColor(r, g, b);
    doc.text(status, margin + colWidths[0] + colWidths[1], y);
    
    y += 10;
  });
  y += 10;

  // Recommendations Section
  doc.setFillColor(248, 250, 252);
  doc.rect(margin - 5, y - 5, contentWidth + 10, 20, 'F');
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Recommendations', margin, y + 8);
  y += 25;

  // Add recommendations with bullet points and better formatting
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  
  Object.entries(data.frameworks)
    .filter(([_, { score }]) => score < 80)
    .forEach(([framework, { score }]) => {
      const recommendation = score < 60
        ? `Urgent attention required. Schedule a compliance review and implement required controls.`
        : `Review and update compliance controls to achieve full compliance.`;
      
      // Add bullet point
      doc.text('•', margin, y);
      
      // Framework name in bold
      doc.setFont('helvetica', 'bold');
      doc.text(`${framework}: `, margin + 5, y);
      
      // Recommendation text
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(recommendation, contentWidth - 25);
      doc.text(lines, margin + 5 + doc.getTextWidth(`${framework}: `), y);
      
      y += lines.length * 6 + 4;
    });

  // Add footer with accent line
  doc.setFillColor(59, 130, 246);
  doc.rect(0, pageHeight - 20, pageWidth, 1, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  const footerText = 'Generated by Arborra Compliance Platform';
  doc.text(
    footerText,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Return as blob
  return doc.output('blob');
};

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalysisResult } from './geminiService';

export const generateAnalysisPDF = (result: AnalysisResult, userName: string) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Colors
  const primaryColor = [99, 102, 241]; // Indigo-500
  const secondaryColor = [168, 85, 247]; // Purple-500
  const textColor = [31, 41, 55];
  const lightTextColor = [107, 114, 128];

  // Header
  doc.setFillColor(15, 23, 42); // Dark background for header
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TalentScope Analysis', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report for: ${userName}`, 20, 28);
  doc.text(`Date: ${date}`, 160, 28);

  // ATS Score Section
  let yPos = 55;
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ATS Score & Summary', 20, yPos);
  
  yPos += 10;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(20, yPos, 170, 35, 3, 3, 'F');
  
  doc.setFontSize(32);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${result.atsScore}%`, 35, yPos + 22);
  
  doc.setFontSize(10);
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(result.summary, 120);
  doc.text(summaryLines, 65, yPos + 10);

  // Strength Analysis
  yPos += 50;
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Strength Analysis', 20, yPos);
  
  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['Category', 'Score']],
    body: [
      ['Keyword Density', `${result.strengthAnalysis.keywordDensity}%`],
      ['Format Compliance', `${result.strengthAnalysis.formatCompliance}%`],
      ['Role Relevance', `${result.strengthAnalysis.roleRelevance}%`],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor as [number, number, number] },
    margin: { left: 20, right: 20 },
  });

  // Skills
  yPos = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Extracted Skills', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  const skillsText = result.skills.join(' • ');
  const skillsLines = doc.splitTextToSize(skillsText, 170);
  doc.text(skillsLines, 20, yPos);
  
  yPos += (skillsLines.length * 5) + 10;

  // AI Optimization
  if (yPos > 240) { doc.addPage(); yPos = 20; }
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Optimization Preview', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(239, 68, 68); // Red
  doc.text('Before (Weak):', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
  const beforeLines = doc.splitTextToSize(`"${result.optimization.before}"`, 170);
  doc.text(beforeLines, 20, yPos);
  
  yPos += (beforeLines.length * 5) + 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('AI Enhanced (Strong):', 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  const afterLines = doc.splitTextToSize(`"${result.optimization.after}"`, 170);
  doc.text(afterLines, 20, yPos);

  // Skill Gaps
  yPos += (afterLines.length * 5) + 15;
  if (yPos > 240) { doc.addPage(); yPos = 20; }
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Skill Gap Analysis', 20, yPos);
  
  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    body: result.skillGaps.map(gap => [gap]),
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', textColor: [220, 38, 38] } },
    margin: { left: 20 },
  });

  // Top Role Matches
  yPos = (doc as any).lastAutoTable.finalY + 15;
  if (yPos > 220) { doc.addPage(); yPos = 20; }
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Top Role Matches', 20, yPos);
  
  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['Role', 'Company', 'Match']],
    body: result.jobMatches.map(job => [job.role, job.company, `${job.match}%`]),
    headStyles: { fillColor: secondaryColor as [number, number, number] },
    margin: { left: 20, right: 20 },
  });

  // Roadmap
  yPos = (doc as any).lastAutoTable.finalY + 15;
  if (yPos > 200) { doc.addPage(); yPos = 20; }
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Upskilling Roadmap', 20, yPos);
  
  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['Phase', 'Duration', 'Description']],
    body: result.roadmap.map(step => [step.title, step.duration, step.description]),
    headStyles: { fillColor: primaryColor as [number, number, number] },
    margin: { left: 20, right: 20 },
  });

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`TalentScope AI - Powered by Gemini Intelligence - Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }

  doc.save(`TalentScope_Analysis_${userName.replace(/\s+/g, '_')}.pdf`);
};

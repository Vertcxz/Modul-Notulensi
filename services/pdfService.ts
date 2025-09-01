declare const jspdf: any;

import { Meeting, ActionItem, Attachment } from '../types';

export const exportToPdf = (meeting: Meeting, fileName:string) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const MARGIN = 15;
    const PAGE_WIDTH = doc.internal.pageSize.getWidth();
    const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
    const PRIMARY_COLOR = '#3b82f6';

    let y = MARGIN;

    const checkPageBreak = (spaceNeeded: number) => {
        if (y + spaceNeeded > PAGE_HEIGHT - MARGIN) {
            addFooter();
            doc.addPage();
            y = MARGIN;
        }
    };
    
    const addFooter = () => {
        // This is a placeholder; actual footer is added at the end for total page count
    };

    // --- HEADER ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor('#111827');
    doc.text('Notulensi Rapat', MARGIN, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor('#374151');
    const titleLines = doc.splitTextToSize(meeting.title, CONTENT_WIDTH);
    doc.text(titleLines, MARGIN, y);
    y += titleLines.length * 5 + 4;

    doc.setDrawColor(PRIMARY_COLOR);
    doc.setLineWidth(0.8);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 10;

    // --- MEETING DETAILS ---
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const details = [
        { label: 'Tanggal', value: formatDate(meeting.date) }, { label: 'Waktu', value: `${meeting.startTime} - ${meeting.endTime}` },
        { label: 'Lokasi', value: meeting.location }, { label: 'Notulis', value: meeting.notulis.name },
    ];
    doc.setFontSize(10);
    let detailStartY = y;
    details.forEach((detail, index) => {
        const x = MARGIN + (index % 2) * 95;
        const currentY = detailStartY + Math.floor(index / 2) * 7;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#6B7280');
        doc.text(`${detail.label}:`, x, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#1F2937');
        doc.text(detail.value, x + 25, currentY);
    });
    y += Math.ceil(details.length / 2) * 7 + 8;


    const addSectionTitle = (title: string) => {
        checkPageBreak(15);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#111827');
        doc.text(title, MARGIN, y);
        y += 8;
    };
    
    // --- SUMMARY ---
    if (meeting.minutes?.summary) {
        addSectionTitle('Ringkasan Rapat');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#374151');
        const summaryLines = doc.splitTextToSize(meeting.minutes.summary, CONTENT_WIDTH);
        checkPageBreak(summaryLines.length * 5 * 1.5);
        doc.text(summaryLines, MARGIN, y, { lineHeightFactor: 1.5 });
        y += summaryLines.length * 5 * 1.5 + 5;
    }
    
    // --- PARTICIPANTS ---
    addSectionTitle('Peserta');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151');
    meeting.participants.forEach((p, i) => {
        checkPageBreak(6);
        doc.text(`${i + 1}. ${p.name}`, MARGIN, y);
        y += 6;
    });
    y += 5;

    // --- ACTION PLAN TABLE ---
    if (meeting.minutes?.actionItems && meeting.minutes.actionItems.length > 0) {
        addSectionTitle('Rencana Aksi');
        
        const colWidths = [80, 30, 35, 35];
        const colStarts = [MARGIN, MARGIN + colWidths[0], MARGIN + colWidths[0] + colWidths[1], MARGIN + colWidths[0] + colWidths[1] + colWidths[2]];
        
        // Header
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setFillColor(230, 230, 230);
        doc.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F');
        doc.text('Tugas', colStarts[0] + 2, y + 5.5);
        doc.text('PIC', colStarts[1] + 2, y + 5.5);
        doc.text('Batas Waktu', colStarts[2] + 2, y + 5.5);
        doc.text('Status', colStarts[3] + 2, y + 5.5);
        y += 8;

        // Body
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        meeting.minutes.actionItems.forEach((item: ActionItem) => {
            const taskLines = doc.splitTextToSize(item.task, colWidths[0] - 4);
            const picLines = doc.splitTextToSize(item.pic.name, colWidths[1] - 4);
            const deadlineLines = doc.splitTextToSize(item.deadline, colWidths[2] - 4);
            const statusLines = doc.splitTextToSize(item.status, colWidths[3] - 4);
            
            const rowHeight = Math.max(taskLines.length, picLines.length, deadlineLines.length, statusLines.length) * 5 + 4;
            
            checkPageBreak(rowHeight);
            doc.setDrawColor(220, 220, 220);
            doc.line(MARGIN, y + rowHeight, PAGE_WIDTH - MARGIN, y + rowHeight);

            doc.text(taskLines, colStarts[0] + 2, y + 5);
            doc.text(picLines, colStarts[1] + 2, y + 5);
            doc.text(deadlineLines, colStarts[2] + 2, y + 5);
            doc.text(statusLines, colStarts[3] + 2, y + 5);
            
            y += rowHeight;
        });
        y += 5;
    }

    // --- ATTACHMENTS ---
    if (meeting.minutes?.attachments && meeting.minutes.attachments.length > 0) {
        addSectionTitle('Lampiran');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        meeting.minutes.attachments.forEach((att: Attachment, i: number) => {
            checkPageBreak(6);
            doc.setTextColor('#374151');
            doc.text(`${i + 1}. ${att.name}`, MARGIN, y);
            y += 6;
        });
    }

    // --- FOOTER (PAGE NUMBERS) ---
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Halaman ${i} dari ${totalPages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });
    }

    doc.save(`${fileName}.pdf`);
};

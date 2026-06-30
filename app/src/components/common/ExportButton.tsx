import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ExportButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: { header: string; key: string }[];
  filename?: string;
  title?: string;
}

export default function ExportButton({ data, columns, filename = 'report', title = 'تقرير' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, 14, 28);

    const headers = [columns.map(c => c.header)];
    const rows = data.map(row => columns.map(c => String(row[c.key] ?? '')));

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 35,
      styles: { fontSize: 9, halign: 'center' },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [30, 41, 59] },
    });

    doc.save(`${filename}.pdf`);
    setIsOpen(false);
  };

  const exportExcel = () => {
    const exportData = data.map(row => {
      const obj: Record<string, string> = {};
      columns.forEach(c => {
        obj[c.header] = String(row[c.key] ?? '');
      });
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title);
    XLSX.writeFile(wb, `${filename}.xlsx`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>تصدير</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-11 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <button
              onClick={exportPDF}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4 text-red-400" />
              تصدير PDF
            </button>
            <button
              onClick={exportExcel}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-400" />
              تصدير Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

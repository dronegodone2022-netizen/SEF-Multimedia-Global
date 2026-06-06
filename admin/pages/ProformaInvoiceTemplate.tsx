import React, { useRef } from 'react';
import { Printer, Download, X } from 'lucide-react';
const companyLogo = new URL('../../src/assests/officallogo.png', import.meta.url).href;

const COMPANY_DETAILS = {
  name: 'SEF Multimedia Global',
  tagline: 'Creative Media, Digital Design & Professional Production',
  location: 'Bo City, Sierra Leone',
  phone: '+232 75 510 770',
  email: 'hello@sefmultimediaglobal.com',
  website: 'sefmultimediaglobal.com',
};

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Props {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;

  company: {
    name: string;
    address: string;
    acn?: string;
    abn?: string;
    phone?: string;
  };

  client: {
    name: string;
    address: string;
    acn?: string;
    abn?: string;
  };

  paymentDetails?: string;

  items: InvoiceItem[];

  subtotal: number;
  total: number;
  
  onClose?: () => void;
}

const ProformaInvoiceTemplate: React.FC<Props> = ({
  invoiceNumber,
  invoiceDate,
  dueDate,
  company,
  client,
  paymentDetails,
  items,
  subtotal,
  total,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '', 'height=800,width=1000');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Proforma Invoice</title>');
        printWindow.document.write(`
          <style>
            body { font-family: Arial, sans-serif; }
            @media print { body { margin: 0; padding: 0; } }
          </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      const addPageIfNeeded = (neededHeight: number) => {
        if (y + neededHeight <= pageHeight - margin) return;
        pdf.addPage();
        y = margin;
      };

      const addWrappedText = (text: string, x: number, maxWidth: number, lineHeight = 5) => {
        const lines = pdf.splitTextToSize(text || '', maxWidth);
        lines.forEach((line: string) => {
          addPageIfNeeded(lineHeight);
          pdf.text(line, x, y);
          y += lineHeight;
        });
      };

      // Use provided company (biller) info when available, otherwise fallback to defaults
      const biller = {
        name: company?.name || COMPANY_DETAILS.name,
        tagline: COMPANY_DETAILS.tagline,
        location: company?.address || COMPANY_DETAILS.location,
        phone: company?.phone || COMPANY_DETAILS.phone,
        email: COMPANY_DETAILS.email,
        website: COMPANY_DETAILS.website,
      };

      try {
        pdf.addImage(companyLogo, 'PNG', margin, y - 4, 18, 18);
      } catch (logoError) {
        console.warn('Unable to add logo to PDF:', logoError);
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(29, 78, 216);
      pdf.text(biller.name, margin + 23, y + 3);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(75, 85, 99);
      pdf.text(biller.tagline, margin + 23, y + 9);
      pdf.text(biller.location, pageWidth - margin, y, { align: 'right' });
      pdf.text(biller.phone, pageWidth - margin, y + 5, { align: 'right' });
      pdf.text(biller.email, pageWidth - margin, y + 10, { align: 'right' });

      y += 26;
      pdf.setDrawColor(147, 197, 253);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 12;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor(29, 78, 216);
      pdf.text(`Proforma Invoice # ${invoiceNumber}`, pageWidth / 2, y, { align: 'center' });
      y += 12;

      pdf.setFontSize(11);
      pdf.setTextColor(17, 24, 39);
      pdf.text('BILL TO', margin, y);
      pdf.text('INVOICE DETAILS', pageWidth - margin - 58, y);
      y += 7;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(55, 65, 81);
      const billStartY = y;
      addWrappedText(client.name, margin, 80);
      addWrappedText(client.address, margin, 80);
      if (client.acn) addWrappedText(`ACN: ${client.acn}`, margin, 80);
      if (client.abn) addWrappedText(`ABN: ${client.abn}`, margin, 80);

      y = billStartY;
      pdf.text(`Invoice Date: ${invoiceDate}`, pageWidth - margin - 58, y);
      y += 6;
      pdf.text(`Due Date: ${dueDate}`, pageWidth - margin - 58, y);
      y = Math.max(y + 12, billStartY + 24);

      if (paymentDetails) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('PAYMENT DETAILS', margin, y);
        y += 6;
        pdf.setFont('helvetica', 'normal');
        addWrappedText(paymentDetails, margin, contentWidth, 5);
        y += 4;
      }

      addPageIfNeeded(18);
      pdf.setFillColor(96, 165, 250);
      pdf.rect(margin, y, contentWidth, 9, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text('DESCRIPTION', margin + 2, y + 6);
      pdf.text('QTY', margin + 108, y + 6, { align: 'center' });
      pdf.text('UNIT PRICE', margin + 142, y + 6, { align: 'right' });
      pdf.text('SUBTOTAL', pageWidth - margin - 2, y + 6, { align: 'right' });
      y += 9;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(31, 41, 55);
      items.forEach(item => {
        const descriptionLines = pdf.splitTextToSize(item.description || '', 92);
        const rowHeight = Math.max(10, descriptionLines.length * 5 + 4);
        addPageIfNeeded(rowHeight);
        pdf.setDrawColor(219, 234, 254);
        pdf.rect(margin, y, contentWidth, rowHeight);
        pdf.text(descriptionLines, margin + 2, y + 6);
        pdf.text(String(item.quantity), margin + 108, y + 6, { align: 'center' });
        pdf.text(formatCurrency(item.unitPrice), margin + 142, y + 6, { align: 'right' });
        pdf.text(formatCurrency(item.subtotal), pageWidth - margin - 2, y + 6, { align: 'right' });
        y += rowHeight;
      });

      y += 8;
      addPageIfNeeded(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55);
      pdf.text('THANK YOU FOR YOUR BUSINESS', margin, y + 8);
      pdf.setFontSize(11);
      pdf.text('SUBTOTAL', pageWidth - margin - 58, y);
      pdf.text(formatCurrency(subtotal), pageWidth - margin, y, { align: 'right' });
      y += 8;
      pdf.setFillColor(239, 246, 255);
      pdf.rect(pageWidth - margin - 70, y - 5, 70, 12, 'F');
      pdf.setFontSize(14);
      pdf.setTextColor(29, 78, 216);
      pdf.text('TOTAL', pageWidth - margin - 66, y + 3);
      pdf.text(formatCurrency(total), pageWidth - margin - 4, y + 3, { align: 'right' });
      y += 20;

      addPageIfNeeded(32);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(31, 41, 55);
      pdf.text('Important Information:', margin, y);
      y += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      addWrappedText('80% upfront payment is required to confirm wedding and outdoor bookings. Studio services require 100% payment before delivery.', margin, contentWidth);
      addWrappedText('Book all scheduled shoots at least 1 week in advance for proper planning.', margin, contentWidth);
      addWrappedText('Extra services are available and charged separately.', margin, contentWidth);

      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`${biller.name} | ${biller.phone} | ${biller.email}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

      pdf.save(`proforma-invoice-${invoiceNumber}.pdf`);
      console.log('PDF saved successfully');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to generate PDF: ${errorMessage}. Try using the Print button instead.`);
    }
  };

  const formatCurrency = (value: number): string => {
    return `SLL ${value.toFixed(2)}`;
  };

  return (
    <div className="w-full">
      {/* ACTION BAR */}
      <div className="sticky top-0 z-50 bg-white shadow-md p-4 flex justify-between items-center print:hidden">
        <h2 className="text-lg font-semibold text-gray-800">
          Proforma Invoice #{invoiceNumber}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            title="Print invoice"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            title="Download as PDF"
          >
            <Download size={18} />
            <span className="hidden sm:inline">PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              title="Close invoice"
            >
              <X size={18} />
              <span className="hidden sm:inline">Close</span>
            </button>
          )}
        </div>
      </div>

      {/* INVOICE CONTENT */}
      <div
        ref={printRef}
        className="bg-white p-8 md:p-12 text-gray-800 w-full min-h-screen flex flex-col"
      >
        {/* TOP HEADER WITH LOGO */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-blue-300">
          <div className="flex items-center gap-4">
            <img src={companyLogo} alt="Company Logo" className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-blue-700">{company?.name || COMPANY_DETAILS.name}</h1>
              <p className="text-xs text-gray-600 italic">{COMPANY_DETAILS.tagline}</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600">
            <p>{company?.address || COMPANY_DETAILS.location}</p>
            <p>{company?.phone || COMPANY_DETAILS.phone}</p>
            <p>{COMPANY_DETAILS.email}</p>
          </div>
        </div>

        {/* HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         

          {/* BILL TO */}
          <div>
            <h2 className="font-bold text-lg border-b-4 border-blue-400 pb-2 mb-3">
              BILL TO
            </h2>

            <div className="space-y-1 text-sm md:text-base">
              <p className="font-semibold">{client.name}</p>
              <p>{client.address}</p>
              {client.acn && <p>ACN: {client.acn}</p>}
              {client.abn && <p>ABN: {client.abn}</p>}
            </div>
          </div>
        </div>

        {/* PAYMENT + DATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="text-sm whitespace-pre-line text-gray-700">
            {paymentDetails && paymentDetails}
          </div>

          <div className="text-sm text-right space-y-3">
            <p>
              <span className="font-bold">Invoice Date:</span>{' '}
              <span className="ml-2">{invoiceDate}</span>
            </p>

            <p>
              <span className="font-bold">Due Date:</span>{' '}
              <span className="ml-2">{dueDate}</span>
            </p>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl italic font-semibold text-blue-700">
            Proforma Invoice # {invoiceNumber}
          </h1>
        </div>

        {/* TABLE */}
        <div className="border border-blue-200 overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th className="p-3 text-left text-sm md:text-base">DESCRIPTION</th>
                <th className="p-3 text-center text-sm md:text-base">QTY</th>
                <th className="p-3 text-center text-sm md:text-base">UNIT PRICE</th>
                <th className="p-3 text-center text-sm md:text-base">SUBTOTAL</th>
              </tr>
            </thead>

            <tbody>
              {items && items.length > 0 ? (
                items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-blue-100 hover:bg-blue-50"
                  >
                    <td className="p-3 text-sm md:text-base">{item.description}</td>

                    <td className="p-3 text-center text-sm md:text-base">
                      {item.quantity}
                    </td>

                    <td className="p-3 text-center text-sm md:text-base">
                      {formatCurrency(item.unitPrice)}
                    </td>

                    <td className="p-3 text-center text-sm md:text-base font-medium">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No items in invoice
                  </td>
                </tr>
              )}

              {/* EMPTY SPACE FOR ADDITIONAL NOTES */}
              <tr>
                <td colSpan={4} className="h-20 md:h-32"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FOOTER TOTALS */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="italic text-sm md:text-base uppercase font-medium text-gray-600">
            THANK YOU FOR YOUR BUSINESS
          </div>

          <div className="w-full md:w-80">
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700">SUBTOTAL</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-xl md:text-2xl font-bold text-blue-700 bg-blue-50 px-4 py-3 rounded">
              <span>TOTAL</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* IMPORTANT INFORMATION SECTION */}
        <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="font-semibold text-gray-800 mb-3">Important Information:</p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>80% upfront payment is required to confirm wedding and outdoor bookings. Studio services (photoshoot, design, product shoot, etc.) require 100% payment before delivery.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>Book all scheduled shoots at least 1 week in advance for proper planning.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>Extra services (drone, extra crew, special equipment) are available and charged separately.</span>
            </li>
          </ul>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-auto pt-12 border-t-2 border-blue-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-xs">
            {/* Left: Company Details */}
            <div>
              <p className="font-bold text-gray-800 mb-2">Company Information</p>
              <p className="text-gray-600">{company?.name || COMPANY_DETAILS.name}</p>
              <p className="text-gray-600">{company?.address || COMPANY_DETAILS.location}</p>
              <p className="text-gray-600">{company?.phone || COMPANY_DETAILS.phone}</p>
              <p className="text-gray-600">{COMPANY_DETAILS.email}</p>
              <p className="text-gray-600">{COMPANY_DETAILS.website}</p>
            </div>

            {/* Center: Invoice Note */}
            <div className="text-center">
              <p className="font-bold text-gray-800 mb-2">Terms & Conditions</p>
              <p className="text-gray-600">This is a Proforma Invoice.</p>
              <p className="text-gray-600">Payment is due on the due date specified above.</p>
              <p className="text-gray-600 mt-2 italic">Thank you for your business!</p>
            </div>

            {/* Right: Follow Us */}
            <div>
              <p className="font-bold text-gray-800 mb-2">Follow Us</p>
              <p className="text-gray-600">Facebook: SEFMultimediaGlobal</p>
              <p className="text-gray-600">YouTube: @sefmultimediaglobal101</p>
              <p className="text-gray-600">TikTok: @sef.multimedia.global</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
            <p>© 2026 {COMPANY_DETAILS.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProformaInvoiceTemplate;


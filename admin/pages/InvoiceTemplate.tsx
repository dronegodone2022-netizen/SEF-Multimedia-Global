import React from 'react';
import { X } from 'lucide-react';

interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
  amount?: number;
}

interface InvoiceTemplateProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  company?: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  client: {
    name: string;
    address?: string;
    email?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  total: number;
  notes?: string;
  onClose: () => void;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoiceNumber,
  invoiceDate,
  dueDate,
  company = {
    name: 'SEF Multimedia Global',
    address: 'Bo City, Sierra Leone',
    phone: '+232 75 510 770',
    email: 'info@sefmultimedia.com',
  },
  client,
  items,
  subtotal,
  tax = 0,
  total,
  notes = '',
  onClose,
}) => {
  const formatSLL = (amount: number) =>
    new Intl.NumberFormat('en-SL').format(amount);

  return (
    <div className="w-full">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .invoice-container { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .invoice-header { display: block !important; page-break-inside: avoid; }
          img.invoice-logo { max-width: 180px; height: auto !important; display: inline-block !important; }
        }
      `}</style>
      {/* Close Button */}
      <div className="flex justify-end p-4 border-b no-print">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Invoice Container */}
      <div className="p-12 bg-white max-w-4xl mx-auto invoice-container">
        {/* Header */}
        <div className="flex justify-between items-start mb-10 invoice-header">
          <div className="flex items-start gap-4">
            <img src="/src/assests/LOGO.png" alt="SEF Multimedia Logo" className="invoice-logo w-20 h-20 object-contain rounded-md shadow-sm bg-white p-1" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600 mt-1">Creative Media, Digital Design & Professional Production</p>
              <p className="text-gray-600">{company.address}</p>
              {company.email && <p className="text-gray-600">{company.email}</p>}
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-4xl font-bold text-blue-600 mb-2">INVOICE</h2>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Billed To
            </h3>
            <p className="text-gray-900 font-medium">{client.name}</p>
            {client.address && <p className="text-gray-600">{client.address}</p>}
            {client.email && <p className="text-gray-600">{client.email}</p>}
          </div>

          <div className="text-right">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Invoice Details
            </h3>
            <p className="text-gray-900 font-medium">Ref: {invoiceNumber}</p>
            <p className="text-gray-600">Date: {invoiceDate}</p>
            <p className="text-gray-600">Due Date: {dueDate}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-10 ">
          <table className="w-full ">
            <thead>
              <tr className="border-b-2 border-gray-900 bg-blue-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                  No.
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                  Description
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 text-sm">
                  Qty
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 text-sm">
                  Unit Price (SLL)
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 text-sm">
                  Amount (SLL)
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-900">{index + 1}</td>
                  <td className="py-4 px-4 text-gray-900">{item.description}</td>
                  <td className="py-4 px-4 text-right text-gray-900">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-gray-900">
                    {formatSLL(item.unitPrice)}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900">
                    {formatSLL((item.subtotal || item.amount) || item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="flex justify-end mb-10">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">Le {formatSLL(subtotal)}</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-300">
                <span className="text-gray-700">GST (7.5%):</span>
                <span className="font-semibold text-gray-900">Le {formatSLL(tax)}</span>
              </div>
            )}

            {/* notes moved to full-width section below */}

              {/* footer moved to its own section below */}
          </div>
        </div>

        {/* Important Information (separate section) */}
        <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="max-w-4xl mx-auto mt-4 mb-4">
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="font-semibold text-gray-800 mb-3">Important Information:</p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>80% upfront payment is required to confirm wedding and outdoor bookings. Studio services require 100% payment before delivery.</span>
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
        </div>

        {/* Footer (separate section) */}
        <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="max-w-4xl mx-auto mt-6 pt-6 border-t border-gray-200 text-xs leading-tight">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <p className="font-bold text-gray-800">{company?.name}</p>
              <p className="text-gray-600 truncate">{company?.address}</p>
              <p className="text-gray-600">{company?.phone} </p> 
            <p className="text-gray-600">{company?.email}</p>
            </div>

            <div className="flex-1 text-center">
              <p className="font-semibold text-gray-800">Terms</p>
              <p className="text-gray-600">Payment due on the date specified above.</p>
            </div>

            <div className="flex-1 text-right">
              <p className="font-semibold text-gray-800">Follow Us</p>
              <p className="text-gray-600">FB • YouTube • TikTok</p>
            </div>
          </div>

          
        </div>

        

        {/* small generated stamp (kept for legacy) */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Generated by SEF Multimedia Global | {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;

import { Booking, Client, Commission, Employee, Expense, Invoice, Payment, Freelancer, PettyCash } from '../types';

const OFFICIAL_LOGO_URL = new URL('../src/assests/officallogo.png', import.meta.url).href;

export class PDFGenerator {
  private static companyHeaderHtml(logoSrc = OFFICIAL_LOGO_URL) {
    return `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <img src="${logoSrc}" alt="logo" style="height:56px;object-fit:contain" />
        <div>
          <h1 style="margin:0;font-size:20px;color:#1f2937">SEF Multimedia Global</h1>
          <div style="color:#6b7280">Creative Media, Digital Design & Professional Production</div>
          <div style="color:#6b7280;font-size:12px">Generated: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0 18px 0" />
    `;
  }
  static downloadInvoice(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  static generateHtmlBlob(html: string): Blob {
    return new Blob([html], { type: 'text/html' });
  }

  static generateDashboardReportPDF(
    period: 'weekly' | 'monthly' | 'yearly',
    startDate: Date,
    endDate: Date,
    revenue: number,
    expenses: number,
    payments: number,
    newClients: number,
    totalBookings: number,
    totalEmployees: number,
    totalFreelancers: number
  ): Blob {
    const html = `<!DOCTYPE html><html><body>${this.companyHeaderHtml()}<h2 style="margin-top:0">Dashboard Report</h2><p>Period: ${period}</p><p>Start: ${startDate.toDateString()}</p><p>End: ${endDate.toDateString()}</p><p>Revenue: SLL ${revenue.toFixed(2)}</p><p>Expenses: SLL ${expenses.toFixed(2)}</p><p>Payments: SLL ${payments.toFixed(2)}</p><p>New Clients: ${newClients}</p><p>Total Bookings: ${totalBookings}</p><p>Total Employees: ${totalEmployees}</p><p>Total Freelancers: ${totalFreelancers}</p></body></html>`;
    return this.generateHtmlBlob(html);
  }

  static async getOfficialLogoDataUrl(): Promise<string | null> {
    try {
      const res = await fetch(OFFICIAL_LOGO_URL);
      if (!res.ok) return null;
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(arrayBuffer);
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)) as any);
      }
      const base64 = btoa(binary);
      const mime = blob.type || 'image/png';
      return `data:${mime};base64,${base64}`;
    } catch (err) {
      console.warn('Unable to fetch official logo as data URL', err);
      return null;
    }
  }

  static generateClientsReportPDF(clients: Client[]): Blob {
    const rows = clients
      .map(
        (client) =>
          `<tr><td>${client.name}</td><td>${client.email}</td><td>${client.phone}</td><td>${client.company || ''}</td><td>${client.totalSpent}</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html><html><body>${this.companyHeaderHtml()}<h2 style="margin-top:0">Clients Report</h2><table border="1" cellspacing="0" cellpadding="4"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Total Spent</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    return this.generateHtmlBlob(html);
  }

  static generateBookingsReportPDF(bookings: Booking[], clientNames: Record<string, string>): Blob {
    const rows = bookings
      .map(
        (booking) =>
          `<tr><td>${booking.bookingCode}</td><td>${clientNames[booking.clientId] || booking.clientId}</td><td>${booking.title}</td><td>${booking.amount}</td><td>${booking.status}</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html><html><body>${this.companyHeaderHtml()}<h2 style="margin-top:0">Bookings Report</h2><table border="1" cellspacing="0" cellpadding="4"><thead><tr><th>Code</th><th>Client</th><th>Title</th><th>Amount</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    return this.generateHtmlBlob(html);
  }

  static generatePaymentsReportPDF(payments: Payment[], clientNames: Record<string, string>): Blob {
    const rows = payments
      .map(
        (payment) =>
          `<tr><td>${payment.paymentCode}</td><td>${clientNames[payment.clientId] || payment.clientId}</td><td>${payment.amount}</td><td>${payment.status}</td><td>${payment.paymentMethod}</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html><html><body>${this.companyHeaderHtml()}<h2 style="margin-top:0">Payments Report</h2><table border="1" cellspacing="0" cellpadding="4"><thead><tr><th>Code</th><th>Client</th><th>Amount</th><th>Status</th><th>Method</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    return this.generateHtmlBlob(html);
  }

  static generateExpensesReportPDF(expenses: Expense[], pettyCash: PettyCash[]): Blob {
    const expenseRows = expenses
      .map(
        (expense) =>
          `<tr><td>${expense.expenseCode}</td><td>${expense.description}</td><td>${expense.amount}</td><td>${expense.category}</td><td>${expense.status}</td></tr>`
      )
      .join('');

    const pettyRows = pettyCash
      .map(
        (record) =>
          `<tr><td>${record.code}</td><td>${record.description}</td><td>${record.amount}</td><td>${record.category}</td><td>${record.status}</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html><html><body>${this.companyHeaderHtml()}<h2 style="margin-top:0">Expenses Report</h2><h3>Expenses</h3><table border="1" cellspacing="0" cellpadding="4"><thead><tr><th>Code</th><th>Description</th><th>Amount</th><th>Category</th><th>Status</th></tr></thead><tbody>${expenseRows}</tbody></table><h3>Petty Cash</h3><table border="1" cellspacing="0" cellpadding="4"><thead><tr><th>Code</th><th>Description</th><th>Amount</th><th>Category</th><th>Status</th></tr></thead><tbody>${pettyRows}</tbody></table></body></html>`;
    return this.generateHtmlBlob(html);
  }

  static generateSeparateExpenseReportPDF(
    expenses: Expense[],
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: Date,
    endDate: Date
  ): Blob {
    const approvedExpenses = expenses.filter(e => e.status === 'approved');
    const totalAmount = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);

    const expenseRows = approvedExpenses
      .map(
        (expense) =>
          `<tr><td>${expense.expenseCode}</td><td>${new Date(expense.date).toLocaleDateString()}</td><td>${expense.description}</td><td>${expense.category}</td><td>SLL ${expense.amount.toFixed(2)}</td></tr>`
      )
      .join('');

    const categoryTotals: Record<string, number> = {};
    approvedExpenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const categoryRows = Object.entries(categoryTotals)
      .map(([category, amount]) => `<tr><td>${category}</td><td>SLL ${amount.toFixed(2)}</td></tr>`)
      .join('');

    const periodLabel = period.charAt(0).toUpperCase() + period.slice(1);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expense Report - ${periodLabel}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      color: #333;
    }
    h1 { color: #1f2937; margin-bottom: 10px; }
    .header-info {
      background: #f3f4f6;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .header-info p { margin: 5px 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    thead {
      background-color: #2563eb;
      color: white;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    .total-row {
      background-color: #dbeafe;
      font-weight: bold;
    }
    .summary {
      background-color: #ecfdf5;
      padding: 15px;
      border-radius: 6px;
      margin-top: 20px;
      border: 2px solid #10b981;
    }
    .summary h3 {
      margin: 0 0 10px 0;
      color: #047857;
    }
    .summary-item {
      margin: 8px 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  ${this.companyHeaderHtml()}
  <h1>Expense Report - ${periodLabel}</h1>
  <div class="header-info">
    <p><strong>Report Period:</strong> ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Total Expenses:</strong> SLL ${totalAmount.toFixed(2)}</p>
    <p><strong>Number of Approved Expenses:</strong> ${approvedExpenses.length}</p>
  </div>

  <h2>Expense Details</h2>
  <table>
    <thead>
      <tr>
        <th>Code</th>
        <th>Date</th>
        <th>Description</th>
        <th>Category</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${expenseRows}
      <tr class="total-row">
        <td colspan="4"><strong>TOTAL</strong></td>
        <td><strong>SLL ${totalAmount.toFixed(2)}</strong></td>
      </tr>
    </tbody>
  </table>

  <h2>Expense By Category</h2>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Total Amount</th>
      </tr>
    </thead>
    <tbody>
      ${categoryRows}
      <tr class="total-row">
        <td><strong>GRAND TOTAL</strong></td>
        <td><strong>SLL ${totalAmount.toFixed(2)}</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="summary">
    <h3>Summary Statistics</h3>
    <div class="summary-item"><strong>Period:</strong> ${periodLabel} (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})</div>
    <div class="summary-item"><strong>Total Expenses:</strong> SLL ${totalAmount.toFixed(2)}</div>
    <div class="summary-item"><strong>Number of Transactions:</strong> ${approvedExpenses.length}</div>
    <div class="summary-item"><strong>Average Transaction:</strong> SLL ${approvedExpenses.length > 0 ? (totalAmount / approvedExpenses.length).toFixed(2) : '0.00'}</div>
    <div class="summary-item"><strong>Highest Expense:</strong> SLL ${approvedExpenses.length > 0 ? Math.max(...approvedExpenses.map(e => e.amount)).toFixed(2) : '0.00'}</div>
  </div>

  <p style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
    Generated by SEF Multimedia Global | ${new Date().toLocaleDateString()}
  </p>
</body>
</html>`;
    return this.generateHtmlBlob(html);
  }

  static generateEmployeesReportPDF(employees: Employee[]): Blob {
    const rows = employees
      .map(
        (employee) =>
          `<tr><td>${employee.employeeCode}</td><td>${employee.firstName} ${employee.lastName}</td><td>${employee.email}</td><td>${employee.role}</td><td>${employee.salary}</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html><html><body>${this.companyHeaderHtml()}<h2 style="margin-top:0">Employees Report</h2><table border="1" cellspacing="0" cellpadding="4"><thead><tr><th>Code</th><th>Name</th><th>Email</th><th>Role</th><th>Salary</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    return this.generateHtmlBlob(html);
  }

  static generateFreelancersReportPDF(freelancers: Freelancer[]): Blob {
    const rows = freelancers
      .map(
        (freelancer) =>
          `<tr><td>${freelancer.freelancerCode}</td><td>${freelancer.firstName} ${freelancer.lastName}</td><td>${freelancer.email}</td><td>${freelancer.specialization.join(', ')}</td><td>${freelancer.totalEarnings}</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html><html><body>${this.companyHeaderHtml()}<h2 style="margin-top:0">Freelancers Report</h2><table border="1" cellspacing="0" cellpadding="4"><thead><tr><th>Code</th><th>Name</th><th>Email</th><th>Specialization</th><th>Total Earnings</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    return this.generateHtmlBlob(html);
  }

  static generateInvoicesReportPDF(invoices: Invoice[], clientNames: Record<string, string>): Blob {
    const rows = invoices
      .map(
        (invoice) =>
          `<tr><td>${invoice.invoiceNumber}</td><td>${clientNames[invoice.clientId] || invoice.clientId}</td><td>${invoice.total}</td><td>${invoice.status}</td><td>${invoice.invoiceType || 'standard'}</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html><html><body>${this.companyHeaderHtml()}<h2 style="margin-top:0">Invoices Report</h2><table border="1" cellspacing="0" cellpadding="4"><thead><tr><th>Invoice</th><th>Client</th><th>Total</th><th>Status</th><th>Type</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    return this.generateHtmlBlob(html);
  }

  static generatePaidCommissionsProformaPDF(
    commissions: Commission[],
    freelancers: Freelancer[],
    bookings: Booking[]
  ): Blob {
    const rows = commissions
      .map((commission) => {
        const freelancer = freelancers.find((item) => item.id === commission.freelancerId);
        const booking = bookings.find((item) => item.id === commission.bookingId);
        return `<tr><td>${commission.commissionCode}</td><td>${freelancer ? `${freelancer.firstName} ${freelancer.lastName}` : commission.freelancerId}</td><td>${booking ? booking.title : commission.bookingId}</td><td>${commission.amount}</td><td>${commission.status}</td></tr>`;
      })
      .join('');

    const html = `<!DOCTYPE html><html><body><div style="display:flex;align-items:center;gap:12px"><img src="${OFFICIAL_LOGO_URL}" alt="logo" style="height:48px"/><h1 style="margin:0 0 0 12px">SEF Multimedia Global - Paid Commissions Proforma</h1></div><table border="1" cellspacing="0" cellpadding="4"><thead><tr><th>Commission</th><th>Freelancer</th><th>Booking</th><th>Amount</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    return this.generateHtmlBlob(html);
  }

  static generateEmployeePayslipPDF(employee: Employee, expense: Expense): Blob {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payslip - ${employee.firstName} ${employee.lastName}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #1f2937; margin: 24px; }
    .header { margin-bottom: 18px; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 4px 0; color: #4b5563; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-top: 16px; }
    .section-title { font-size: 16px; font-weight: 700; margin-bottom: 10px; }
    .field { margin-bottom: 10px; }
    .field strong { display: inline-block; width: 140px; }
    .footer { margin-top: 28px; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  ${this.companyHeaderHtml()}
  <div class="header">
    <h1>Payslip</h1>
    <p>Employee salary payment details for ${new Date(expense.date).toLocaleDateString()}</p>
  </div>
  <div class="card">
    <div class="section-title">Employee Details</div>
    <div class="field"><strong>Name:</strong> ${employee.firstName} ${employee.lastName}</div>
    <div class="field"><strong>Employee Code:</strong> ${employee.employeeCode}</div>
    <div class="field"><strong>Role:</strong> ${employee.role}</div>
    <div class="field"><strong>Email:</strong> ${employee.email}</div>
  </div>
  <div class="card">
    <div class="section-title">Salary Payment</div>
    <div class="field"><strong>Amount:</strong> SLL ${expense.amount.toFixed(2)}</div>
    <div class="field"><strong>Description:</strong> ${expense.description}</div>
    <div class="field"><strong>Payment Date:</strong> ${new Date(expense.date).toLocaleDateString()}</div>
    <div class="field"><strong>Status:</strong> ${expense.status}</div>
  </div>
  <div class="footer">Generated by SEF Multimedia Global</div>
</body>
</html>`;
    return this.generateHtmlBlob(html);
  }

  static generateEmployeePayslipsReportPDF(employees: Employee[], expenses: Expense[]): Blob {
    const salaryExpenses = expenses.filter(e => e.status === 'approved' && e.category?.toLowerCase() === 'salary');
    const rows = salaryExpenses
      .map((expense) => {
        const employee = employees.find(emp => emp.id === expense.employeeId);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
        const employeeCode = employee?.employeeCode || 'N/A';
        return `<tr><td>${employeeCode}</td><td>${employeeName}</td><td>${expense.description}</td><td>SLL ${expense.amount.toFixed(2)}</td><td>${new Date(expense.date).toLocaleDateString()}</td><td>${expense.status}</td></tr>`;
      })
      .join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Salary Payslips</title><style>body { font-family: Arial, sans-serif; margin: 24px; color: #1f2937; } table { width: 100%; border-collapse: collapse; margin-top: 16px; } th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; } thead { background: #2563eb; color: white; } tr:nth-child(even) { background: #f3f4f6; } h2 { margin-top: 0; }</style></head><body>${this.companyHeaderHtml()}<h2>Salary Payslip Report</h2><p>Approved salary payments for employees.</p><table><thead><tr><th>Employee Code</th><th>Name</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    return this.generateHtmlBlob(html);
  }

  static async generatePaidCommissionsProformaPDFFile(
    commissions: Commission[],
    freelancers: Freelancer[],
    bookings: Booking[]
  ): Promise<Blob> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 18;

    const COMPANY_DETAILS = {
      name: 'SEF Multimedia Global',
      tagline: 'Creative Media, Digital Design & Professional Production',
      location: 'Bo City, Sierra Leone',
      phone: '+232 75 510 770',
      email: 'hello@sefmultimediaglobal.com',
      website: 'sefmultimediaglobal.com',
    };

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

    const formatCurrency = (value: number): string => {
      return `SLL ${value.toFixed(2)}`;
    };

    try {
      pdf.addImage(OFFICIAL_LOGO_URL, 'PNG', margin, y - 4, 18, 18);
    } catch (logoError) {
      console.warn('Unable to add logo to PDF:', logoError);
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(29, 78, 216);
    pdf.text(COMPANY_DETAILS.name, margin + 23, y + 3);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(75, 85, 99);
    pdf.text(COMPANY_DETAILS.tagline, margin + 23, y + 9);
    pdf.text(COMPANY_DETAILS.location, pageWidth - margin, y, { align: 'right' });
    pdf.text(COMPANY_DETAILS.phone, pageWidth - margin, y + 5, { align: 'right' });
    pdf.text(COMPANY_DETAILS.email, pageWidth - margin, y + 10, { align: 'right' });

    y += 26;
    pdf.setDrawColor(147, 197, 253);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 12;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(29, 78, 216);
    pdf.text('Paid Commissions Proforma', pageWidth / 2, y, { align: 'center' });
    y += 12;

    pdf.setFontSize(11);
    pdf.setTextColor(17, 24, 39);
    pdf.text('SUMMARY', margin, y);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    const totalAmount = commissions.reduce((sum, c) => sum + c.amount, 0);
    addWrappedText(`Total Paid Commissions: ${formatCurrency(totalAmount)}`, margin, contentWidth);
    addWrappedText(`Number of Commissions: ${commissions.length}`, margin, contentWidth);
    addWrappedText(`Date: ${new Date().toLocaleDateString()}`, margin, contentWidth);
    y += 4;

    addPageIfNeeded(18);
    pdf.setFillColor(96, 165, 250);
    pdf.rect(margin, y, contentWidth, 9, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('FREELANCER', margin + 2, y + 6);
    pdf.text('BOOKING', margin + 60, y + 6);
    pdf.text('CODE', margin + 110, y + 6);
    pdf.text('AMOUNT', pageWidth - margin - 2, y + 6, { align: 'right' });
    y += 9;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(31, 41, 55);
    commissions.forEach(commission => {
      const freelancer = freelancers.find(f => f.id === commission.freelancerId);
      const booking = bookings.find(b => b.id === commission.bookingId);
      const freelancerName = freelancer ? `${freelancer.firstName} ${freelancer.lastName}` : 'Unknown';
      const bookingTitle = booking ? booking.title : 'Unknown';

      const rowHeight = 10;
      addPageIfNeeded(rowHeight);
      pdf.setDrawColor(219, 234, 254);
      pdf.rect(margin, y, contentWidth, rowHeight);
      pdf.text(freelancerName, margin + 2, y + 6);
      pdf.text(bookingTitle, margin + 60, y + 6);
      pdf.text(commission.commissionCode, margin + 110, y + 6);
      pdf.text(formatCurrency(commission.amount), pageWidth - margin - 2, y + 6, { align: 'right' });
      y += rowHeight;
    });

    y += 8;
    addPageIfNeeded(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(31, 41, 55);
    pdf.text('THANK YOU', margin, y + 8);
    pdf.setFontSize(11);
    pdf.text('TOTAL', pageWidth - margin - 58, y);
    pdf.text(formatCurrency(totalAmount), pageWidth - margin, y, { align: 'right' });
    y += 8;
    pdf.setFillColor(239, 246, 255);
    pdf.rect(pageWidth - margin - 70, y - 5, 70, 12, 'F');
    pdf.setFontSize(14);
    pdf.setTextColor(29, 78, 216);
    pdf.text('TOTAL', pageWidth - margin - 66, y + 3);
    pdf.text(formatCurrency(totalAmount), pageWidth - margin - 4, y + 3, { align: 'right' });

    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text(
      `${COMPANY_DETAILS.name} | ${COMPANY_DETAILS.phone} | ${COMPANY_DETAILS.email}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    return pdf.output('blob');
  }
}

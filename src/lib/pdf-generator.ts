import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

// Extindem tipul jsPDF pentru a include autotable (care se adauga la prototip)
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

interface CompanyInfo {
  nume: string;
  cui?: string | null;
  reg_com?: string | null;
  adresa?: string | null;
  iban?: string | null;
  banca?: string | null;
  telefon?: string | null;
  email?: string | null;
}

interface TransactionItem {
  nume: string;
  cantitate: number;
  pret: number; // in bani (subdiviziuni)
  unitate: string;
}

export const generateStockPDF = (company: CompanyInfo, transaction: {
  id: string | number;
  data: Date;
  tip: 'INTRARE' | 'IESIRE';
  items: TransactionItem[];
  user: string;
}) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // 1. Antet Firma (Stanga)
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(company.nume || 'BizHub SRL', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  let yPos = 20;
  if (company.cui) doc.text(`CUI: ${company.cui}`, 14, (yPos += 7));
  if (company.reg_com) doc.text(`Reg. Com: ${company.reg_com}`, 14, (yPos += 5));
  if (company.adresa) {
    const splitAdresa = doc.splitTextToSize(company.adresa, 80);
    doc.text(splitAdresa, 14, (yPos += 5));
    yPos += (splitAdresa.length - 1) * 5;
  }

  // 2. Titlu Document (Dreapta)
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  const title = transaction.tip === 'INTRARE' ? 'NOTA DE INTRARE RECEPTIE' : 'AVIZ DE INSOTIRE MARFA';
  doc.text(title, 110, 20);
  
  doc.setFontSize(10);
  doc.text(`Nr. Doc: ${transaction.id}`, 110, 28);
  doc.text(`Data: ${transaction.data.toLocaleDateString('ro-RO')}`, 110, 33);
  doc.text(`Intocmit de: ${transaction.user}`, 110, 38);

  // 3. Tabel Produse
  const tableRows = transaction.items.map((item, index) => [
    index + 1,
    item.nume,
    item.unitate,
    item.cantitate,
    (item.pret / 100).toFixed(2) + ' RON',
    ((item.cantitate * item.pret) / 100).toFixed(2) + ' RON'
  ]);

  const totalValue = transaction.items.reduce((sum, item) => sum + (item.cantitate * item.pret), 0);

  doc.autoTable({
    startY: 50,
    head: [['Nr.', 'Produs', 'U.M.', 'Cantitate', 'Pret Unitar', 'Valoare']],
    body: tableRows,
    foot: [['', '', '', '', 'TOTAL', (totalValue / 100).toFixed(2) + ' RON']],
    theme: 'grid',
    headStyles: { 
        fillColor: [63, 81, 181], 
        textColor: [255, 255, 255],
        fontStyle: 'bold'
    },
    footStyles: { 
        fillColor: [240, 240, 240], 
        textColor: [0, 0, 0], 
        fontStyle: 'bold' 
    },
  });

  // 4. Subsol (Semnaturi)
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(10);
  doc.text('Semnatura de primire:', 14, finalY);
  doc.text('____________________', 14, finalY + 10);
  
  doc.text('Semnatura de livrare:', 130, finalY);
  doc.text('____________________', 130, finalY + 10);

  // 5. Download
  const fileName = `${title.replace(/ /g, '_')}_${transaction.id}.pdf`;
  doc.save(fileName);
};

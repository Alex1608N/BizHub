import ExcelJS from 'exceljs';

export const exportAuditToExcel = async (logs: any[], companyName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Registru Audit');

  // 1. Configurari Coloane (Granularitate crescuta pentru contabil)
  worksheet.columns = [
    { header: 'ID Log', key: 'id', width: 10 },
    { header: 'Data & Ora', key: 'timestamp', width: 22 },
    { header: 'Utilizator', key: 'user', width: 18 },
    { header: 'Actiune', key: 'actiune', width: 12 },
    { header: 'Entitate', key: 'tabel', width: 12 },
    { header: 'Nume Produs', key: 'nume', width: 25 },
    { header: 'U.M.', key: 'um', width: 8 },
    { header: 'Cant.', key: 'qty', width: 8 },
    { header: 'Pret Unitar', key: 'pret', width: 15 },
    { header: 'Valoare Totala', key: 'total', width: 15 },
    { header: 'Alte Detalii', key: 'detalii', width: 40 },
  ];

  // 2. Formatare Header
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '3F51B5' }
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 25;

  // 3. Adaugare Date
  logs.forEach(log => {
    let rowData: any = {
      id: log.id,
      timestamp: new Date(log.timestamp).toLocaleString('ro-RO'),
      user: log.user?.nume || 'Sistem',
      actiune: log.actiune,
      tabel: log.tabel,
      nume: '-',
      um: '-',
      qty: 0,
      pret: 0,
      total: 0,
      detalii: '-'
    };

    try {
      const oldData = log.date_vechi ? JSON.parse(log.date_vechi) : null;
      const newData = log.date_noi ? JSON.parse(log.date_noi) : null;

      if (log.tabel === 'stoc' && oldData && newData) {
        const diff = (newData.stoc || 0) - (oldData.stoc || 0);
        rowData.nume = newData.nume || 'Produs';
        rowData.um = newData.unitate || 'Buc';
        rowData.qty = diff;
        rowData.pret = newData.pret / 100;
        rowData.total = (Math.abs(diff) * newData.pret) / 100;
        rowData.detalii = `Miscare stoc: ${diff > 0 ? 'Intrare' : 'Iesire'}`;
      } else if (newData && !oldData) {
        rowData.nume = newData.nume || '-';
        rowData.detalii = `Creat: ${JSON.stringify(newData)}`;
      } else if (oldData && newData) {
        rowData.nume = newData.nume || oldData.nume || '-';
        rowData.detalii = Object.keys(newData)
          .filter(k => newData[k] !== oldData[k] && k !== 'timestamp')
          .map(k => `${k}: ${oldData[k]} -> ${newData[k]}`)
          .join(', ');
      }
    } catch (e) {
      rowData.detalii = 'Eroare parsing date log';
    }

    worksheet.addRow(rowData);
  });

  // 4. Stilizare randuri (borduri, alignment, number formats)
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.alignment = { vertical: 'middle', wrapText: true };
      row.border = { bottom: { style: 'thin', color: { argb: 'E5E7EB' } } };
      
      // Formatare coloane numerice (lei)
      row.getCell('qty').numFmt = '#,##0';
      row.getCell('pret').numFmt = '#,##0.00 "RON"';
      row.getCell('total').numFmt = '#,##0.00 "RON"';
    }
  });

  // 5. Generare si Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  anchor.download = `Export_Audit_${companyName.replace(/ /g, '_')}_${dateStr}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};

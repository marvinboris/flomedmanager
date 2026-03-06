import { rapportService } from '../services/api';

const Rapports = () => {
  const downloadFile = async (exportFn, filename) => {
    try {
      const response = await exportFn();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Erreur lors du téléchargement');
    }
  };

  const rapportTypes = [
    {
      title: 'Rapport de Stock',
      description: 'Liste complète des médicaments en stock',
      pdf: () => downloadFile(rapportService.exportStockPdf, 'rapport_stock.pdf'),
      excel: () => downloadFile(rapportService.exportStockExcel, 'rapport_stock.xlsx'),
    },
    {
      title: 'Médicaments Expirés',
      description: 'Liste des médicaments expirés',
      pdf: () => downloadFile(rapportService.exportExpiredPdf, 'rapport_expires.pdf'),
      excel: () => downloadFile(rapportService.exportExpiredExcel, 'rapport_expires.xlsx'),
    },
    {
      title: 'Mouvements de Stock',
      description: 'Historique des entrées et sorties',
      pdf: () => downloadFile(() => rapportService.exportMovementsPdf({}), 'rapport_mouvements.pdf'),
      excel: () => downloadFile(() => rapportService.exportMovementsExcel({}), 'rapport_mouvements.xlsx'),
    },
    {
      title: 'Rapport des Commandes',
      description: 'Historique des commandes',
      pdf: () => downloadFile(() => rapportService.exportCommandesPdf({}), 'rapport_commandes.pdf'),
      excel: () => downloadFile(() => rapportService.exportCommandesExcel({}), 'rapport_commandes.xlsx'),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Rapports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rapportTypes.map((rapport) => (
          <div key={rapport.title} className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {rapport.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{rapport.description}</p>
            <div className="flex gap-3">
              <button
                onClick={rapport.pdf}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                </svg>
                PDF
              </button>
              <button
                onClick={rapport.excel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Excel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rapports;

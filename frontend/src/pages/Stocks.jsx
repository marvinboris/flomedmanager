import { useState, useEffect } from 'react';
import { stockService, medicamentService } from '../services/api';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    medicament_id: '',
    type: 'in',
    quantity: 1,
  });
  const [medicaments, setMedicaments] = useState([]);

  useEffect(() => {
    loadStocks();
    loadMedicaments();
  }, []);

  const loadStocks = async () => {
    try {
      const response = await stockService.getAll();
      setStocks(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMedicaments = async () => {
    try {
      const response = await medicamentService.getAll();
      setMedicaments(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await stockService.movement(formData);
      setShowModal(false);
      setFormData({ medicament_id: '', type: 'in', quantity: 1 });
      loadStocks();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur');
    }
  };

  const getStatusBadge = (stock) => {
    if (!stock.medicament?.stock) return 'badge-info';
    const qty = stock.medicament.stock.quantity;
    const threshold = stock.medicament.alert_threshold;
    if (qty <= threshold) return 'badge-danger';
    if (qty <= threshold * 2) return 'badge-warning';
    return 'badge-success';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Stocks</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Mouvement de stock
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Médicament</th>
                <th>Catégorie</th>
                <th>Dosage</th>
                <th>Expiration</th>
                <th>Quantité</th>
                <th>Seuil</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id}>
                  <td className="font-medium">{stock.medicament?.name}</td>
                  <td>{stock.medicament?.category}</td>
                  <td>{stock.medicament?.dosage}</td>
                  <td>
                    {stock.medicament?.expiration_date 
                      ? new Date(stock.medicament.expiration_date).toLocaleDateString('fr-FR')
                      : '-'}
                  </td>
                  <td className="font-bold">{stock.quantity}</td>
                  <td>{stock.medicament?.alert_threshold}</td>
                  <td>
                    <span className={getStatusBadge(stock)}>
                      {stock.quantity <= stock.medicament?.alert_threshold ? 'Critique' : 
                       stock.quantity <= stock.medicament?.alert_threshold * 2 ? 'Attention' : 'OK'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Mouvement de stock</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Médicament
                </label>
                <select
                  value={formData.medicament_id}
                  onChange={(e) => setFormData({ ...formData, medicament_id: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {medicaments.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name} - {med.dosage}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de mouvement
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input"
                >
                  <option value="in">Entrée</option>
                  <option value="out">Sortie</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stocks;

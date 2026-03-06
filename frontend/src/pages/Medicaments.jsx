import { useState, useEffect } from 'react';
import { medicamentService } from '../services/api';

const Medicaments = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    dosage: '',
    batch_number: '',
    expiration_date: '',
    alert_threshold: 10,
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMedicaments();
  }, [search]);

  const loadMedicaments = async () => {
    try {
      const response = await medicamentService.getAll({ search });
      setMedicaments(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await medicamentService.update(editingId, formData);
      } else {
        await medicamentService.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadMedicaments();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (med) => {
    setFormData({
      name: med.name,
      category: med.category,
      dosage: med.dosage,
      batch_number: med.batch_number,
      expiration_date: med.expiration_date,
      alert_threshold: med.alert_threshold,
    });
    setEditingId(med.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce médicament?')) {
      try {
        await medicamentService.delete(id);
        loadMedicaments();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      dosage: '',
      batch_number: '',
      expiration_date: '',
      alert_threshold: 10,
    });
    setEditingId(null);
  };

  const getStockStatus = (med) => {
    if (!med.stock) return 'badge-info';
    if (med.stock.quantity <= med.alert_threshold) return 'badge-danger';
    return 'badge-success';
  };

  const getExpirationStatus = (med) => {
    const expDate = new Date(med.expiration_date);
    const now = new Date();
    const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'badge-danger';
    if (diffDays <= 30) return 'badge-warning';
    return 'badge-success';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Médicaments</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
        >
          + Ajouter un médicament
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-md"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Dosage</th>
                <th>Lot</th>
                <th>Expiration</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicaments.map((med) => (
                <tr key={med.id}>
                  <td className="font-medium">{med.name}</td>
                  <td>{med.category}</td>
                  <td>{med.dosage}</td>
                  <td>{med.batch_number}</td>
                  <td>
                    <span className={`badge ${getExpirationStatus(med)}`}>
                      {new Date(med.expiration_date).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStockStatus(med)}`}>
                      {med.stock?.quantity || 0}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(med)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(med.id)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Modifier' : 'Ajouter'} un médicament
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de lot</label>
                  <input
                    type="text"
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                  <input
                    type="date"
                    value={formData.expiration_date}
                    onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seuil d'alerte</label>
                  <input
                    type="number"
                    value={formData.alert_threshold}
                    onChange={(e) => setFormData({ ...formData, alert_threshold: e.target.value })}
                    className="input"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
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

export default Medicaments;

import { useState, useEffect } from 'react';
import { commandeService, fournisseurService, medicamentService } from '../services/api';

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fournisseur_id: '',
    items: [{ medicament_id: '', quantity: 1 }],
  });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadCommandes();
    loadFournisseurs();
    loadMedicaments();
  }, [filter]);

  const loadCommandes = async () => {
    try {
      const response = await commandeService.getAll({ status: filter });
      setCommandes(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFournisseurs = async () => {
    try {
      const response = await fournisseurService.getAllList();
      setFournisseurs(response.data);
    } catch (error) {
      console.error('Error:', error);
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
      await commandeService.create(formData);
      setShowModal(false);
      setFormData({ fournisseur_id: '', items: [{ medicament_id: '', quantity: 1 }] });
      loadCommandes();
    } catch (error) {
      alert('Erreur');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await commandeService.update(id, { status });
      loadCommandes();
    } catch (error) {
      alert('Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr?')) {
      try {
        await commandeService.delete(id);
        loadCommandes();
      } catch (error) {
        alert('Erreur');
      }
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { medicament_id: '', quantity: 1 }],
    });
  };

  const removeItem = (index) => {
    const items = [...formData.items];
    items.splice(index, 1);
    setFormData({ ...formData, items });
  };

  const updateItem = (index, field, value) => {
    const items = [...formData.items];
    items[index][field] = value;
    setFormData({ ...formData, items });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      received: 'badge-success',
      cancelled: 'badge-danger',
    };
    return badges[status] || 'badge-info';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      received: 'Reçue',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Commandes</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Nouvelle commande
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-lg ${!filter ? 'btn-primary' : 'bg-gray-200'}`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'btn-primary' : 'bg-gray-200'}`}
        >
          En attente
        </button>
        <button
          onClick={() => setFilter('received')}
          className={`px-4 py-2 rounded-lg ${filter === 'received' ? 'btn-primary' : 'bg-gray-200'}`}
        >
          Reçues
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-lg ${filter === 'cancelled' ? 'btn-primary' : 'bg-gray-200'}`}
        >
          Annulées
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <div className="space-y-4">
          {commandes.map((commande) => (
            <div key={commande.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">
                    Commande #{commande.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Fournisseur: {commande.fournisseur?.name} | 
                    Date: {new Date(commande.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className={`badge ${getStatusBadge(commande.status)}`}>
                  {getStatusLabel(commande.status)}
                </span>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm font-medium mb-2">Articles:</p>
                <div className="space-y-1">
                  {commande.items?.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      - {item.medicament?.name} (x{item.quantity})
                    </div>
                  ))}
                </div>
              </div>
              {commande.status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-3 border-t">
                  <button
                    onClick={() => handleStatusChange(commande.id, 'received')}
                    className="btn-primary text-sm"
                  >
                    Marquer reçue
                  </button>
                  <button
                    onClick={() => handleStatusChange(commande.id, 'cancelled')}
                    className="btn-danger text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDelete(commande.id)}
                    className="text-red-600 text-sm hover:underline ml-auto"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nouvelle commande</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fournisseur
                </label>
                <select
                  value={formData.fournisseur_id}
                  onChange={(e) => setFormData({ ...formData, fournisseur_id: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {fournisseurs.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Articles
                </label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={item.medicament_id}
                      onChange={(e) => updateItem(index, 'medicament_id', e.target.value)}
                      className="input flex-1"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {medicaments.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className="input w-20"
                      min="1"
                      required
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="text-[#2E8B57] text-sm hover:underline"
                >
                  + Ajouter un article
                </button>
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
                  Créer la commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commandes;

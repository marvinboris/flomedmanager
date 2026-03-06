<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rapport Commandes</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #2E8B57; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #2E8B57; color: white; }
    </style>
</head>
<body>
    <h1>Rapport Commandes - FloMedManager</h1>
    <p>Date: {{ date('Y-m-d') }}</p>
    
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Fournisseur</th>
                <th>Statut</th>
                <th>Articles</th>
            </tr>
        </thead>
        <tbody>
            @foreach($commandes as $commande)
            <tr>
                <td>{{ $commande->created_at }}</td>
                <td>{{ $commande->fournisseur->name }}</td>
                <td>{{ $commande->status }}</td>
                <td>
                    @foreach($commande->items as $item)
                        {{ $item->medicament->name }} ({{ $item->quantity }})
                        @if(!$loop->last), @endif
                    @endforeach
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rapport Mouvements</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #2E8B57; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #2E8B57; color: white; }
    </style>
</head>
<body>
    <h1>Rapport Mouvements de Stock - FloMedManager</h1>
    <p>Date: {{ date('Y-m-d') }}</p>
    
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Médicament</th>
                <th>Type</th>
                <th>Quantité</th>
                <th>Utilisateur</th>
            </tr>
        </thead>
        <tbody>
            @foreach($movements as $movement)
            <tr>
                <td>{{ $movement->created_at }}</td>
                <td>{{ $movement->medicament->name }}</td>
                <td>{{ $movement->type === 'in' ? 'Entrée' : 'Sortie' }}</td>
                <td>{{ $movement->quantity }}</td>
                <td>{{ $movement->user->name }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

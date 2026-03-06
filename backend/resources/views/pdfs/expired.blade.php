<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rapport Médicaments Expirés</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #dc3545; color: white; }
    </style>
</head>
<body>
    <h1>Rapport Médicaments Expirés - FloMedManager</h1>
    <p>Date: {{ date('Y-m-d') }}</p>
    
    <table>
        <thead>
            <tr>
                <th>Médicament</th>
                <th>Catégorie</th>
                <th>Dosage</th>
                <th>Lot</th>
                <th>Expiration</th>
                <th>Quantité</th>
            </tr>
        </thead>
        <tbody>
            @foreach($medicaments as $med)
            <tr>
                <td>{{ $med->name }}</td>
                <td>{{ $med->category }}</td>
                <td>{{ $med->dosage }}</td>
                <td>{{ $med->batch_number }}</td>
                <td>{{ $med->expiration_date }}</td>
                <td>{{ $med->stock ? $med->stock->quantity : 0 }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

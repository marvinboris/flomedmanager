<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rapport de Stock</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #2E8B57; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #2E8B57; color: white; }
        .alert { color: red; }
    </style>
</head>
<body>
    <h1>Rapport de Stock - FloMedManager</h1>
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
            @foreach($stocks as $stock)
            <tr>
                <td>{{ $stock->medicament->name }}</td>
                <td>{{ $stock->medicament->category }}</td>
                <td>{{ $stock->medicament->dosage }}</td>
                <td>{{ $stock->medicament->batch_number }}</td>
                <td>{{ $stock->medicament->expiration_date }}</td>
                <td>{{ $stock->quantity }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

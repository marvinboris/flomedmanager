<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\Medicament;
use App\Models\Stock;
use App\Models\Fournisseur;
use App\Models\Commande;
use App\Models\CommandeItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'administrateur'],
            ['name' => 'pharmacien'],
            ['name' => 'magasinier'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }

        $adminRole = Role::where('name', 'administrateur')->first();
        $pharmacistRole = Role::where('name', 'pharmacien')->first();
        $storekeeperRole = Role::where('name', 'magasinier')->first();

        User::firstOrCreate(
            ['email' => 'admin@flomed.com'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'pharmacien@flomed.com'],
            [
                'name' => 'Pharmacien',
                'password' => Hash::make('password123'),
                'role_id' => $pharmacistRole->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'magasinier@flomed.com'],
            [
                'name' => 'Magasinier',
                'password' => Hash::make('password123'),
                'role_id' => $storekeeperRole->id,
            ]
        );

        $fournisseurs = [
            ['name' => 'PharmaPlus', 'phone' => '+33 1 23 45 67 89', 'email' => 'contact@pharmaplus.fr', 'address' => '123 Rue de la Pharma, Paris'],
            ['name' => 'MediDist', 'phone' => '+33 1 98 76 54 32', 'email' => 'vente@medidist.fr', 'address' => '456 Avenue Médicale, Lyon'],
            ['name' => 'BioPharm', 'phone' => '+33 1 55 44 33 22', 'email' => 'info@biopharm.fr', 'address' => '789 Boulevard Santé, Marseille'],
        ];

        foreach ($fournisseurs as $fournisseur) {
            Fournisseur::firstOrCreate(['email' => $fournisseur['email']], $fournisseur);
        }

        $medicaments = [
            ['name' => 'Paracétamol 500mg', 'category' => 'Antalgique', 'dosage' => '500mg', 'batch_number' => 'BATCH001', 'expiration_date' => '2027-06-15', 'alert_threshold' => 50],
            ['name' => 'Amoxicilline 1g', 'category' => 'Antibiotique', 'dosage' => '1g', 'batch_number' => 'BATCH002', 'expiration_date' => '2026-12-01', 'alert_threshold' => 30],
            ['name' => 'Ibuprofène 400mg', 'category' => 'Anti-inflammatoire', 'dosage' => '400mg', 'batch_number' => 'BATCH003', 'expiration_date' => '2027-03-20', 'alert_threshold' => 40],
            ['name' => 'Doliprane 1g', 'category' => 'Antalgique', 'dosage' => '1g', 'batch_number' => 'BATCH004', 'expiration_date' => '2026-08-10', 'alert_threshold' => 25],
            ['name' => 'Aspirine 500mg', 'category' => 'Antalgique', 'dosage' => '500mg', 'batch_number' => 'BATCH005', 'expiration_date' => '2027-01-30', 'alert_threshold' => 35],
            ['name' => 'Tramadol 50mg', 'category' => 'Antalgique', 'dosage' => '50mg', 'batch_number' => 'BATCH006', 'expiration_date' => '2026-11-15', 'alert_threshold' => 15],
            ['name' => 'Metronidazole 500mg', 'category' => 'Antibiotique', 'dosage' => '500mg', 'batch_number' => 'BATCH007', 'expiration_date' => '2026-09-30', 'alert_threshold' => 20],
            ['name' => 'Oméprazole 20mg', 'category' => 'Inhibiteur de pompe à protons', 'dosage' => '20mg', 'batch_number' => 'BATCH008', 'expiration_date' => '2027-08-25', 'alert_threshold' => 45],
            ['name' => 'Levocetirizine 5mg', 'category' => 'Antihistaminique', 'dosage' => '5mg', 'batch_number' => 'BATCH009', 'expiration_date' => '2027-04-12', 'alert_threshold' => 30],
            ['name' => 'Prednisone 20mg', 'category' => 'Corticoïde', 'dosage' => '20mg', 'batch_number' => 'BATCH010', 'expiration_date' => '2026-07-20', 'alert_threshold' => 20],
        ];

        foreach ($medicaments as $medData) {
            $medicament = Medicament::firstOrCreate(
                ['batch_number' => $medData['batch_number']],
                $medData
            );

            Stock::firstOrCreate(
                ['medicament_id' => $medicament->id],
                ['quantity' => rand(10, 200)]
            );
        }

        $fournisseur1 = Fournisseur::where('name', 'PharmaPlus')->first();
        $medicamentsList = Medicament::take(3)->get();

        if ($fournisseur1 && $medicamentsList->count() >= 3) {
            $commande = Commande::create([
                'fournisseur_id' => $fournisseur1->id,
                'status' => 'pending',
            ]);

            foreach ($medicamentsList as $index => $med) {
                CommandeItem::create([
                    'commande_id' => $commande->id,
                    'medicament_id' => $med->id,
                    'quantity' => rand(20, 50),
                ]);
            }
        }
    }
}

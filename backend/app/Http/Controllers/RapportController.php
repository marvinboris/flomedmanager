<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medicament;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Models\Commande;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\StockExport;
use App\Exports\ExpiredMedicamentsExport;
use App\Exports\MovementsExport;
use App\Exports\CommandesExport;

class RapportController extends Controller
{
    public function dashboard()
    {
        $totalMedicaments = Medicament::count();
        
        $totalStock = Stock::sum('quantity');
        
        $lowStockCount = Medicament::with('stock')
            ->get()
            ->filter(function ($med) {
                return $med->isLowStock();
            })
            ->count();
        
        $expiringSoonCount = Medicament::with('stock')
            ->get()
            ->filter(function ($med) {
                return $med->isExpiringSoon(30);
            })
            ->count();
        
        $expiredCount = Medicament::where('expiration_date', '<', now())->count();
        
        $totalCommandes = Commande::count();
        $pendingCommandes = Commande::where('status', 'pending')->count();
        
        $recentMovements = StockMovement::with(['medicament', 'user'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'totalMedicaments' => $totalMedicaments,
            'totalStock' => $totalStock,
            'lowStockCount' => $lowStockCount,
            'expiringSoonCount' => $expiringSoonCount,
            'expiredCount' => $expiredCount,
            'totalCommandes' => $totalCommandes,
            'pendingCommandes' => $pendingCommandes,
            'recentMovements' => $recentMovements,
        ]);
    }

    public function exportStockPdf()
    {
        $stocks = Stock::with('medicament')->get();
        
        $pdf = Pdf::loadView('pdfs.stock', compact('stocks'));
        
        return $pdf->download('rapport_stock_' . date('Y-m-d') . '.pdf');
    }

    public function exportStockExcel()
    {
        return Excel::download(new StockExport(), 'rapport_stock_' . date('Y-m-d') . '.xlsx');
    }

    public function exportExpiredPdf()
    {
        $medicaments = Medicament::with('stock')
            ->where('expiration_date', '<', now())
            ->get();
        
        $pdf = Pdf::loadView('pdfs.expired', compact('medicaments'));
        
        return $pdf->download('rapport_expires_' . date('Y-m-d') . '.pdf');
    }

    public function exportExpiredExcel()
    {
        return Excel::download(new ExpiredMedicamentsExport(), 'rapport_expires_' . date('Y-m-d') . '.xlsx');
    }

    public function exportMovementsPdf(Request $request)
    {
        $query = StockMovement::with(['medicament', 'user']);
        
        if ($request->start_date) {
            $query->where('created_at', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->where('created_at', '<=', $request->end_date);
        }
        
        $movements = $query->orderBy('created_at', 'desc')->get();
        
        $pdf = Pdf::loadView('pdfs.movements', compact('movements'));
        
        return $pdf->download('rapport_mouvements_' . date('Y-m-d') . '.pdf');
    }

    public function exportMovementsExcel(Request $request)
    {
        return Excel::download(new MovementsExport($request), 'rapport_mouvements_' . date('Y-m-d') . '.xlsx');
    }

    public function exportCommandesPdf(Request $request)
    {
        $query = Commande::with(['fournisseur', 'items.medicament']);
        
        if ($request->status) {
            $query->where('status', $request->status);
        }
        
        $commandes = $query->orderBy('created_at', 'desc')->get();
        
        $pdf = Pdf::loadView('pdfs.commandes', compact('commandes'));
        
        return $pdf->download('rapport_commandes_' . date('Y-m-d') . '.pdf');
    }

    public function exportCommandesExcel(Request $request)
    {
        return Excel::download(new CommandesExport($request), 'rapport_commandes_' . date('Y-m-d') . '.xlsx');
    }
}

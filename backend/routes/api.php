<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RapportController;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    Route::get('/dashboard', [RapportController::class, 'dashboard']);
    
    Route::apiResource('medicaments', MedicamentController::class);
    Route::get('/medicaments/categories', [MedicamentController::class, 'categories']);
    Route::get('/medicaments/low-stock', [MedicamentController::class, 'lowStock']);
    Route::get('/medicaments/expiring-soon', [MedicamentController::class, 'expiringSoon']);
    Route::get('/medicaments/expired', [MedicamentController::class, 'expired']);
    
    Route::apiResource('stocks', StockController::class);
    Route::post('/stocks/movement', [StockController::class, 'movement']);
    Route::get('/stocks/history', [StockController::class, 'history']);
    
    Route::apiResource('fournisseurs', FournisseurController::class);
    Route::get('/fournisseurs/all', [FournisseurController::class, 'all']);
    
    Route::apiResource('commandes', CommandeController::class);
    
    Route::apiResource('users', UserController::class);
    Route::get('/users/roles', [UserController::class, 'roles']);
    
    Route::get('/rapports/stock/pdf', [RapportController::class, 'exportStockPdf']);
    Route::get('/rapports/stock/excel', [RapportController::class, 'exportStockExcel']);
    Route::get('/rapports/expired/pdf', [RapportController::class, 'exportExpiredPdf']);
    Route::get('/rapports/expired/excel', [RapportController::class, 'exportExpiredExcel']);
    Route::get('/rapports/movements/pdf', [RapportController::class, 'exportMovementsPdf']);
    Route::get('/rapports/movements/excel', [RapportController::class, 'exportMovementsExcel']);
    Route::get('/rapports/commandes/pdf', [RapportController::class, 'exportCommandesPdf']);
    Route::get('/rapports/commandes/excel', [RapportController::class, 'exportCommandesExcel']);
});

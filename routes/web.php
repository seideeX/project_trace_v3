<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CAPAController;
use App\Http\Controllers\IncomingController;
use App\Http\Controllers\OutgoingController;
use App\Http\Controllers\ProcurementController;
use App\Http\Controllers\ProcurementDocumentController;
use App\Http\Controllers\ProcurementRouteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:user|admin'])->group(function () {
    Route::get('user/dashboard', [DashboardController::class, 'user_dashboard'])->name('dashboard');
    Route::get('admin/dashboard', [DashboardController::class, 'admin_dashboard'])->name('admin.dashboard');

    Route::post('/procurement/{procurement}/route', [ProcurementController::class, 'route'])
    ->name('procurement.route');
    Route::post(
    '/procurement/{procurement}/retrieve',
        [ProcurementController::class, 'retrieve']
    )->name('procurement.retrieve');
    Route::post(
        '/procurement-routes/{route}/receive',
        [ProcurementRouteController::class, 'receive']
    )->name('procurement-routes.receive');
    Route::post(
        '/procurements/{procurement}/documents',
        [ProcurementDocumentController::class, 'store']
    )->name('procurements.documents.store');
    Route::delete(
        '/procurement/document/{document}',
        [ProcurementDocumentController::class, 'destroy']
    )->name('procurement.document.destroy');
    Route::get('/documents/{document}/download',[ProcurementDocumentController::class, 'download'])->name('documents.download');

    Route::put('/users/{user}/reset-password',[UserController::class, 'resetPassword'])->name('admin.users.reset-password');
    Route::get('/procurement/{procurement}/details',[ProcurementController::class, 'details'])->name('procurement.details');

    Route::post('purchase-request/{purchaseRequest}/feedback', [PurchaseRequestController::class, 'storeFeedback'])
    ->name('purchase-request.feedback');
    Route::get('purchase-request/{purchaseRequest}/print', [PurchaseRequestController::class, 'print'])
    ->name('purchase-request.print');

    Route::resource('procurement', ProcurementController::class);
    Route::resource('purchase-request', PurchaseRequestController::class);
    Route::resource('user', UserController::class);
    Route::resource('route', ProcurementRouteController::class);
    Route::resource('incoming', IncomingController::class);
    Route::resource('outgoing', OutgoingController::class);



    Route::get('/capa', [CAPAController::class, 'index'])->name('capa.index');
    Route::get('/capa-management', [CAPAController::class, 'management'])->name('capa.management');
    Route::get('/capa/template/download', [CAPAController::class, 'downloadTemplate'])->name('capa.template');
    Route::post('/capa', [CAPAController::class, 'store'])->name('capa.store');
    Route::post('/capa/import', [CAPAController::class, 'import'])->name('capa.import');
    Route::put('/capa/{cAPA}', [CAPAController::class, 'update'])->name('capa.update');
    Route::delete('/capa/{cAPA}', [CAPAController::class, 'destroy'])->name('capa.destroy');
    // Add more user routes here
});

require __DIR__.'/auth.php';

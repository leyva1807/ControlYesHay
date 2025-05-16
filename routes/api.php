<?php

use Illuminate\Support\Facades\Route;
// Asegúrate de que el nombre de la clase aquí coincida con el nombre de la clase en el archivo del controlador
use App\Http\Controllers\WhatsAppWebhookController; // Cambiado de WebhookController

// Ruta para la verificación del webhook por Meta (GET)
Route::get('/webhook/whatsapp', [WhatsAppWebhookController::class, 'verifyWebhook']);

// Ruta para recibir notificaciones de Meta (POST)
Route::post('/webhook/whatsapp', [WhatsAppWebhookController::class, 'handleWebhook']);

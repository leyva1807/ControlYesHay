<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException; // Para un manejo de excepciones más específico
use Illuminate\Support\Facades\Storage; // Si vas a usar el método downloadMedia

class WhatsAppWebhookController extends Controller
{
    private const MESSAGE_TYPE_TEXT = 'text';
    private const MESSAGE_TYPE_INTERACTIVE = 'interactive';
    private const MESSAGE_TYPE_IMAGE = 'image';
    // ... puedes añadir otros tipos de mensaje que esperes manejar

    /**
     * Verifica el endpoint del Webhook con Meta.
     * Meta enviará una petición GET a tu URL de Webhook.
     */
    public function verifyWebhook(Request $request)
    {
        $verifyToken = env('WHATSAPP_VERIFY_TOKEN');

        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        if ($mode && $token) {
            if ($mode === 'subscribe' && $token === $verifyToken) {
                Log::info('Webhook verificado exitosamente!');
                return response($challenge, 200);
            } else {
                Log::warning('Fallo en la verificación del Webhook. Tokens no coinciden o modo incorrecto.', [
                    'mode_received' => $mode,
                    'token_received' => $token,
                ]);
                return response('Verification failed', 403);
            }
        }
        Log::warning('Faltan parámetros hub.mode o hub.verify_token en la petición de verificación.');
        return response('Missing parameters', 400);
    }

    /**
     * Maneja las notificaciones entrantes de WhatsApp (mensajes, estados, etc.).
     * Meta enviará una petición POST a tu URL de Webhook con el payload del evento.
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        Log::info('📩 Webhook Payload Recibido:', ['payload' => $payload]);

        $signature = $request->header('X-Hub-Signature-256');
        if (!$this->isValidSignature($request->getContent(), $signature)) {
            Log::warning('Firma de Webhook inválida. Petición rechazada.');
            return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 403);
        }
        Log::info('Firma de Webhook validada correctamente.');

        if (!empty($payload['entry'])) {
            foreach ($payload['entry'] as $entry) {
                if (!empty($entry['changes'])) {
                    foreach ($entry['changes'] as $change) {
                        if ($change['field'] === 'messages') {
                            $value = $change['value'];

                            if (!empty($value['messages'])) {
                                foreach ($value['messages'] as $message) {
                                    $this->processIncomingMessage($message, $value['metadata'] ?? null);
                                }
                            }

                            if (!empty($value['statuses'])) {
                                foreach ($value['statuses'] as $status) {
                                    $this->processMessageStatus($status);
                                }
                            }
                        }
                    }
                }
            }
        }

        return response()->json(['status' => 'EVENT_RECEIVED'], 200);
    }

    /**
     * Valida la firma HMAC-SHA256 de la petición de Meta.
     */
    private function isValidSignature(string $payloadContent, ?string $signatureHeader): bool
    {
        if (!$signatureHeader) {
            Log::warning('No se encontró la cabecera X-Hub-Signature-256.');
            return false;
        }

        $appSecret = env('WHATSAPP_APP_SECRET');
        if (!$appSecret) {
            Log::error('WHATSAPP_APP_SECRET no está configurado en el archivo .env. No se puede validar la firma.');
            return false;
        }

        if (strpos($signatureHeader, 'sha256=') !== 0) {
            Log::warning('Formato de firma inválido. Esperado: sha256=xxxx', ['signature' => $signatureHeader]);
            return false;
        }
        $expectedSignature = substr($signatureHeader, strlen('sha256='));
        $calculatedSignature = hash_hmac('sha256', $payloadContent, $appSecret);

        if (!hash_equals($calculatedSignature, $expectedSignature)) {
            Log::warning('Discrepancia en la firma HMAC.', [
                'calculated' => $calculatedSignature,
                'expected' => $expectedSignature,
            ]);
            return false;
        }
        return true;
    }

    /**
     * Procesa un mensaje individual entrante de WhatsApp.
     */
    protected function processIncomingMessage(array $message, ?array $metadata)
    {
        $messageType = $message['type'] ?? 'unknown';
        $from = $message['from']; // Número del remitente
        $messageId = $message['id']; // ID del mensaje de WhatsApp

        Log::info("Procesando mensaje [ID: {$messageId}] de [{$from}] del tipo [{$messageType}]");

        switch ($messageType) {
            case self::MESSAGE_TYPE_TEXT:
                $textBody = $message['text']['body'] ?? '';
                Log::info("👤 Mensaje de texto de {$from}: {$textBody}");
                if (strtolower(trim($textBody)) === 'hola') {
                    $responseText = "¡Hola! Bienvenido a Remesas Yeshay. ¿En qué te puedo ayudar?";
                    $this->sendWhatsAppMessage($from, $responseText);
                    Log::info("Respuesta enviada a {$from}: {$responseText}");
                }
                // Aquí puedes añadir más lógica para procesar diferentes textos
                // Ejemplo: if (str_contains(strtolower($textBody), 'ayuda')) { ... }
                break;

            case self::MESSAGE_TYPE_INTERACTIVE:
                $interactiveData = $message['interactive'];
                if (isset($interactiveData['button_reply'])) {
                    $buttonId = $interactiveData['button_reply']['id'];
                    $buttonTitle = $interactiveData['button_reply']['title'];
                    Log::info("Botón presionado por {$from}: ID '{$buttonId}', Título '{$buttonTitle}'");
                    // Lógica para el botón presionado
                    // Ejemplo: if ($buttonId === 'id_boton_consulta') { $this->sendWhatsAppMessage($from, "Has presionado el botón de consulta."); }
                } elseif (isset($interactiveData['list_reply'])) {
                    $listId = $interactiveData['list_reply']['id'];
                    $listTitle = $interactiveData['list_reply']['title'];
                    Log::info("Opción de lista seleccionada por {$from}: ID '{$listId}', Título '{$listTitle}'");
                    // Lógica para la opción de lista seleccionada
                    // Ejemplo: if ($listId === 'id_opcion_saldo') { $this->sendWhatsAppMessage($from, "Has seleccionado ver tu saldo."); }
                }
                break;

            case self::MESSAGE_TYPE_IMAGE:
                $imageId = $message['image']['id'] ?? null;
                $caption = $message['image']['caption'] ?? '';
                Log::info("🖼️ Mensaje de imagen recibido de {$from}. ID: {$imageId}, Caption: '{$caption}'");
                // Aquí podrías usar el $imageId para descargar la imagen si es necesario.
                // if ($imageId) { $this->downloadMedia($imageId); }
                break;

            // Agrega más 'case' para otros tipos: audio, video, location, contacts, document, etc.
            default:
                Log::warning("Tipo de mensaje [{$messageType}] no manejado desde [{$from}].", ['message' => $message]);
                break;
        }
    }

    /**
     * Procesa una actualización de estado de un mensaje de WhatsApp.
     */
    protected function processMessageStatus(array $status)
    {
        $messageId = $status['id'];
        $recipientId = $status['recipient_id'];
        $newStatus = $status['status'];
        $timestamp = $status['timestamp'];

        Log::info("Actualización de estado para mensaje [ID: {$messageId}] a [{$recipientId}]. Nuevo estado: [{$newStatus}] en [" . date('Y-m-d H:i:s', (int)$timestamp) . "]");

        // Ejemplo de actualización en base de datos (requiere modelo y migración MessageLog)
        /*
        if (class_exists(\App\Models\MessageLog::class)) {
            try {
                \App\Models\MessageLog::updateOrCreate(
                    ['whatsapp_message_id' => $messageId],
                    [
                        'status' => $newStatus,
                        'status_updated_at' => date('Y-m-d H:i:s', (int)$timestamp),
                        'recipient_id' => $recipientId,
                        'conversation_id' => $status['conversation']['id'] ?? null, // Si está disponible
                        'pricing_model' => $status['pricing']['pricing_model'] ?? null // Si está disponible
                    ]
                );
            } catch (\Exception $e) {
                Log::error("Error al actualizar MessageLog para {$messageId}: " . $e->getMessage());
            }
        }
        */

        if ($newStatus === 'failed') {
            $errors = $status['errors'] ?? [];
            Log::error("El mensaje [ID: {$messageId}] falló al enviar a [{$recipientId}].", ['errors' => $errors]);
            // Lógica para manejar mensajes fallidos (reintentar, notificar al administrador, etc.)
        }
    }

    /**
     * Envía un mensaje de texto a través de la API de WhatsApp Cloud.
     *
     * @param string $recipientPhoneNumber El número de teléfono del destinatario (con código de país).
     * @param string $messageText El texto del mensaje a enviar.
     * @return bool True si el mensaje fue aceptado por la API, false en caso contrario.
     */
    protected function sendWhatsAppMessage(string $recipientPhoneNumber, string $messageText): bool
    {
        $whatsAppToken = env('WHATSAPP_CLOUD_API_TOKEN');
        $phoneNumberId = env('WHATSAPP_PHONE_NUMBER_ID');
        $apiVersion = env('WHATSAPP_API_VERSION', 'v19.0'); // Fallback a v19.0 si no está en .env

        if (!$whatsAppToken || !$phoneNumberId) {
            Log::error('Faltan las variables de entorno WHATSAPP_CLOUD_API_TOKEN o WHATSAPP_PHONE_NUMBER_ID para enviar mensajes.');
            return false;
        }

        $url = "https://graph.facebook.com/{$apiVersion}/{$phoneNumberId}/messages";

        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $recipientPhoneNumber,
            'type' => 'text',
            'text' => [
                'preview_url' => false, // Cambiar a true si se desea previsualización de URLs
                'body' => $messageText,
            ],
        ];

        try {
            $response = Http::withToken($whatsAppToken)
                ->timeout(30) // Tiempo de espera de 30 segundos
                ->post($url, $payload);

            if ($response->successful()) {
                Log::info("Mensaje enviado exitosamente a {$recipientPhoneNumber}.", ['response' => $response->json() ?? $response->body()]);
                // Considera guardar el ID del mensaje devuelto por la API:
                // $messageApiId = $response->json('messages.0.id'); // Forma más segura de acceder
                return true;
            } else {
                Log::error("Error al enviar mensaje a {$recipientPhoneNumber}. Status: {$response->status()}", [
                    'response_body' => $response->body(),
                    'payload_sent' => $payload
                ]);
                return false;
            }
        } catch (RequestException $e) {
            Log::error("Excepción de cliente HTTP al enviar mensaje a {$recipientPhoneNumber}: " . $e->getMessage(), [
                'response_body' => $e->response ? $e->response->body() : 'N/A'
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error("Excepción general al enviar mensaje a {$recipientPhoneNumber}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Opcional: Método para descargar media si lo necesitas.
     *
     * @param string $mediaId El ID del medio a descargar.
     * @return string|null La URL del medio o la ruta al archivo guardado, o null si falla.
     */
    /*
    protected function downloadMedia(string $mediaId): ?string
    {
        $whatsAppToken = env('WHATSAPP_CLOUD_API_TOKEN');
        $apiVersion = env('WHATSAPP_API_VERSION', 'v19.0');

        if (!$whatsAppToken) {
            Log::error('WHATSAPP_CLOUD_API_TOKEN no configurado para descargar media.');
            return null;
        }

        $mediaInfoUrl = "https://graph.facebook.com/{$apiVersion}/{$mediaId}";

        try {
            // 1. Obtener la URL del medio
            $infoResponse = Http::withToken($whatsAppToken)->timeout(30)->get($mediaInfoUrl);

            if (!$infoResponse->successful() || !isset($infoResponse->json()['url'])) {
                Log::error("Error al obtener URL de media para ID {$mediaId}. Status: {$infoResponse->status()}", ['response_body' => $infoResponse->body()]);
                return null;
            }

            $mediaUrl = $infoResponse->json()['url'];
            Log::info("URL de media obtenida: {$mediaUrl} para ID: {$mediaId}");

            // 2. Descargar el contenido del archivo desde la URL obtenida
            $fileContentsResponse = Http::withToken($whatsAppToken) // El token es necesario para la URL de descarga también
                                      ->timeout(60) // Mayor timeout para descargas
                                      ->get($mediaUrl);

            if ($fileContentsResponse->successful()) {
                // Determinar la extensión del archivo a partir del Content-Type o la URL
                $contentType = $fileContentsResponse->header('Content-Type');
                $extension = $this->getExtensionFromContentType($contentType);
                if (!$extension && parse_url($mediaUrl, PHP_URL_PATH)) {
                    $pathInfo = pathinfo(parse_url($mediaUrl, PHP_URL_PATH));
                    if (isset($pathInfo['extension'])) {
                        $extension = $pathInfo['extension'];
                    }
                }
                $extension = $extension ?: 'dat'; // Fallback a .dat si no se puede determinar

                $fileName = "whatsapp_media/{$mediaId}_" . time() . ".{$extension}";

                Storage::disk('local')->put($fileName, $fileContentsResponse->body());
                Log::info("Media descargada y guardada en: {$fileName}");
                return Storage::url($fileName); // O la ruta absoluta: Storage::path($fileName)
            } else {
                Log::error("Error al descargar contenido de media desde {$mediaUrl}. Status: " . $fileContentsResponse->status(), ['response_body' => $fileContentsResponse->body()]);
            }

        } catch (RequestException $e) {
            Log::error("Excepción de cliente HTTP durante la descarga de media para ID {$mediaId}: " . $e->getMessage(), [
                'response_body' => $e->response ? $e->response->body() : 'N/A'
            ]);
        } catch (\Exception $e) {
            Log::error("Excepción general durante la descarga de media para ID {$mediaId}: " . $e->getMessage());
        }
        return null;
    }

    private function getExtensionFromContentType(?string $contentType): ?string
    {
        if (!$contentType) return null;
        $map = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'video/mp4' => 'mp4',
            'audio/aac' => 'aac',
            'audio/mpeg' => 'mp3',
            'audio/ogg' => 'ogg',
            'application/pdf' => 'pdf',
            // Añade más mapeos según sea necesario
        ];
        return $map[$contentType] ?? null;
    }
    */
}

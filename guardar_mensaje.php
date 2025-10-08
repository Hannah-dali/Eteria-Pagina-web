<?php
header('Content-Type: application/json');

// Permitir solicitudes desde cualquier origen (para desarrollo)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Verificar que sea una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Ruta al archivo JSON
    $archivo = __DIR__ . '/data/mensajes.json';

try {
    // Obtener los datos enviados
    $jsonData = file_get_contents('php://input');
    $datos = json_decode($jsonData, true);

    // Verificar si es una acción de limpieza
    if (isset($datos['action']) && $datos['action'] === 'clear') {
        // Asegurarse de que el archivo existe
        if (!file_exists(__DIR__ . '/data')) {
            mkdir(__DIR__ . '/data', 0777, true);
        }
        
        // Limpiar el archivo JSON creando un array vacío
        if (file_put_contents($archivo, json_encode(['mensajes' => []], JSON_PRETTY_PRINT)) === false) {
            throw new Exception('Error al limpiar el archivo de mensajes');
        }
        
        echo json_encode(['success' => true, 'message' => 'Notificaciones limpiadas']);
        exit;
    }

    // Verificar que los datos sean válidos para un nuevo mensaje
    if (!$datos || !isset($datos['nombre']) || !isset($datos['mensaje'])) {
        throw new Exception('Datos inválidos');
    }

    // Crear directorio si no existe
    if (!file_exists(__DIR__ . '/data')) {
        mkdir(__DIR__ . '/data', 0777, true);
    }

    // Leer mensajes existentes o crear array vacío
    $mensajes = [];
    if (file_exists($archivo)) {
        $contenido = file_get_contents($archivo);
        if ($contenido) {
            $json = json_decode($contenido, true);
            if ($json && isset($json['mensajes'])) {
                $mensajes = $json['mensajes'];
            }
        }
    }

    // Agregar nuevo mensaje
    $mensajes[] = $datos;

    // Guardar en el archivo JSON
    $nuevoContenido = json_encode(['mensajes' => $mensajes], JSON_PRETTY_PRINT);
    if (file_put_contents($archivo, $nuevoContenido) === false) {
        throw new Exception('Error al escribir en el archivo');
    }

    // Responder éxito
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje guardado correctamente'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
}
?>
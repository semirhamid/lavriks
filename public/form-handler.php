<?php
header('Content-Type: application/json');

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$errors = [];

if (empty($data['fullName'])) {
    $errors['fullName'] = 'Please enter your full name';
}

if (empty($data['email'])) {
    $errors['email'] = 'Please enter your email address';
} elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address';
}

if (empty($data['telephone'])) {
    $errors['telephone'] = 'Please enter your telephone number';
} elseif (!preg_match('/^[0-9+\-\s()]*$/', $data['telephone'])) {
    $errors['telephone'] = 'Please enter a valid telephone number';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

$to = "alex@cohoda.com";
$subject = "New Contact Form Submission";
$message = "Name: " . $data['fullName'] . "\n";
$message .= "Company: " . ($data['companyName'] ?? 'Not provided') . "\n";
$message .= "Email: " . $data['email'] . "\n";
$message .= "Phone: " . $data['telephone'] . "\n";
$message .= "Message: " . ($data['message'] ?? 'Not provided') . "\n";

$headers = "From: " . $data['email'] . "\r\n";
$headers .= "Reply-To: " . $data['email'] . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $subject, $message, $headers)) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message. We will get back to you soon!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again later.'
    ]);
} 
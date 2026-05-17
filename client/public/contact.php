<?php
/**
 * Clean Heights Initiative - Contact Form Handler
 * Recommended for Namecheap cPanel Hosting
 */

// Enable error reporting for debugging (comment out in production if desired)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Please use POST.']);
    exit;
}

// Get JSON data from request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// If JSON decoding fails, try standard POST (fallback)
if (!$data) {
    $data = $_POST;
}

// Configuration
$to_email = "info@cleanheightsinitiative.org";
$from_email = "info@cleanheightsinitiative.org"; // Must be an account on your Namecheap domain
$website_name = "Clean Heights Initiative";

// Extract and sanitize fields
$name = isset($data['from_name']) ? strip_tags(trim($data['from_name'])) : '';
$email = isset($data['from_email']) ? filter_var(trim($data['from_email']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($data['phone']) ? strip_tags(trim($data['phone'])) : 'Not provided';
$org = isset($data['organisation']) ? strip_tags(trim($data['organisation'])) : 'Not provided';
$subject_line = isset($data['subject']) ? strip_tags(trim($data['subject'])) : 'New Inquiry';
$message_body = isset($data['message']) ? strip_tags(trim($data['message'])) : '';

// Honeypot check (anti-spam)
if (!empty($data['website'])) {
    // Silent fail for bots
    echo json_encode(['success' => true, 'message' => 'Message processed.']);
    exit;
}

// Basic Validation
if (empty($name) || empty($email) || empty($message_body)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please fill in all required fields (Name, Email, Message).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address.']);
    exit;
}

// Prepare HTML Email Content
$email_subject = "[$website_name] $subject_line from $name";
$email_content = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>
<body style=\"margin: 0; padding: 0; background-color: #FAF8F3; font-family: 'Inter', Helvetica, Arial, sans-serif;\">
    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'>
        <tr>
            <td align='center' style='padding: 40px 0 20px 0;'>
                <img src='https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/chi-logo-final_2d6d3417.png' alt='Clean Heights Initiative' width='120' style='display: block; width: 120px; height: auto;'>
            </td>
        </tr>
        <tr>
            <td align='center'>
                <table border='0' cellpadding='0' cellspacing='0' width='600' style='background-color: #ffffff; border: 1px solid #E5DFD3; border-radius: 8px; overflow: hidden;'>
                    <tr>
                        <td align='center' style='padding: 40px 40px 20px 40px; border-bottom: 2px solid #FAF8F3;'>
                            <h1 style=\"margin: 0; font-family: 'Playfair Display', 'Times New Roman', serif; color: #1B4332; font-size: 28px; font-weight: 700;\">New Inquiry Received</h1>
                            <p style='margin: 10px 0 0 0; color: #6B7B6B; font-size: 16px;'>You have a new message from the website contact form.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding: 40px;'>
                            <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                <tr>
                                    <td width='30%' style='padding: 10px 0; font-size: 14px; font-weight: 700; color: #1A1C1A; text-transform: uppercase; border-bottom: 1px solid #FAF8F3;'>Name</td>
                                    <td width='70%' style='padding: 10px 0; font-size: 16px; color: #3D4A3D; border-bottom: 1px solid #FAF8F3;'>$name</td>
                                </tr>
                                <tr>
                                    <td style='padding: 10px 0; font-size: 14px; font-weight: 700; color: #1A1C1A; text-transform: uppercase; border-bottom: 1px solid #FAF8F3;'>Email</td>
                                    <td style='padding: 10px 0; font-size: 16px; color: #C76F3B; border-bottom: 1px solid #FAF8F3;'>$email</td>
                                </tr>
                                <tr>
                                    <td style='padding: 10px 0; font-size: 14px; font-weight: 700; color: #1A1C1A; text-transform: uppercase; border-bottom: 1px solid #FAF8F3;'>Subject</td>
                                    <td style='padding: 10px 0; font-size: 16px; color: #3D4A3D; border-bottom: 1px solid #FAF8F3;'>$subject_line</td>
                                </tr>
                                <tr>
                                    <td style='padding: 10px 0; font-size: 14px; font-weight: 700; color: #1A1C1A; text-transform: uppercase; border-bottom: 1px solid #FAF8F3;'>Organization</td>
                                    <td style='padding: 10px 0; font-size: 16px; color: #3D4A3D; border-bottom: 1px solid #FAF8F3;'>$org</td>
                                </tr>
                                <tr>
                                    <td style='padding: 10px 0; font-size: 14px; font-weight: 700; color: #1A1C1A; text-transform: uppercase;'>Phone</td>
                                    <td style='padding: 10px 0; font-size: 16px; color: #3D4A3D;'>$phone</td>
                                </tr>
                                <tr>
                                    <td colspan='2' style='padding-top: 40px;'>
                                        <div style='background-color: #F8F9F8; border-left: 4px solid #52B788; padding: 25px; border-radius: 4px;'>
                                            <p style='margin: 0 0 10px 0; font-weight: 700; font-size: 11px; color: #52B788; text-transform: uppercase;'>The Message:</p>
                                            <p style='margin: 0; font-size: 16px; line-height: 1.6; color: #1A1C1A; white-space: pre-wrap;'>" . nl2br($message_body) . "</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align='center' style='padding: 30px; background-color: #1B4332; color: #ffffff;'>
                            <p style='margin: 0; font-size: 13px; font-weight: 600; text-transform: uppercase;'>Clean Heights Initiative</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
";

// Email Headers
$headers = "From: $website_name <$from_email>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// --- START AUTO-REPLY TO VISITOR ---
$visitor_subject = "Thank you for reaching out to Clean Heights Initiative";

$visitor_content = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>
<body style=\"margin: 0; padding: 0; background-color: #FAF8F3; font-family: 'Inter', Helvetica, Arial, sans-serif;\">
    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;'>
        <tr>
            <td align='center' style='padding: 40px 0 20px 0;'>
                <img src='https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/chi-logo-final_2d6d3417.png' alt='Clean Heights Initiative' width='120' style='display: block; width: 120px; height: auto;'>
            </td>
        </tr>
        <tr>
            <td align='center'>
                <table border='0' cellpadding='0' cellspacing='0' width='600' style='background-color: #ffffff; border: 1px solid #E5DFD3; border-radius: 8px; overflow: hidden;'>
                    <tr>
                        <td align='center' style='padding: 40px 40px 20px 40px; border-bottom: 2px solid #FAF8F3;'>
                            <h1 style=\"margin: 0; font-family: 'Playfair Display', 'Times New Roman', serif; color: #1B4332; font-size: 28px; font-weight: 700;\">Thank You, $name!</h1>
                            <p style='margin: 10px 0 0 0; color: #6B7B6B; font-size: 16px;'>We've received your inquiry and will be in touch shortly.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding: 40px;'>
                            <p style=\"color: #3D4A3D; font-size: 16px; line-height: 1.6;\">Hello $name,</p>
                            <p style=\"color: #3D4A3D; font-size: 16px; line-height: 1.6;\">Thank you for contacting <strong>Clean Heights Initiative</strong> regarding <strong>$subject_line</strong>. We appreciate you reaching out!</p>
                            <p style=\"color: #3D4A3D; font-size: 16px; line-height: 1.6;\">A member of our team in Iten is currently reviewing your message and we aim to get back to you within 24-48 hours.</p>
                            
                            <div style='background-color: #F8F9F8; border-left: 4px solid #C76F3B; padding: 25px; border-radius: 4px; margin: 30px 0;'>
                                <p style='margin: 0 0 10px 0; font-weight: 700; font-size: 11px; color: #C76F3B; text-transform: uppercase;'>Summary of your message:</p>
                                <p style='margin: 0; font-size: 14px; line-height: 1.6; color: #1A1C1A; font-style: italic;'>\"" . substr(strip_tags($message_body), 0, 150) . "...\"</p>
                            </div>

                            <p style=\"color: #3D4A3D; font-size: 16px; line-height: 1.6;\">In the meantime, feel free to explore our impact and recent milestones on our website.</p>
                            
                            <div style=\"margin-top: 30px; padding-top: 20px; border-top: 1px solid #FAF8F3;\">
                                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">
                                    <tr>
                                        <td style=\"padding-right: 15px; border-right: 2px solid #52B788;\">
                                            <img src=\"https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/chi-logo-final_2d6d3417.png\" width=\"60\" alt=\"Logo\">
                                        </td>
                                        <td style=\"padding-left: 15px;\">
                                            <p style=\"margin: 0; font-weight: 700; color: #1B4332; font-size: 14px;\">Clean Heights Initiative</p>
                                            <p style=\"margin: 2px 0 0 0; color: #C76F3B; font-size: 11px; text-transform: uppercase;\">Admin & Contact Team</p>
                                            <p style=\"margin: 5px 0 0 0; color: #6B7B6B; font-size: 12px;\"><a href=\"https://cleanheightsinitiative.org\" style=\"color: #6B7B6B; text-decoration: none;\">cleanheightsinitiative.org</a></p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align='center' style='padding: 20px; background-color: #1B4332; color: #ffffff;'>
                            <p style='margin: 0; font-size: 11px; opacity: 0.8;'>For a Pure Environment & Clean Water</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
";

$visitor_headers = "From: $website_name <$from_email>\r\n";
$visitor_headers .= "MIME-Version: 1.0\r\n";
$visitor_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$visitor_headers .= "X-Mailer: PHP/" . phpversion();

// Send email to owner
if (mail($to_email, $email_subject, $email_content, $headers)) {
    // Send auto-reply to visitor
    mail($email, $visitor_subject, $visitor_content, $visitor_headers);
    
    echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully!']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'The server was unable to send your message. Please try again later or contact us directly at ' . $to_email]);
}
?>

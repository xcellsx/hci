<<<<<<< HEAD
<?php
// Database connection parameters
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = '';
$dbName = 'usertest1';

// Create a new MySQLi instance and connect to the database
$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbName);

// Check for connection errors
if ($mysqli->connect_errno) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Redirect to the home page
header("Location: ./owncategories.html");
exit; // Ensure script stops here

// Retrieve form data and check if they are set
$name = isset($_POST['name']) ? $_POST['name'] : '';
$username = isset($_POST['username']) ? $_POST['username'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$phone = isset($_POST['phone_number']) ? $_POST['phone_number'] : '';
$birthday = isset($_POST['birthday']) ? $_POST['birthday'] : '';
$bank = isset($_POST['bank']) ? $_POST['bank'] : '';
$account_number = isset($_POST['account_number']) ? $_POST['account_number'] : '';

// Validate required fields
if (empty($name) || empty($username) || empty($email) || empty($password) || empty($phone) || empty($birthday) || empty($bank) || empty($account_number)) {
    die("All fields are required.");
}

// Hash the password before storing it in the database
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert form data into the database
$sql = "INSERT INTO usertest (name, username, email, password, phone, birthday, bank, account) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param('ssssssss', $name, $username, $email, $hashed_password, $phone, $birthday, $bank, $account_number);

if ($stmt->execute()) {
    echo "Data inserted successfully.";
} else {
    echo "Error: " . $stmt->error;
}

// Close the statement and the database connection
$stmt->close();
$mysqli->close();
?>
=======
<?php
// Database connection parameters
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = '';
$dbName = 'usertest1';

// Create a new MySQLi instance and connect to the database
$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbName);

// Check for connection errors
if ($mysqli->connect_errno) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Redirect to the home page
header("Location: ./owncategories.html");
exit; // Ensure script stops here

// Retrieve form data and check if they are set
$name = isset($_POST['name']) ? $_POST['name'] : '';
$username = isset($_POST['username']) ? $_POST['username'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$phone = isset($_POST['phone_number']) ? $_POST['phone_number'] : '';
$birthday = isset($_POST['birthday']) ? $_POST['birthday'] : '';
$bank = isset($_POST['bank']) ? $_POST['bank'] : '';
$account_number = isset($_POST['account_number']) ? $_POST['account_number'] : '';

// Validate required fields
if (empty($name) || empty($username) || empty($email) || empty($password) || empty($phone) || empty($birthday) || empty($bank) || empty($account_number)) {
    die("All fields are required.");
}

// Hash the password before storing it in the database
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert form data into the database
$sql = "INSERT INTO usertest (name, username, email, password, phone, birthday, bank, account) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param('ssssssss', $name, $username, $email, $hashed_password, $phone, $birthday, $bank, $account_number);

if ($stmt->execute()) {
    echo "Data inserted successfully.";
} else {
    echo "Error: " . $stmt->error;
}

// Close the statement and the database connection
$stmt->close();
$mysqli->close();
?>
>>>>>>> 9fe87bbe50efcaf502c9ff4087a9b21ddb5a4a22

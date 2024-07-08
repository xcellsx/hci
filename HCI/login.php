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

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve username and password from the login form
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    // Query the database to check if the user exists
    $stmt = $mysqli->prepare("SELECT password FROM usertest WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->bind_result($hashed_password);
    $stmt->fetch();

    // Verify the password
    if (password_verify($password, $hashed_password)) {
        // Start a session and store the username for future use
        session_start();
        $_SESSION['username'] = $username;
        
        // Redirect to the main page
        header("Location: ./mainpage.html");
        exit;
    } else {
        echo "Invalid username or password.";
    }

    // Close the statement
    $stmt->close();
}

// Close the database connection
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

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve username and password from the login form
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    // Query the database to check if the user exists
    $stmt = $mysqli->prepare("SELECT password FROM usertest WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->bind_result($hashed_password);
    $stmt->fetch();

    // Verify the password
    if (password_verify($password, $hashed_password)) {
        // Start a session and store the username for future use
        session_start();
        $_SESSION['username'] = $username;
        
        // Redirect to the main page
        header("Location: ./mainpage.html");
        exit;
    } else {
        echo "Invalid username or password.";
    }

    // Close the statement
    $stmt->close();
}

// Close the database connection
$mysqli->close();
?>
>>>>>>> 9fe87bbe50efcaf502c9ff4087a9b21ddb5a4a22

<?php
$host = '127.0.0.1';
$user = 'alex01d01';
$password = 'XL2fiPeVH3';
$database = 'alex01d01';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

echo "Verbindung zur Datenbank hergestellt.\n";

$sql1 = "CREATE TABLE IF NOT EXISTS ct_plans (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travel_type VARCHAR(50) NOT NULL,
    transportation_type VARCHAR(50) NOT NULL,
    travel_mode VARCHAR(50) NOT NULL,
    plan_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

$sql2 = "CREATE INDEX idx_ct_plans_username ON ct_plans(username)";
$sql3 = "CREATE INDEX idx_ct_plans_location ON ct_plans(location)";

if ($conn->query($sql1)) {
    echo "Tabelle ct_plans erfolgreich erstellt.\n";
} else {
    echo "Fehler beim Erstellen der Tabelle: " . $conn->error . "\n";
}

if ($conn->query($sql2)) {
    echo "Index für username erfolgreich erstellt.\n";
} else {
    echo "Fehler beim Erstellen des Index für username: " . $conn->error . "\n";
}

if ($conn->query($sql3)) {
    echo "Index für location erfolgreich erstellt.\n";
} else {
    echo "Fehler beim Erstellen des Index für location: " . $conn->error . "\n";
}

echo "Tabelle ct_plans wurde erfolgreich erstellt oder aktualisiert.\n";
$conn->close();
echo "Datenbankverbindung geschlossen.\n";
?>

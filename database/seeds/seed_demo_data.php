<?php
// ============================================
// Comprehensive Demo Data Seeder
// ============================================
// Seeds default admin, test student, active election, positions, candidates, and sample votes

require_once __DIR__ . '/../../backend/config/database.php';
$pdo = $GLOBALS['pdo'];

echo "=== Seeding E-Voting System Demo Data ===\n\n";

// 1. Ensure Admin User
$adminPasswordHash = password_hash('#adm!n@sup3r', PASSWORD_BCRYPT);
$adminStmt = $pdo->prepare("
    INSERT INTO users (reg_number, first_name, last_name, password_hash, role, is_active)
    VALUES ('A999999Z', 'Admin', 'SuperUser', ?, 'admin', TRUE)
    ON DUPLICATE KEY UPDATE 
        password_hash = VALUES(password_hash),
        role = 'admin',
        is_active = TRUE
");
$adminStmt->execute([$adminPasswordHash]);
echo "✓ Default Admin seeded: A999999Z / #adm!n@sup3r\n";

// 2. Ensure Test Voter
$voterPasswordHash = password_hash('Student@123', PASSWORD_BCRYPT);
$voterStmt = $pdo->prepare("
    INSERT INTO users (reg_number, first_name, last_name, password_hash, school, course, role, is_active)
    VALUES ('H230828V', 'Nigel', 'Mupira', ?, 'School of Engineering', 'Software Engineering', 'user', TRUE)
    ON DUPLICATE KEY UPDATE 
        password_hash = VALUES(password_hash),
        role = 'user',
        is_active = TRUE
");
$voterStmt->execute([$voterPasswordHash]);
echo "✓ Test Voter seeded: H230828V / Student@123\n";

// 3. Create Active Election
$adminId = $pdo->query("SELECT id FROM users WHERE reg_number = 'A999999Z'")->fetchColumn();

$electionCheck = $pdo->query("SELECT id FROM elections WHERE name = 'SRC General Elections 2026'")->fetchColumn();
if (!$electionCheck) {
    $startDate = date('Y-m-d H:i:s', strtotime('-2 days'));
    $endDate = date('Y-m-d H:i:s', strtotime('+7 days'));

    $elecStmt = $pdo->prepare("
        INSERT INTO elections (name, description, start_date, end_date, is_active, created_by)
        VALUES ('SRC General Elections 2026', 'Official Student Representative Council annual campus elections.', ?, ?, TRUE, ?)
    ");
    $elecStmt->execute([$startDate, $endDate, $adminId]);
    $electionId = $pdo->lastInsertId();
    echo "✓ Active Election created (ID: $electionId)\n";
} else {
    $electionId = $electionCheck;
    $pdo->prepare("UPDATE elections SET is_active = TRUE WHERE id = ?")->execute([$electionId]);
    echo "✓ Existing Election updated to active (ID: $electionId)\n";
}

// 4. Create Positions
$positionsData = [
    'President' => 1,
    'Vice President' => 1,
    'Secretary General' => 1,
    'Treasurer' => 1,
];

$positionIds = [];
$posStmt = $pdo->prepare("
    INSERT INTO positions (election_id, position_name, max_votes)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE max_votes = VALUES(max_votes)
");

foreach ($positionsData as $pName => $maxVotes) {
    $posStmt->execute([$electionId, $pName, $maxVotes]);
    $pId = $pdo->query("SELECT id FROM positions WHERE election_id = $electionId AND position_name = '$pName'")->fetchColumn();
    $positionIds[$pName] = $pId;
}
echo "✓ Positions seeded: " . implode(', ', array_keys($positionIds)) . "\n";

// 5. Create Candidates
$candidatesData = [
    'President' => [
        [
            'name' => 'Tinashe Moyo',
            'bio' => 'Third-year Software Engineering student dedicated to student advocacy and welfare.',
            'manifesto' => 'Transforming campus connectivity, student financial aid support, and transparent SRC governance.',
        ],
        [
            'name' => 'Kudzai Ndlovu',
            'bio' => 'Final year Business Analytics leader and President of Debate Society.',
            'manifesto' => 'Academic excellence, improved campus dining, and 24/7 library facility access.',
        ],
    ],
    'Vice President' => [
        [
            'name' => 'Chipo Mutasa',
            'bio' => 'Passionate community builder and Peer Health educator.',
            'manifesto' => 'Mental health resources expansion, career mentorship programs, and inclusivity.',
        ],
        [
            'name' => 'Farai Gumbo',
            'bio' => 'Former Sports Representative and Electrical Engineering student.',
            'manifesto' => 'Upgraded recreation facilities, intra-varsity tournaments, and campus safety.',
        ],
    ],
    'Secretary General' => [
        [
            'name' => 'Ruvimbo Sibanda',
            'bio' => 'Organized communicator with extensive administrative club experience.',
            'manifesto' => 'Open meeting minutes, digital feedback channels, and streamlined club approvals.',
        ],
        [
            'name' => 'Tariro Chikwanha',
            'bio' => 'Law student championing student rights and constitutional clarity.',
            'manifesto' => 'Accountability, fast response times to student complaints, and weekly newsletters.',
        ],
    ],
    'Treasurer' => [
        [
            'name' => 'Blessing Hove',
            'bio' => 'Finance and Accounting major with proven audit credentials.',
            'manifesto' => 'Fiscal transparency, published budget expenditure, and subsidized student activities.',
        ],
        [
            'name' => 'Nyasha Marufu',
            'bio' => 'Economics student and founder of Campus Investment Club.',
            'manifesto' => 'Optimizing student fund allocations and emergency relief grants for underprivileged students.',
        ],
    ],
];

$candStmt = $pdo->prepare("
    INSERT INTO candidates (election_id, position_id, name, bio, manifesto)
    SELECT ?, ?, ?, ?, ?
    WHERE NOT EXISTS (
        SELECT 1 FROM candidates WHERE election_id = ? AND position_id = ? AND name = ?
    )
");

$seededCandCount = 0;
foreach ($candidatesData as $posName => $cands) {
    $pId = $positionIds[$posName];
    foreach ($cands as $c) {
        $candStmt->execute([
            $electionId, $pId, $c['name'], $c['bio'], $c['manifesto'],
            $electionId, $pId, $c['name']
        ]);
        $seededCandCount++;
    }
}
echo "✓ Candidates seeded ($seededCandCount candidates)\n";

// 6. Cast Sample Anonymized Votes for demonstration
$voteCount = $pdo->query("SELECT COUNT(*) FROM votes WHERE election_id = $electionId")->fetchColumn();
if ($voteCount == 0) {
    // Generate simulated voter hashes
    $candidates = $pdo->query("SELECT id, position_id FROM candidates WHERE election_id = $electionId")->fetchAll();
    $byPos = [];
    foreach ($candidates as $c) {
        $byPos[$c['position_id']][] = $c['id'];
    }

    $voteInsert = $pdo->prepare("
        INSERT INTO votes (election_id, position_id, candidate_id, voter_id_hash, timestamp)
        VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? MINUTE))
    ");

    $dummyVoterCount = 28;
    for ($i = 1; $i <= $dummyVoterCount; $i++) {
        $simulatedReg = sprintf("H23%04dA", $i + 100);
        foreach ($byPos as $pId => $candIds) {
            // Pick a candidate with some realistic distribution
            $selectedCand = ($i % 3 === 0) ? $candIds[1 % count($candIds)] : $candIds[0];
            $voterHash = hash('sha256', $simulatedReg . $pId);
            $minutesAgo = rand(10, 2800);
            try {
                $voteInsert->execute([$electionId, $pId, $selectedCand, $voterHash, $minutesAgo]);
            } catch (\Exception $e) {
                // ignore duplicates
            }
        }
    }
    echo "✓ Sample votes seeded for analytics and results visualization\n";
} else {
    echo "✓ Existing votes found ($voteCount votes)\n";
}

// 7. Seed Sample Audit Log
$auditCount = $pdo->query("SELECT COUNT(*) FROM audit_log")->fetchColumn();
if ($auditCount < 5) {
    $auditStmt = $pdo->prepare("
        INSERT INTO audit_log (action, user_id, details, ip_address, timestamp)
        VALUES (?, ?, ?, '127.0.0.1', DATE_SUB(NOW(), INTERVAL ? HOUR))
    ");
    $auditEvents = [
        ['ELECTION_CREATE', $adminId, json_encode(['name' => 'SRC General Elections 2026']), 48],
        ['CANDIDATE_CREATE', $adminId, json_encode(['name' => 'Tinashe Moyo', 'position' => 'President']), 46],
        ['CANDIDATE_CREATE', $adminId, json_encode(['name' => 'Kudzai Ndlovu', 'position' => 'President']), 46],
        ['LOGIN', $adminId, json_encode(['reg_number' => 'A999999Z']), 24],
        ['LOGIN', 2, json_encode(['reg_number' => 'H230828V']), 2],
    ];
    foreach ($auditEvents as $ev) {
        $auditStmt->execute([$ev[0], $ev[1], $ev[2], $ev[3]]);
    }
    echo "✓ Audit logs initialized\n";
}

echo "\n=== Seeding Finished Successfully! ===\n";
echo "You can now test:\n";
echo "1. Admin Login: A999999Z / #adm!n@sup3r\n";
echo "2. Voter Login: H230828V / Student@123\n";

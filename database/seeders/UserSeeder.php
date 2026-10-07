<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's users.
     */
    public function run(): void
    {
        $password = Hash::make('123');

        $users = [
            [
                'last_name' => 'ESCORPISO',
                'first_name' => 'EDUARDO',
                'middle_name' => 'CONSTANTINO',
                'department' => 'Office of the Schools Division Superintendent',
                'position' => 'Schools Division Superintendent',
                'is_head' => true,
            ],
            [
                'last_name' => 'RAMIRO',
                'first_name' => 'CHERYL',
                'middle_name' => 'RAYMUNDO',
                'department' => 'Office of the Assistant Schools Division Superintendent',
                'position' => 'Assistant Schools Division Superintendent',
                'is_head' => true,
            ],
            [
                'last_name' => 'GARCIA',
                'first_name' => 'JAKOB KERVIN',
                'middle_name' => 'MADDUMA',
                'department' => 'Legal Unit',
                'position' => 'Attorney III',
                'is_head' => true,
            ],
            [
                'last_name' => 'ANDAYA',
                'first_name' => 'FERMIN DAVE',
                'middle_name' => 'FELIX',
                'department' => 'Accounting Unit',
                'position' => 'Accountant III',
                'is_head' => true,
            ],
            [
                'last_name' => 'SACCUAN',
                'first_name' => 'KRISTIAN',
                'middle_name' => 'EUGENIO',
                'department' => 'ICT Unit',
                'position' => 'Information Technology Officer I',
                'is_head' => true,
            ],
            [
                'last_name' => 'BELTRAN',
                'first_name' => 'MARY ANN',
                'middle_name' => 'MARAMAG',
                'department' => 'Administrative Unit',
                'position' => 'Administrative Officer V',
                'is_head' => true,
            ],
            [
                'last_name' => 'BICLAR',
                'first_name' => 'VLADIMIR',
                'middle_name' => 'BAYSA',
                'department' => 'Budget Unit',
                'position' => 'Administrative Officer V',
                'is_head' => true,
            ],
            [
                'last_name' => 'JIMENEZ',
                'first_name' => 'JACQUELINE',
                'middle_name' => 'LALISAN',
                'department' => 'Records Unit',
                'position' => 'Administrative Officer IV',
                'is_head' => true,
            ],
            [
                'last_name' => 'CRISOSTOMO',
                'first_name' => 'JOYDEE',
                'middle_name' => 'SAN PEDRO',
                'department' => 'Human Resource Management Unit',
                'position' => 'Administrative Officer IV',
                'is_head' => true,
            ],
            [
                'last_name' => 'SORIANO',
                'first_name' => 'ADELINE',
                'middle_name' => 'CURAMPEZ',
                'department' => 'Supply Unit',
                'position' => 'Administrative Officer IV',
                'is_head' => true,
            ],
            [
                'last_name' => 'DE LEON',
                'first_name' => 'KEITH MAE',
                'middle_name' => 'CORTEZ',
                'department' => 'Procurement Unit',
                'position' => 'Administrative Officer IV',
                'is_head' => true,
            ],
            [
                'last_name' => 'YASTO',
                'first_name' => 'FROILAN',
                'middle_name' => 'DIQUIATCO',
                'department' => 'Cash Unit',
                'position' => 'Administrative Officer IV',
            ],
            [
                'last_name' => 'RAÑIN',
                'first_name' => 'LYLE PHILIPPE',
                'middle_name' => 'LARAGAN',
                'department' => 'Planning and Research Unit',
                'position' => 'Project Development Officer II',
            ],
            [
                'last_name' => 'DELA PEÑA',
                'first_name' => 'FATIMA',
                'middle_name' => 'CARGO',
                'department' => 'Legal Unit',
                'position' => 'Legal Assistant I',
            ],
            [
                'last_name' => 'MESA',
                'first_name' => 'HEIDELYN',
                'middle_name' => 'DAUAG',
                'department' => 'Office of the Assistant Schools Division Superintendent',
                'position' => 'Administrative Officer II',
            ],
            [
                'last_name' => 'PILARBA',
                'first_name' => 'MICHAEL',
                'middle_name' => 'SAGARIO',
                'department' => 'Human Resource Management Unit',
                'position' => 'Administrative Officer II',
            ],
            [
                'last_name' => 'BILGERA',
                'first_name' => 'LYMAR',
                'middle_name' => 'CASTILLO',
                'department' => 'Office of the Schools Division Superintendent',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'FERNANDEZ',
                'first_name' => 'JOLLY',
                'middle_name' => 'PIL',
                'department' => 'Cash Unit',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'ILINON',
                'first_name' => 'WEAN',
                'middle_name' => 'MAMURI',
                'department' => 'Human Resource Management Unit',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'DOMINO',
                'first_name' => 'RIZALDY',
                'middle_name' => 'CABASI',
                'department' => 'Human Resource Management Unit',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'MALENAB',
                'first_name' => 'LILIANNE FRANCE',
                'middle_name' => 'PESTANIO',
                'department' => 'Accounting Unit',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'TALOSIG',
                'first_name' => 'ENRICA MARIE',
                'middle_name' => 'YASTO',
                'department' => 'Human Resource Management Unit',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'COQUIAL',
                'first_name' => 'GELLI',
                'middle_name' => 'GILO',
                'department' => 'Accounting Unit',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'LIMON',
                'first_name' => 'MARK JOSEPH',
                'middle_name' => 'AGALOOS',
                'department' => 'Supply Unit',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'TUMALIUAN',
                'first_name' => 'NIKKI',
                'middle_name' => 'TAGAO',
                'department' => 'Office of the Schools Division Superintendent',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'SIBBALUCA',
                'first_name' => 'MARITES',
                'middle_name' => 'ALAGABAN',
                'department' => 'Administrative Unit',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'ANCHETA',
                'first_name' => 'JOHN REX',
                'middle_name' => 'SACCUAN',
                'department' => 'Office of the Assistant Schools Division Superintendent',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'BILGERA',
                'first_name' => 'RAE KYLE',
                'middle_name' => 'LARAGAN',
                'department' => 'Budget Unit',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'FELIPE',
                'first_name' => 'MAE-JANE',
                'middle_name' => 'NATIVIDAD',
                'department' => 'Budget Unit',
                'position' => 'Administrative Assistant III',
            ],
            [
                'last_name' => 'ROBLES',
                'first_name' => 'RONEALLE',
                'middle_name' => 'MOLINA',
                'department' => 'Administrative Unit',
                'position' => 'Administrative Assistant II',
            ],
            [
                'last_name' => 'BASSIG',
                'first_name' => 'KRYSTEL',
                'middle_name' => 'SORIANO',
                'department' => 'Budget Unit',
                'position' => 'Administrative Assistant I',
            ],
            [
                'last_name' => 'PANANGUI',
                'first_name' => 'ANGELICA',
                'middle_name' => 'CALATAYUD',
                'department' => 'Cash Unit',
                'position' => 'Administrative Aide VI',
            ],
            [
                'last_name' => 'SIMON',
                'first_name' => 'CRIZEL JOY',
                'middle_name' => 'APALLA',
                'department' => 'Administrative Unit',
                'position' => 'Administrative Aide VI',
            ],
            [
                'last_name' => 'PERALTA',
                'first_name' => 'RENELY',
                'middle_name' => 'DOMINGO',
                'department' => 'Office of the Schools Division Superintendent',
                'position' => 'Administrative Aide VI',
            ],
            [
                'last_name' => 'LAZAM',
                'first_name' => 'SAMUEL',
                'middle_name' => 'PAR',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Chief Education Supervisor',
            ],
            [
                'last_name' => 'UANIA',
                'first_name' => 'JOSEPH',
                'middle_name' => 'ROMERO',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'ZALUN',
                'first_name' => 'SAHLEE',
                'middle_name' => 'JACINTO',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'BERGONIA',
                'first_name' => 'VIRGINIA',
                'middle_name' => 'ABAD',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'AGTARAP',
                'first_name' => 'FRANCIS',
                'middle_name' => 'TAGARIAN',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'DELA CRUZ',
                'first_name' => 'EVA',
                'middle_name' => 'OCFEMIA',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'CAMBE',
                'first_name' => 'EMELYN',
                'middle_name' => 'TALAUE',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'AGUSTIN',
                'first_name' => 'IMELDA PATRICIA',
                'middle_name' => 'LUIS',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'ACOSTA',
                'first_name' => 'MARIA VISITACION',
                'middle_name' => 'ROMERO',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'DIQUIATCO',
                'first_name' => 'JOY',
                'middle_name' => 'JIMENEZ',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'MICU',
                'first_name' => 'NANETTE',
                'middle_name' => 'MARTINEZ',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'JUNATAS',
                'first_name' => 'MA. LOURDES',
                'middle_name' => 'ASUNCION',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Education Program Specialist II',
            ],
            [
                'last_name' => 'DOMINGO',
                'first_name' => 'MONINA NYMPHA',
                'middle_name' => 'CABRERA',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Librarian II',
            ],
            [
                'last_name' => 'ASTELERO',
                'first_name' => 'FERDINAND',
                'middle_name' => 'DACQUIL',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Project Development Officer II',
            ],
            [
                'last_name' => 'VEROSIL',
                'first_name' => 'JOAN',
                'middle_name' => 'SACCUAN',
                'department' => 'Curriculum Implementation Division',
                'position' => 'Administrative Aide VI',
            ],
            [
                'last_name' => 'GUMPAL',
                'first_name' => 'JULIET',
                'middle_name' => 'VALONES',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Chief Education Supervisor',
            ],
            [
                'last_name' => 'RAMOS',
                'first_name' => 'JOJO',
                'middle_name' => 'MAMAUAG',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Education Program Supervisor',
            ],
            [
                'last_name' => 'CAPILI',
                'first_name' => 'LOURDES RESURECCION',
                'middle_name' => 'MARIANO',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Medical Officer III',
            ],
            [
                'last_name' => 'BALTAZAR',
                'first_name' => 'EDEN',
                'middle_name' => 'BAYSA',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Senior Education Program Specialist',
            ],
            [
                'last_name' => 'NICASIO',
                'first_name' => 'NORBEN',
                'middle_name' => 'TAROBAL',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Planning Officer III',
            ],
            [
                'last_name' => 'UY',
                'first_name' => 'ROCHELLE',
                'middle_name' => 'QUERI',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Dentist II',
            ],
            [
                'last_name' => 'SILVA',
                'first_name' => 'NICOLE KRIS',
                'middle_name' => 'LAGGUI',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Education Program Specialist II',
            ],
            [
                'last_name' => 'DELA CRUZ',
                'first_name' => 'EDNA',
                'middle_name' => 'MATIAS',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Education Program Specialist II',
            ],
            [
                'last_name' => 'MIRANDILLA',
                'first_name' => 'SHARON',
                'middle_name' => 'DE VERA',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Nurse II',
            ],
            [
                'last_name' => 'ALZATE',
                'first_name' => 'KARLA MAE',
                'middle_name' => 'GARCIA',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Nurse II',
            ],
            [
                'last_name' => 'SORIANO',
                'first_name' => 'NIÑO ARTH',
                'middle_name' => 'CABILLAN',
                'department' => 'ICT Unit',
                'position' => 'Teacher II',
            ],
            [
                'last_name' => 'CABAUATAN',
                'first_name' => 'REYMOND',
                'middle_name' => 'CANTOR',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Engineer III',
            ],
            [
                'last_name' => 'CAGAYAN',
                'first_name' => 'KATELYN',
                'middle_name' => 'BALAYAN',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Engineer III',
            ],
            [
                'last_name' => 'APOLONIO',
                'first_name' => 'IAN JONAS',
                'middle_name' => 'BUENO',
                'department' => 'ICT Unit',
                'position' => 'COS - ICT SUPPORT STAFF',
            ],
            [
                'last_name' => 'CORPUZ',
                'first_name' => 'ROSMARK KEVIN',
                'middle_name' => 'NAVARRO',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Technical Assistant I',
            ],
            [
                'last_name' => 'LAGGUI',
                'first_name' => 'SANNIE JOHN',
                'middle_name' => 'BENITEZ',
                'department' => 'Schools Governance and Operations Division',
                'position' => 'Technical Assistant I',
            ]
        ];

        foreach ($users as $index => $userData) {

            /*
             * Handle the unidentified record separately.
             */
            if ($userData['department'] === null) {
                $user = User::updateOrCreate(
                    [
                        'email' => 'unidentified@sdo.local',
                    ],
                    [
                        'name' => 'Unidentified',
                        'department_id' => null,
                        'position' => null,
                        'is_head' => false,
                        'email_verified_at' => now(),
                        'password' => $password,
                    ]
                );

                $user->syncRoles(['user']);

                continue;
            }

            $department = Department::where(
                'name',
                $userData['department']
            )->first();

            if (!$department) {
                $this->command->warn(
                    "Department not found: {$userData['department']}"
                );

                continue;
            }

            /*
             * Build full name.
             */
            $name = trim(implode(' ', array_filter([
                $userData['first_name'],
                $userData['middle_name'],
                $userData['last_name'],
            ])));

            /*
             * Generate a stable email based on the
             * person's name.
             *
             * Example:
             * eduardo.escorpiso@sdo.local
             */
            $emailBase = Str::slug(
                $userData['first_name'] . ' ' . $userData['last_name'],
                '.'
            );

            $email = $emailBase . '@sdo.local';

            /*
             * Prevent duplicate emails.
             */
            $counter = 1;

            while (
                User::where('email', $email)->exists()
            ) {
                $email = $emailBase . $counter . '@sdo.local';
                $counter++;
            }

            /*
             * Create/update user.
             */
            $user = User::updateOrCreate(
                [
                    'email' => $email,
                ],
                [
                    'name' => $name,
                    'department_id' => $department->id,
                    'position' => $userData['position'],
                    'is_head' => false,
                    'email_verified_at' => now(),
                    'password' => $password,
                ]
            );

            /*
             * Assign Spatie role.
             */
            $user->syncRoles(['user']);
        }
    }
}

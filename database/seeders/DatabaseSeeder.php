<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);
        // User::factory(10)->create();
        $this->call([
            DepartmentSeeder::class,
            UserSeeder::class,
            // ProcurementSeeder::class,
            // ProcurementRouteSeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => '123@example.com',
            'password' => bcrypt('123'),
            'department_id' => 5,

        ]);
        $user->assignRole('user');

        $admin = User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@sdo.local',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
        ]);
        $admin->assignRole('admin');

        $admins = [
            [
                'name' => 'Keith Mae De Leon',
                'email' => 'keith.mae.de.leon@sdo.local',
                'role' => 'admin',
            ],
            [
                'name' => 'Cheryl Ramiro',
                'email' => 'cheryl.ramiro@sdo.local',
                'role' => 'admin',
            ],
        ];

        foreach ($admins as $adminData) {
            $admin = User::updateOrCreate(
                ['email' => $adminData['email']],
                [
                    'name' => $adminData['name'],
                    'password' => bcrypt('123'),
                ]
            );

            $admin->assignRole('admin');
        }
    }
}

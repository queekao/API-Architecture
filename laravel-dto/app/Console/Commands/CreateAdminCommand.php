<?php

namespace App\Console\Commands;

use App\Common\Enums\AdminRole;
use Illuminate\Console\Command;
use App\Models\Admin;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CreateAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create the admin user';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $username = $this->ask('Input new admin [Username] :');
        $usernameIsExist = Admin::where('username', $username)->count();
        if ($usernameIsExist > 0) {
            $this->error("The Username already exists!");
            return;
        }

        $passwrod = $this->ask('Input new admin [Password] :');
        $role = $this->ask('Input new admin [Role] : (' . join(', ', AdminRole::toValueArray()) . ')');
        $validator = Validator::make(['role' => $role], [
            'role' => ['required', 'string', Rule::in(AdminRole::toValueArray())],
        ]);
        if ($validator->fails()) {
            $this->error("Only accepet roles (" . join(', ', AdminRole::toValueArray()) . ')');
            return;
        }

        $validator = Validator::make(['username' => $username], [
            'username' => ['required', 'string'],
        ]);
        if ($validator->fails()) {
            $this->error("Invalid username format");
            return;
        }

        Admin::createNewAdmin($username, $passwrod, $role);

        $this->info('Done, successful create admin');

        return Command::SUCCESS;
    }
}

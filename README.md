# SERVER
## Requirements
- [Laravel](https://laravel.com/docs/6.x)
- [PHP](https://www.php.net/)
- [MySQL](https://www.mysql.com/)

## Local Setup
1. Clone the repository.
2. Go to `server` directory: `cd server`.
3. Copy the `.env.example` file and rename it to `.env`. \Update the database variables based on your local database config. \Create the database `laravel-react-books`.
4. Run the command `composer install` to install the packages/dependencies.
4. Run the command `php artisan key:generate`.
5. Run the command `php artisan migrate`.
6. Run the command `php artisan serve`.

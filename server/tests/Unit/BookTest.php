<?php

namespace Tests\Unit;

use App\Models\Book;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Testing\Fluent\AssertableJson;

class BookTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test GET /api/books/ endpoint
     * With data
     *
     * @return void
     */
    public function test_get_books_api_with_data()
    {
        $book1 = Book::factory()->create();
        $book2 = Book::factory()->create();
        $response = $this->getJson('api/books/');
 
        $response
            ->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'data'])
                    ->has('data.0', fn (AssertableJson $json) =>
                        $json->where('title', $book1->title)
                            ->where('author', $book1->author)
                            ->etc()
                    )
                    ->has('data.1', fn (AssertableJson $json) =>
                        $json->where('title', $book2->title)
                            ->where('author', $book2->author)
                            ->etc()
                    )
            );
    }

    /**
     * Test GET /api/books/ endpoint
     * With keyword for title
     *
     * @return void
     */
    public function test_get_books_api_search_title()
    {
        $book1 = Book::factory()->create();
        $book2 = Book::factory()->create();
        $response = $this->getJson('api/books/?keyword='.$book1->title);
 
        $response
            ->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'data'])
                    ->has('data', 1, fn (AssertableJson $json) =>
                        $json->where('title', $book1->title)
                            ->where('author', $book1->author)
                            ->etc()
                    )
            );
    }

    /**
     * Test GET /api/books/ endpoint
     * With keyword for author
     *
     * @return void
     */
    public function test_get_books_api_search_author()
    {
        $book1 = Book::factory()->create();
        $book2 = Book::factory()->create();
        $response = $this->getJson('api/books/?keyword='.$book2->author);
 
        $response
            ->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'data'])
                    ->has('data', 1, fn (AssertableJson $json) =>
                        $json->where('title', $book2->title)
                            ->where('author', $book2->author)
                            ->etc()
                    )
            );
    }

    /**
     * Test GET /api/books/ endpoint
     * With empty data
     *
     * @return void
     */
    public function test_get_books_api_without_data()
    {
        $response = $this->getJson('api/books/');
 
        $response
            ->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
            $json->hasAll(['status', 'data'])
                ->has('data', 0)
            );
    }

    /**
     * Test POST /api/books/ endpoint
     * With success response
     *
     * @return void
     */
    public function test_create_book_api_success()
    {
        $title = fake()->unique()->realText();
        $author = fake()->name();
        $response = $this->postJson('api/books/', [
            'title' => $title,
            'author' => $author,
        ]);
 
        $response
            ->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'data'])
                    ->has('data', fn (AssertableJson $json) => 
                        $json->where('title', $title)
                            ->where('author', $author)
                            ->etc()
                    )
            );
    }

    /**
     * Test POST /api/books/ endpoint
     * With no author provided
     *
     * @return void
     */
    public function test_create_book_api_no_author()
    {
        $title = fake()->unique()->realText();
        $response = $this->postJson('api/books/', [
            'title' => $title,
        ]);
 
        $response
            ->assertStatus(200)
            ->assertJsonMissingValidationErrors('title')
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'errors'])
                    ->where('status', 400)
                    ->missing('data')
                    ->whereAllType([
                        'errors' => 'array',
                        'errors.author.0' => 'string',
                    ])
                    ->has('errors.author', 1)
                    ->where('errors.author.0', 'The author field is required.')
            );
    }

    /**
     * Test POST /api/books/ endpoint
     * With no title provided
     *
     * @return void
     */
    public function test_create_book_api_no_title()
    {
        $author = fake()->name();
        $response = $this->postJson('api/books/', [
            'author' => $author,
        ]);
 
        $response
            ->assertStatus(200)
            ->assertJsonMissingValidationErrors('author')
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'errors'])
                    ->where('status', 400)
                    ->missing('data')
                    ->whereAllType([
                        'errors' => 'array',
                        'errors.title.0' => 'string',
                    ])
                    ->has('errors.title', 1)
                    ->where('errors.title.0', 'The title field is required.')
            );
    }

    /**
     * Test POST /api/books/ endpoint
     * Title and author max characters reached
     *
     * @return void
     */
    public function test_create_book_api_max_chars()
    {
        $title = fake()->unique()->realText(300);
        $author = fake()->sentence(300);
        $response = $this->postJson('api/books/', [
            'title' => $title,
            'author' => $author,
        ]);
 
        $response
            ->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'errors'])
                    ->where('status', 400)
                    ->missing('data')
                    ->whereAllType([
                        'errors' => 'array',
                        'errors.title.0' => 'string',
                        'errors.author.0' => 'string',
                    ])
                    ->has('errors.title', 1)
                    ->has('errors.author', 1)
            );
    }

    /**
     * Test POST /api/books/ endpoint
     * Title provided is not unique
     *
     * @return void
     */
    public function test_create_book_api_title_not_unique()
    {
        $book = Book::factory()->create();
        $author = fake()->name();
        $response = $this->postJson('api/books/', [
            'title' => $book->title,
            'author' => $author,
        ]);
 
        $response
            ->assertStatus(200)
            ->assertJsonMissingValidationErrors('author')
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'errors'])
                    ->where('status', 400)
                    ->missing('data')
                    ->whereAllType([
                        'errors' => 'array',
                        'errors.title.0' => 'string',
                    ])
                    ->has('errors.title', 1)
            );
    }

    /**
     * Test GET /api/books/{id} endpoint
     * With data
     *
     * @return void
     */
    public function test_get_book_api_with_data()
    {
        $book1 = Book::factory()->create();
        $response = $this->getJson('api/books/'.$book1->id);
 
        $response
            ->assertStatus(200)
            ->assertJsonPath('data.id', $book1->id)
            ->assertJsonPath('data.title', $book1->title)
            ->assertJsonPath('data.author', $book1->author);
    }

    /**
     * Test GET /api/books/{id} endpoint
     * Failed: Non-existing ID
     *
     * @return void
     */
    public function test_get_book_api_with_non_existing_id()
    {
        $response = $this->getJson('api/books/999');
 
        $response
            ->assertStatus(404)
            ->assertJsonMissing(['data']);
    }

    /**
     * Test PUT /api/books/{id} endpoint
     * Successful update
     *
     * @return void
     */
    public function test_update_book_api_success()
    {
        $book1 = Book::factory()->create();
        $response = $this->putJson('api/books/'.$book1->id, [
            'title' => 'Title 1',
            'author' => $book1->author,
        ]);
 
        $response
            ->assertStatus(200)
            ->assertJsonPath('data.id', $book1->id)
            ->assertJsonPath('data.title', 'Title 1')
            ->assertJsonPath('data.author', $book1->author);
    }

    /**
     * Test PUT /api/books/{id} endpoint
     * Failed: Non-existing ID
     *
     * @return void
     */
    public function test_update_book_api_with_non_existing_id()
    {
        $book1 = Book::factory()->create();
        $response = $this->putJson('api/books/999', [
            'title' => 'Title 1',
            'author' => $book1->author,
        ]);
 
        $response
            ->assertStatus(404)
            ->assertJsonMissing(['data']);
    }

    /**
     * Test PUT /api/books/{id} endpoint
     * With no author provided
     *
     * @return void
     */
    public function test_update_book_api_no_author()
    {
        $title = fake()->unique()->realText();
        $book1 = Book::factory()->create();
        $response = $this->putJson('api/books/'.$book1->id, [
            'title' => $title,
        ]);
 
        $response
            ->assertStatus(200)
            ->assertJsonMissingValidationErrors('title')
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'errors'])
                    ->where('status', 400)
                    ->missing('data')
                    ->whereAllType([
                        'errors' => 'array',
                        'errors.author.0' => 'string',
                    ])
                    ->has('errors.author', 1)
                    ->where('errors.author.0', 'The author field is required.')
            );
    }

    /**
     * Test PUT /api/books/{id} endpoint
     * With no title provided
     *
     * @return void
     */
    public function test_update_book_api_no_title()
    {
        $author = fake()->name();
        $book1 = Book::factory()->create();
        $response = $this->putJson('api/books/'.$book1->id, [
            'author' => $author,
        ]);
 
        $response
            ->assertStatus(200)
            ->assertJsonMissingValidationErrors('author')
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'errors'])
                    ->where('status', 400)
                    ->missing('data')
                    ->whereAllType([
                        'errors' => 'array',
                        'errors.title.0' => 'string',
                    ])
                    ->has('errors.title', 1)
                    ->where('errors.title.0', 'The title field is required.')
            );
    }

    /**
     * Test PUT /api/books/{id} endpoint
     * Title and author max characters reached
     *
     * @return void
     */
    public function test_update_book_api_max_characters_reached()
    {
        $title = fake()->sentence(300);
        $author = fake()->sentence(300);
        $book1 = Book::factory()->create();
        $response = $this->putJson('api/books/'.$book1->id, [
            'title' => $title,
            'author' => $author,
        ]);
 
        $response
            ->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'errors'])
                    ->where('status', 400)
                    ->missing('data')
                    ->whereAllType([
                        'errors' => 'array',
                        'errors.title.0' => 'string',
                        'errors.author.0' => 'string',
                    ])
                    ->has('errors.title', 1)
                    ->has('errors.author', 1)
            );
    }

    /**
     * Test PUT /api/books/{id} endpoint
     * Title provided is not unique
     *
     * @return void
     */
    public function test_update_book_api_title_not_unique()
    {
        $book1 = Book::factory()->create();
        $book2 = Book::factory()->create();
        $author = fake()->name();
        $response = $this->putJson('api/books/'.$book1->id, [
            'title' => $book2->title,
            'author' => $author,
        ]);
 
        $response
            ->assertStatus(200)
            ->assertJsonMissingValidationErrors('author')
            ->assertJson(fn (AssertableJson $json) =>
                $json->hasAll(['status', 'errors'])
                    ->where('status', 400)
                    ->missing('data')
                    ->whereAllType([
                        'errors' => 'array',
                        'errors.title.0' => 'string',
                    ])
                    ->has('errors.title', 1)
            );
    }

    /**
     * Test DELETE /api/books/{id} endpoint
     * Successful delete
     *
     * @return void
     */
    public function test_delete_book_api_success()
    {
        $book1 = Book::factory()->create();
        $response = $this->deleteJson('api/books/'.$book1->id);
 
        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => 'Successfully deleted the book.',
                'status' => 200,
                'data' => null,
            ]);
    }

    /**
     * Test DELETE /api/books/{id} endpoint
     * Failed: Non-existing ID
     *
     * @return void
     */
    public function test_delete_book_api_failed()
    {
        $book1 = Book::factory()->create();
        $response = $this->deleteJson('api/books/999');
 
        $response
            ->assertStatus(404)
            ->assertJsonMissing(['data', 'message', 'status']);
    }
}

<?php

namespace App\Repositories;

use App\Models\Book;

class BookRepository implements BookRepositoryInterface
{
  public function all()
  {
    return Book::all();
  }

  public function create(array $data)
  {
    return Book::create($data);
  }

  public function update(array $data, $id)
  {
    $book = Book::findOrFail($id);
    $book->update($data);
    return $book;
  }

  public function delete($id)
  {
    $book = Book::findOrFail($id);
    $book->delete();
  }

  public function find($id)
  {
    return Book::findOrFail($id);
  }
}
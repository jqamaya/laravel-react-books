<?php

namespace App\Services;

use App\Repositories\BookRepository;

class BookService
{
  /**
   * @var $bookRepository
   */
  protected $bookRepository;

  /**
   * BookService constructor
   * 
   * @param BookRepository $bookRepository
   */
  public function __construct(BookRepository $bookRepository
  ) {
    $this->bookRepository = $bookRepository;
  }

  public function create(array $data)
  {
    return $this->bookRepository->create($data);
  }

  public function update(array $data, $id)
  {
    return $this->bookRepository->update($data, $id);
  }

  public function delete($id)
  {
    return $this->bookRepository->delete($id);
  }

  public function all(array $query = [])
  {
    return $this->bookRepository->all($query);
  }
  
  public function find($id)
  {
    return $this->bookRepository->find($id);
  }
}
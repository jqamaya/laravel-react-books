<?php

namespace App\Http\Controllers;

use App\Services\BookService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
	private BookService $bookService;
	
	public function __construct(BookService $bookService
	) {
		$this->bookService = $bookService;
	}
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$query = [];
		if ($request->has('keyword')) {
			$query['keyword'] = $request->get('keyword');
		}
		$books = $this->bookService->all($query);

		return response()->json([
			'status' => 200,
			'data' => $books,
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		$validator = Validator::make($request->all(), [
			'title' => 'required|max:255|unique:books,title',
			'author' => 'required|max:255',
		]);

		if ($validator->fails()) {
			return response()->json([
				'status' => 400,
				'errors' => $validator->errors(),
			]);
		}

		$book = $this->bookService->create($request->all());

		return response()->json([
			'status' => 200,
			'data' => $book,
		]);
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		$book = $this->bookService->find($id);

		return response()->json([
			'status' => 200,
			'data' => $book,
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, string $id)
	{
		$validator = Validator::make($request->all(), [
			'title' => 'required|max:255|unique:books,title,'.$id,
			'author' => 'required|max:255',
			'id' => 'exists:books,id',
		]);

		if ($validator->fails()) {
			return response()->json([
				'status' => 400,
				'errors' => $validator->errors(),
			]);
		}

		$book = $this->bookService->update($request->all(), $id);

		return response()->json([
			'status' => 200,
			'data' => $book,
		]);
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(string $id)
	{
		$this->bookService->delete($id);

		return response()->json([
			'message' => 'Successfully deleted the book.',
			'status' => 200,
			'data' => null,
		]);
	}
}

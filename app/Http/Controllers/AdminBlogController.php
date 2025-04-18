<?php

namespace App\Http\Controllers;

use App\helpers\Uploader;
use App\Models\Blog;
use App\Models\Tag;

use function Pest\Laravel\delete;

class AdminBlogController extends Controller
{

    public $uploader;
    public function __construct(Uploader $uploader)
    {
        $this->uploader = $uploader;
    }
    public function index()
    {
        $blogs = Blog::with('author', 'tags')->whereNull('group_id')->latest()->paginate(10);
        return inertia('Admin/Blogs/Index', [
            'blogs' => $blogs,
        ]);
    }

    public function create()
    {
        $tags = Tag::all();
        return inertia('Admin/Blogs/BlogForm', [
            'type' => 'create',
            'tags' => $tags,
        ]);
    }

    public function edit(Blog $blog)
    {
        $tags = Tag::all();
        return inertia('Admin/Blogs/BlogForm', [
            'type' => 'edit',
            'blog' => $blog->load('tags'),
            'tags' => $tags,
        ]);
    }


    public function update(Blog $blog)
    {
        $validatedData = request()->validate([
            'image' => ['required'],
            'title' => ['required'],
            'content' => ['required'],
            'tags' => ['required']
        ]);
        $tag_ids = collect($validatedData['tags'])->map(function ($tag) {
            return $tag['value'];
        });
        unset($validatedData['tags']);
        if (request()->hasFile('image')) {
            $this->uploader->remove($blog->image);
            $validatedData['image'] = $this->uploader->upload($validatedData['image'], 'images');
        }
        $blog->update($validatedData);
        $blog->tags()->sync($tag_ids);
        return redirect()->route('admin.blogs')->with('success', 'Blog updated successfully');
    }

    public function store()
    {
        $validatedData = request()->validate([
            'image' => ['required', 'image'],
            'title' => ['required'],
            'content' => ['required'],
            'tags' => ['required']
        ]);
        $tag_ids = collect($validatedData['tags'])->map(function ($tag) {
            return $tag['value'];
        });
        unset($validatedData['tags']);
        $validatedData['author_id'] = auth()->id();
        $validatedData['image'] = $this->uploader->upload($validatedData['image'], 'images');
        $blog = Blog::create($validatedData);
        $blog->tags()->sync($tag_ids);
        return redirect()->route('admin.blogs')->with('success', 'Blog created successfully');
    }

    public function delete(Blog $blog)
    {
        $blog->delete();
        return redirect()->back()->with('success', 'Blog deleted successfully');
    }
}

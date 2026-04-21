<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Subscriber;
use Illuminate\Validation\Rule;

class GroupAdminSubscriberController extends Controller
{
    public function index(Group $group)
    {
        $data = [
            'search' => trim((string) request('search', '')),
            'period' => request('period'),
        ];

        $filters = validator($data, [
            'search' => ['nullable', 'string', 'max:255'],
            'period' => ['nullable', 'in:7d,30d,90d'],
        ])->validated();

        $query = $group->subscribers();

        if (($filters['search'] ?? '') !== '') {
            $like = '%'.$filters['search'].'%';
            $query->where('email', 'like', $like);
        }

        if (! empty($filters['period'])) {
            $days = match ($filters['period']) {
                '7d' => 7,
                '30d' => 30,
                '90d' => 90,
                default => null,
            };
            if ($days !== null) {
                $query->where('created_at', '>=', now()->subDays($days));
            }
        }

        $subscribers = $query->latest()->paginate(15)->withQueryString();

        return inertia('Group/Admin/Subscribers/Index', [
            'subscribers' => $subscribers,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'period' => $filters['period'] ?? null,
            ],
        ]);
    }

    public function edit(Group $group,Subscriber $subscriber){
        return inertia('Group/Admin/Subscribers/SubscriberForm',[
            'subscriber' => $subscriber,
        ]);
    }

    public function update(Group $group,Subscriber $subscriber){
        $validatedData = request()->validate([
            'email' => ['required','email',Rule::unique('subscribers','email')->ignore($subscriber->id)]
        ]);
        $subscriber->update($validatedData);
        return redirect(route('group.admin.subscribers'))->with('success','Subscriber updated Successful.');
    }

    public function delete(Group $group,Subscriber $subscriber){
        $subscriber->delete();
        return back()->with('success','Subscriber Deleted Successful.');
    }
}

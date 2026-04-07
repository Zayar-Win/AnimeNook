<?php

namespace App\Support;

use App\Models\Group;
use App\Models\User;

class CommentMentionLinker
{
    /**
     * Make @ visible to regex (Quill/sanitizers sometimes store @ as entities).
     */
    private static function normalizeAtSignEntities(string $html): string
    {
        return str_replace(
            ['&#64;', '&#x40;', '&#X40;', '&commat;'],
            '@',
            $html
        );
    }

    /**
     * Detect @Display Name in plain comment text (same rules as comment notifications).
     *
     * @return array<int, int>
     */
    public static function mentionedUserIdsFromPlainText(string $plain, Group $group, ?int $excludeUserId = null): array
    {
        $plain = preg_replace('/\s+/u', ' ', $plain) ?? $plain;

        $users = User::query()
            ->where('group_id', $group->id)
            ->when($excludeUserId, fn ($q) => $q->where('id', '!=', $excludeUserId))
            ->where('name', '!=', '')
            ->get(['id', 'name'])
            ->sortByDesc(fn ($u) => mb_strlen($u->name));

        $found = [];
        foreach ($users as $user) {
            $escaped = preg_quote($user->name, '/');
            if ($escaped === '') {
                continue;
            }
            if (preg_match('/@'.$escaped.'(?=\s|$|[.,!?;:\'"’”])/iu', $plain)) {
                $found[(int) $user->id] = true;
            }
        }

        return array_keys($found);
    }

    /**
     * @param  array<int>|null  $mentionedUserIds  Stored ids; if empty, detect from HTML body.
     */
    public static function mentionedUserIdsFromCommentHtml(string $html, Group $group, ?array $mentionedUserIds = null, ?int $excludeUserId = null): array
    {
        $ids = collect($mentionedUserIds ?? [])
            ->map(fn ($id) => (int) $id)
            ->filter(fn (int $id) => $id > 0)
            ->unique()
            ->values();

        if ($ids->isNotEmpty()) {
            return $ids->all();
        }

        $plain = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $plain = preg_replace('/\s+/u', ' ', $plain) ?? $plain;

        return self::mentionedUserIdsFromPlainText($plain, $group, $excludeUserId);
    }

    /**
     * Wrap @Name segments in anchor tags for members of the group.
     *
     * @param  array<int>|null  $mentionedUserIds
     */
    public static function linkifyBodyHtml(string $html, Group $group, ?array $mentionedUserIds = null, ?int $excludeUserId = null): string
    {
        if ($html === '' || $html === null) {
            return '';
        }

        $original = $html;
        $html = self::normalizeAtSignEntities($html);

        $ids = self::mentionedUserIdsFromCommentHtml($original, $group, $mentionedUserIds, $excludeUserId);
        if ($ids === []) {
            return $original;
        }

        $users = User::query()
            ->where('group_id', $group->id)
            ->whereIn('id', $ids)
            ->where('name', '!=', '')
            ->get(['id', 'name']);

        if ($users->isEmpty()) {
            $ids = self::mentionedUserIdsFromCommentHtml($original, $group, null, $excludeUserId);
            if ($ids === []) {
                return $original;
            }
            $users = User::query()
                ->where('group_id', $group->id)
                ->whereIn('id', $ids)
                ->where('name', '!=', '')
                ->get(['id', 'name']);
        }

        if ($users->isEmpty()) {
            return $original;
        }

        /*
         * Do not use /@([\p{L}\p{N}_\-. ]+)/ — space is allowed, so "@Name Hello" is one token and
         * never matches DB name "Name". Use exact full names (longest first), same boundaries as detection.
         */
        $sorted = $users->sortByDesc(fn (User $u) => mb_strlen($u->name))->values();
        $alternation = $sorted
            ->map(fn (User $u) => preg_quote($u->name, '/'))
            ->filter()
            ->implode('|');

        if ($alternation === '') {
            return $original;
        }

        $pattern = '/@('.$alternation.')(?=\s|$|[.,!?;:\'"’”]|<)/iu';

        $tokenToLink = [];
        $n = 0;

        $result = preg_replace_callback($pattern, function (array $m) use ($sorted, $group, &$tokenToLink, &$n) {
            $matched = $m[1];
            $user = $sorted->first(
                fn (User $u) => mb_strtolower($u->name) === mb_strtolower($matched)
            );
            if (! $user) {
                return $m[0];
            }
            $n++;
            $token = '{{{mention:'.$n.'}}}';
            $url = route('group.user.profile.show', ['group' => $group, 'user' => $user]);
            $tokenToLink[$token] = '<a href="'.e($url).'" class="comment-mention-link">@'.e($user->name).'</a>';

            return $token;
        }, $html);

        if ($result === null) {
            return $original;
        }

        foreach ($tokenToLink as $token => $link) {
            $result = str_replace($token, $link, $result);
        }

        return $result;
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non autenticato'], 401);
        }

        if ($request->user()->role && $request->user()->role->name !== $role) {
            return response()->json(['message' => 'Accesso negato'], 403);
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class ApiController extends Controller
{
    // Products
    public function getProducts(Request $request)
    {
        $query = Product::with(['variants.options']);

        if ($request->has('category')) {
            $query->where('category_slug', $request->category);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'LIKE', "%{$search}%");
        }

        $limit = $request->input('limit', 20);
        return response()->json($query->take($limit)->get());
    }

    public function getProduct($slug)
    {
        $product = Product::with(['variants.options'])->where('slug', $slug)->firstOrFail();
        return response()->json($product);
    }

    // Categories
    public function getCategories()
    {
        return response()->json(Category::all());
    }

    public function getCategory($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        return response()->json($category);
    }

    // Orders
    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'paymentMethod' => 'required|string',
            'shippingInfo' => 'required|array',
            'items' => 'required|array|min:1',
        ]);

        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $itemPrice = $item['price'] ?? $item['product']['price'] ?? 0;
            $quantity = $item['quantity'] ?? 1;
            $subtotal += (float)$itemPrice * (int)$quantity;
        }

        $shipping = $subtotal >= 200 ? 0 : 20;
        
        // Dynamically fetch Sanctum user securely if a token was passed, otherwise null (Guest)
        $userId = auth('sanctum')->check() ? auth('sanctum')->id() : null;

        $order = Order::create([
            'user_id' => $userId,
            'order_number' => 'TKL-' . date('Y') . '-' . strtoupper(Str::random(6)),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $subtotal + $shipping,
            'shipping_address' => $validated['shippingInfo'],
            'payment_method' => $validated['paymentMethod'],
        ]);

        foreach ($validated['items'] as $item) {
            $productData = $item['product'] ?? [];
            $order->items()->create([
                'product_id' => $item['productId'] ?? null,
                'product_name' => $productData['name'] ?? 'Product',
                'product_slug' => $productData['slug'] ?? null,
                'quantity' => $item['quantity'] ?? 1,
                'price' => $productData['price'] ?? $item['price'] ?? 0,
                'selected_variants' => $item['selectedVariants'] ?? null,
            ]);
        }

        return response()->json([
            'success' => true,
            'orderId' => $order->id,
            'orderNumber' => $order->order_number,
        ]);
    }

    public function getOrders(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
            
        return response()->json($orders);
    }

    public function getOrderById($idOrNumber)
    {
        $order = Order::with('items')->where('id', $idOrNumber)->orWhere('order_number', $idOrNumber)->firstOrFail();
        return response()->json($order);
    }

    // Auth
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'avatar' => Str::random(8),
        ]);

        return response()->json([
            'token' => $user->createToken('auth')->plainTextToken,
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password. Please try again.'], 401);
        }

        return response()->json([
            'token' => $user->createToken('auth')->plainTextToken,
            'user' => $user
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true]);
    }
}

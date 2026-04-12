<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProductVariantOption extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected $casts = [
        'in_stock' => 'boolean',
        'price_modifier' => 'float',
    ];

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}

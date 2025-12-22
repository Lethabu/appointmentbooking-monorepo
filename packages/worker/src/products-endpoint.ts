
export async function handleProductsEndpoint(request: Request, env: any, corsHeaders: any): Promise<Response> {
    const url = new URL(request.url);
    const categorySlug = url.searchParams.get('category');
    let query = `
        SELECT p.*, c.name as category_name, c.slug as category_slug 
        FROM products p
        LEFT JOIN product_categories c ON p.category_id = c.id
        WHERE p.is_active = 1
    `;

    const params: any[] = [];

    if (categorySlug && categorySlug !== 'all') {
        query += ` AND c.slug = ?`;
        params.push(categorySlug);
    }

    query += ` ORDER BY p.created_at DESC LIMIT 100`;

    const stmt = env.DB.prepare(query);
    const productsResult = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

    return new Response(JSON.stringify({
        products: productsResult.results || []
    }), {
        headers: corsHeaders
    });
}

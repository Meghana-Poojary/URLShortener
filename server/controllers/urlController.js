import { pool } from '../db.js';
import { base62Encode } from '../utils/base62.js';

export async function ShortenUrl(req, res) {
    const { longUrl } = req.body;
    const userId = req.user.id;

    try {
        const insert = await pool.query(
            "INSERT INTO urls (long_url, user_Id) VALUES ($1, $2) RETURNING id",
            [longUrl, userId]
        );
        const shortId = base62Encode(insert.rows[0].id);
        await pool.query(
            "UPDATE urls SET short_url = $1 WHERE id = $2",
            [shortId, insert.rows[0].id]
        );
        res.json({ shortUrl: `short_url/${shortId}` });
    } catch (err) {
        const existing = await pool.query(
            "SELECT short_url FROM urls WHERE long_url = $1 AND user_id = $2",
            [longUrl, userId]
        );
        if (existing.rowCount > 0) {
            return res.status(200).json({ shortUrl: `short_url/${existing.rows[0].short_url}`, existing: true });
        }

        // If no existing row found, propagate the error
        console.error('Failed to shorten URL', err);
        return res.status(500).json({ error: 'Failed to shorten URL' });
    }
}

export async function GetUrls(req, res) {
    const userId = req.user.id;

    const result = await pool.query(
        "SELECT id, long_url, short_url, created_at, clicks FROM urls WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    // Return empty array when no urls exist for the user instead of 404
    res.json({ urls: result.rows });
}


export async function RedirectUrl(req, res) {
    const { code } = req.params;

    const result = await pool.query(
        "SELECT id, long_url FROM urls WHERE short_url = $1",
        [code]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ error: "URL not found" });
    }

    const url = result.rows[0];

    await pool.query(
        "UPDATE urls SET clicks = clicks + 1 WHERE id = $1",
        [url.id]
    )
    await pool.query(
        "INSERT INTO url_visits (url_id, ip_address) VALUES ($1, $2)",
        [url.id, req.ip]
    );

    const accept = (req.headers.accept || '').toLowerCase();
    if (accept.includes('text/html')) {
        return res.redirect(url.long_url);
    }

    return res.json({ longUrl: url.long_url });

}

export async function DeleteUrl(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
        "DELETE FROM urls WHERE id = $1 AND user_id = $2 RETURNING id",
        [id, userId]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ error: "URL not found or unauthorized" });
    }

    res.status(200).json({ message: "URL deleted successfully" });
}

export async function GetAnalytics(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const urlResult = await pool.query(
        "SELECT id, clicks FROM urls WHERE id = $1 AND user_id = $2",
        [id, userId]
    );

    if (urlResult.rowCount === 0) {
        return res.status(404).json({ error: "URL not found or unauthorized" });
    }

    const visitsResults = await pool.query(
        "SELECT ip_address, visited_at FROM url_visits WHERE url_id = $1 ORDER BY visited_at DESC",
        [urlResult.rows[0].id]
    );

    res.json({
        visitCount: urlResult.rows[0].clicks,
        analytics: visitsResults.rows
    });
}
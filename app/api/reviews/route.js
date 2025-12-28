import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

function readDB() {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
}

function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function POST(request) {
    try {
        const { productId, user, rating, comment } = await request.json();
        const db = readDB();

        const productIndex = db.products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const newReview = {
            id: `r${Date.now()}`,
            user,
            rating,
            comment,
            date: new Date().toISOString().split('T')[0],
        };

        if (!db.products[productIndex].reviews) {
            db.products[productIndex].reviews = [];
        }

        db.products[productIndex].reviews.push(newReview);
        writeDB(db);

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
    }
}

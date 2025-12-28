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

export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.cms);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch CMS content' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { section, content } = await request.json();
        const db = readDB();

        if (!db.cms[section]) {
            return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
        }

        db.cms[section] = { ...db.cms[section], ...content };
        writeDB(db);

        return NextResponse.json(db.cms[section]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update CMS content' }, { status: 500 });
    }
}

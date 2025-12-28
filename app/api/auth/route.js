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
        const { action, email, password, name } = await request.json();
        const db = readDB();

        switch (action) {
            case 'login': {
                const user = db.users.find(
                    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
                );

                if (!user) {
                    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
                }

                const { password: _, ...userWithoutPassword } = user;
                return NextResponse.json({ user: userWithoutPassword });
            }

            case 'signup': {
                const existingUser = db.users.find(
                    u => u.email.toLowerCase() === email.toLowerCase()
                );

                if (existingUser) {
                    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
                }

                const newUser = {
                    id: Date.now().toString(),
                    name,
                    email,
                    password,
                    role: 'user',
                };

                db.users.push(newUser);
                writeDB(db);

                const { password: _, ...userWithoutPassword } = newUser;
                return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
            }

            case 'reset': {
                const user = db.users.find(
                    u => u.email.toLowerCase() === email.toLowerCase()
                );

                if (!user) {
                    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
                }

                // In a real app, send reset email
                return NextResponse.json({ message: 'Password reset email sent' });
            }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { setPreference } from '@/lib/data';

export async function PUT(req: NextRequest) {
  try {
    const { preferences } = await req.json() as {
      preferences: { key: string; value: string }[];
    };

    if (!Array.isArray(preferences)) {
      return NextResponse.json({ error: 'Invalid preferences format' }, { status: 400 });
    }

    for (const pref of preferences) {
      if (pref.key && typeof pref.value === 'string') {
        setPreference(pref.key, pref.value);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save preferences';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

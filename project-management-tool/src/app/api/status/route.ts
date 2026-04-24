import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assembly from '@/models/Assembly';
import Subassembly from '@/models/Subassembly';
import Component from '@/models/Component';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { type, itemId, status } = await request.json();

    if (!type || !itemId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let model;
    if (type === 'assembly') model = Assembly;
    else if (type === 'subassembly') model = Subassembly;
    else if (type === 'component') model = Component;
    else return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    const updatedItem = await model.findByIdAndUpdate(
      itemId,
      { status },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

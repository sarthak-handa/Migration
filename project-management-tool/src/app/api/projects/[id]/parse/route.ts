import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { parseProjectBOM } from '@/lib/parser';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.excelFile) {
      return NextResponse.json({ error: 'No Excel file associated with this project' }, { status: 400 });
    }

    await parseProjectBOM(id, project.excelFile);

    return NextResponse.json({ message: 'Excel parsed and hierarchy created successfully' });
  } catch (error: any) {
    console.error('Parsing error:', error);
    return NextResponse.json({ error: 'Failed to parse Excel file: ' + error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Assembly from '@/models/Assembly';
import Subassembly from '@/models/Subassembly';
import Component from '@/models/Component';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    // Fetch project with full hierarchy
    const project = await Project.findById(id).populate({
      path: 'assemblies',
      populate: {
        path: 'subassemblies',
        populate: {
          path: 'components'
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Also populate components directly under assemblies if any
    const populatedProject = await Project.findById(id).populate({
      path: 'assemblies',
      populate: [
        {
          path: 'subassemblies',
          populate: { path: 'components' }
        },
        {
          path: 'components'
        }
      ]
    });

    return NextResponse.json(populatedProject);
  } catch (error) {
    console.error('Fetch hierarchy error:', error);
    return NextResponse.json({ error: 'Failed to fetch project hierarchy' }, { status: 500 });
  }
}

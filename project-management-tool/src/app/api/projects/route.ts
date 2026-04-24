import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const formData = await request.formData();

    const projectData: any = {
      name: formData.get('name') as string,
      plannedStart: new Date(formData.get('plannedStart') as string),
      dueDate: new Date(formData.get('dueDate') as string),
      division: formData.get('division') as string,
      label: formData.get('label') as string,
      description: formData.get('description') as string,
    };

    // Handle file uploads
    const projectFile = formData.get('projectFile') as File;
    const excelFile = formData.get('excelFile') as File;

    if (projectFile) {
      const bytes = await projectFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${projectFile.name}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(filePath, buffer);
      projectData.projectFile = `/uploads/${fileName}`;
    }

    if (excelFile) {
      const bytes = await excelFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${excelFile.name}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      await writeFile(filePath, buffer);
      projectData.excelFile = `/uploads/${fileName}`;
    }

    const project = new Project(projectData);
    await project.save();

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
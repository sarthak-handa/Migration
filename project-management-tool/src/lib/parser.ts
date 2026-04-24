import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import Assembly from '@/models/Assembly';
import Subassembly from '@/models/Subassembly';
import Component from '@/models/Component';
import Project from '@/models/Project';

export async function parseProjectBOM(projectId: string, excelFilePath: string) {
  const filePath = path.join(process.cwd(), 'public', excelFilePath);
  if (!fs.existsSync(filePath)) {
    throw new Error('Excel file not found on server');
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet) as any[];

  // Clear existing hierarchy
  const existingAssemblies = await Assembly.find({ project: projectId });
  for (const assembly of existingAssemblies) {
    const subassemblies = await Subassembly.find({ assembly: assembly._id });
    for (const sub of subassemblies) {
      await Component.deleteMany({ subassembly: sub._id });
    }
    await Subassembly.deleteMany({ assembly: assembly._id });
    await Component.deleteMany({ assembly: assembly._id });
  }
  await Assembly.deleteMany({ project: projectId });

  const project = await Project.findById(projectId);
  if (!project) throw new Error('Project not found');
  project.assemblies = [];

  const assemblyMap = new Map<string, any>();
  const subassemblyMap = new Map<string, any>();

  for (const row of data) {
    const serialNo = String(row['Serial No'] || row['SerialNo'] || '').trim();
    const name = String(row['Name'] || '');
    const description = String(row['Description'] || '');

    if (!serialNo) continue;

    const parts = serialNo.split('.');

    if (parts.length === 1) {
      const assembly = new Assembly({
        project: projectId,
        serialNumber: serialNo,
        name: name,
        status: 'design'
      });
      await assembly.save();
      assemblyMap.set(serialNo, assembly);
      project.assemblies.push(assembly._id);
    } else if (parts.length === 2) {
      const assemblySerial = parts[0];
      const assembly = assemblyMap.get(assemblySerial);
      if (assembly) {
        const subassembly = new Subassembly({
          assembly: assembly._id,
          serialNumber: serialNo,
          name: name,
          status: 'design'
        });
        await subassembly.save();
        subassemblyMap.set(serialNo, subassembly);
        assembly.subassemblies.push(subassembly._id);
        await assembly.save();
      }
    } else if (parts.length === 3) {
      const subassemblySerial = `${parts[0]}.${parts[1]}`;
      const subassembly = subassemblyMap.get(subassemblySerial);
      if (subassembly) {
        const component = new Component({
          subassembly: subassembly._id,
          serialNumber: serialNo,
          name: name,
          description: description,
          status: 'design'
        });
        await component.save();
        subassembly.components.push(component._id);
        await subassembly.save();
      } else {
        const assemblySerial = parts[0];
        const assembly = assemblyMap.get(assemblySerial);
        if (assembly) {
           const component = new Component({
            assembly: assembly._id,
            serialNumber: serialNo,
            name: name,
            description: description,
            status: 'design'
          });
          await component.save();
          assembly.components.push(component._id);
          await assembly.save();
        }
      }
    }
  }

  await project.save();
}

export async function parseProjectFile(projectId: string, projectFilePath: string) {
  console.log(`Placeholder: Parsing .sl file for project ${projectId} at ${projectFilePath}`);
  // TODO: Implement reverse-engineering logic for .sl files
  // For now, this is a placeholder as the format is currently unknown.
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CreateProject() {
  const [formData, setFormData] = useState({
    name: '',
    plannedStart: '',
    dueDate: '',
    division: '',
    label: '',
    description: '',
    projectFile: null as File | null,
    excelFile: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('plannedStart', formData.plannedStart);
    data.append('dueDate', formData.dueDate);
    data.append('division', formData.division);
    data.append('label', formData.label);
    data.append('description', formData.description);
    if (formData.projectFile) data.append('projectFile', formData.projectFile);
    if (formData.excelFile) data.append('excelFile', formData.excelFile);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        // Redirect to home or project page
        window.location.href = '/';
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-center py-8">
        <Link href="/">
          <Image
            src="/YDLOGO.png"
            alt="YD Logo"
            width={100}
            height={50}
            priority
          />
        </Link>
      </header>
      <main className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-8">Create New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="plannedStart" className="block text-sm font-medium text-gray-700">Planned Start</label>
              <input
                type="date"
                id="plannedStart"
                name="plannedStart"
                value={formData.plannedStart}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-700">Division</label>
              <input
                type="text"
                id="division"
                name="division"
                value={formData.division}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700">Label</label>
              <input
                type="text"
                id="label"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
            <div className="space-y-4">
              <div>
                <label htmlFor="projectFile" className="block text-sm text-gray-600">Project File (.sl)</label>
                <input
                  type="file"
                  id="projectFile"
                  name="projectFile"
                  accept=".sl"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>
              <div>
                <label htmlFor="excelFile" className="block text-sm text-gray-600">Excel File (.xlsx)</label>
                <input
                  type="file"
                  id="excelFile"
                  name="excelFile"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Download the {' '}
              <a href="/templates/bom_template.xlsx" download className="text-red-500 hover:underline font-medium">
                excel template here
              </a>, 
              update the plan and upload updated file again.
              Please read instruction given in template carefully before uploading.
            </p>
          </div>
          <div className="flex justify-end space-x-4">
            <Link href="/" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Create Project
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
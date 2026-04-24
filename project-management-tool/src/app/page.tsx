'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  name: string;
  plannedStart: string;
  dueDate: string;
  status?: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, []);

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
      <main className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <Link href="/create-project" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
            Create Project
          </Link>
        </div>
        <div className="grid gap-4">
          {projects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-500">No projects yet. Create your first project!</p>
            </div>
          ) : (
            projects.map((project) => (
              <Link 
                key={project._id} 
                href={`/projects/${project._id}`} 
                className="group block border border-gray-200 rounded-xl p-6 hover:border-red-500 hover:shadow-sm transition-all bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-red-500 transition-colors">{project.name}</h2>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-500 flex items-center">
                        <span className="w-24 font-medium">Planned Start:</span>
                        {new Date(project.plannedStart).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <span className="w-24 font-medium">Due Date:</span>
                        {new Date(project.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

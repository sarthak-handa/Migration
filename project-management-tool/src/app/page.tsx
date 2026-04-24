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
        <Image
          src="/YDLOGO.png"
          alt="YD Logo"
          width={100}
          height={50}
          priority
        />
      </header>
      <main className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <Link href="/create-project" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Create Project
          </Link>
        </div>
        <div className="grid gap-4">
          {projects.length === 0 ? (
            <p>No projects yet. Create your first project!</p>
          ) : (
            projects.map((project) => (
              <div key={project._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-medium">{project.name}</h2>
                <p className="text-gray-600">Planned Start: {new Date(project.plannedStart).toLocaleDateString()}</p>
                <p className="text-gray-600">Due Date: {new Date(project.dueDate).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

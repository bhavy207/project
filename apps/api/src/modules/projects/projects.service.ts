import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectEntity {
  id: string;
  userId: string;
  name: string;
  description: string;
  repositoryUrl?: string;
  defaultBranch: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProjectsService {
  private projects: Map<string, ProjectEntity> = new Map();

  constructor() {
    // Seed initial demo project
    const demoProject: ProjectEntity = {
      id: '11111111-1111-1111-1111-111111111111',
      userId: '00000000-0000-0000-0000-000000000001',
      name: 'DevPilot Core Engine',
      description: 'Zero-cost autonomous pair programming agent platform',
      repositoryUrl: 'https://github.com/bhavy207/project.git',
      defaultBranch: 'main',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(demoProject.id, demoProject);
  }

  async findAll(userId: string): Promise<ProjectEntity[]> {
    return Array.from(this.projects.values()).filter((p) => p.userId === userId || !p.userId);
  }

  async findOne(id: string): Promise<ProjectEntity> {
    const project = this.projects.get(id);
    if (!project) throw new NotFoundException(`Project with ID ${id} not found`);
    return project;
  }

  async create(userId: string, data: { name: string; description: string; repositoryUrl?: string }): Promise<ProjectEntity> {
    const newProj: ProjectEntity = {
      id: uuidv4(),
      userId,
      name: data.name,
      description: data.description,
      repositoryUrl: data.repositoryUrl,
      defaultBranch: 'main',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(newProj.id, newProj);
    return newProj;
  }
}

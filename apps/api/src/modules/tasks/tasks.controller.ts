import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Query('projectId') projectId?: string) {
    return this.tasksService.findAll(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  async create(@Body() body: { projectId: string; title: string; description: string }) {
    return this.tasksService.create(body);
  }

  @Post(':id/execute')
  async execute(@Param('id') id: string, @Body() body: { targetFile?: string }) {
    return this.tasksService.executeTaskWorkflow(id, body?.targetFile || 'src/feature.ts');
  }
}

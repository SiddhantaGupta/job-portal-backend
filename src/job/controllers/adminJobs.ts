import { Controller, Get, Patch, Req, Res } from '@nestjs/common';
import { Request, RestController, Response } from '@libs/boat';
import { AdminJobsService } from '@app/job/providers';
import { Auth } from '@app/auth/decorators/auth';
import {
  ApplicationDetailTransformer,
  JobDetailTransformer,
} from '@app/transformer';
import {
  IApplicationSearchModel,
  IJobSearchModel,
  IPagination,
} from '../interfaces';
import { ApplicationDto, JobIdDto } from '../dtos';

@Auth('admin')
@Controller('admin/jobs')
export class AdminJobsController extends RestController {
  constructor(private adminJobsService: AdminJobsService) {
    super();
  }

  @Get('')
  async getJobs(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const jobs = await this.adminJobsService.getJobs(
      req.all() as IJobSearchModel,
    );
    return res.withMeta(
      await this.paginate(jobs, new JobDetailTransformer(), { req }),
    );
  }

  @Get('applications')
  async getApplications(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const applications = await this.adminJobsService.getApplications(
      req.all() as IApplicationSearchModel,
    );
    return res.withMeta(
      await this.paginate(applications, new ApplicationDetailTransformer(), {
        req,
      }),
    );
  }

  @Get('application')
  async getApplicationById(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const application = await this.adminJobsService.getApplicationById(
      req.all() as ApplicationDto,
    );
    return res.success(
      await this.transform(application, new ApplicationDetailTransformer(), {
        req,
      }),
    );
  }

  @Get(':id')
  async getJobById(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    let job = await this.adminJobsService.getJobById(req.all() as JobIdDto);
    return res.success(
      await this.transform(job, new JobDetailTransformer(), { req }),
    );
  }

  @Patch(':id')
  async updateJobStatus(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const updatedJob = await this.adminJobsService.updateJobStatus(
      req.all() as JobIdDto,
    );
    return res.success(
      await this.transform(updatedJob, new JobDetailTransformer(), { req }),
    );
  }
}

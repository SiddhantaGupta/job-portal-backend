import { Controller, Get, Patch, Req, Res } from '@nestjs/common';
import { Request, RestController, Response } from '@libs/boat';
import { AdminJobsService } from '@app/job/providers';
import { Auth } from '@app/auth/decorators/auth';
import {
  ApplicationDetailTransformer,
  JobDetailTransformer,
} from '@app/transformer';

@Auth('admin')
@Controller('admin/jobs')
export class AdminJobsController extends RestController {
  constructor(private adminJobsService: AdminJobsService) {
    super();
  }

  @Get('')
  async jobs(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const jobs = await this.adminJobsService.jobs(req.all(), req.user);
    return res.success(
      await this.collection(jobs, new JobDetailTransformer(), { req }),
    );
  }

  @Get('applications')
  async applications(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const applications = await this.adminJobsService.applications(
      req.all(),
      req.user,
    );
    return res.success(
      await this.collection(applications, new ApplicationDetailTransformer(), {
        req,
      }),
    );
  }

  @Get('application')
  async application(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const application = await this.adminJobsService.application(
      req.all(),
      req.user,
    );
    return res.success(
      await this.transform(application, new ApplicationDetailTransformer(), {
        req,
      }),
    );
  }

  @Get(':id')
  async job(@Req() req: Request, @Res() res: Response): Promise<Response> {
    let job = await this.adminJobsService.job(req.all(), req.user);
    return res.success(
      await this.transform(job, new JobDetailTransformer(), { req }),
    );
  }

  @Patch(':id')
  async updateJob(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const updatedJob = await this.adminJobsService.updateJobStatus(
      req.all(),
      req.user,
    );
    return res.success(
      await this.transform(updatedJob, new JobDetailTransformer(), { req }),
    );
  }
}
